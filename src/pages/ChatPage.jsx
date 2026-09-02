
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import api from "@/api/api";

import {
  ArrowLeft,
  Bot,
  Check,
  Copy,
  ExternalLink,
  FileCode2,
  Loader2,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  Square,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

// =====================================================
// CHAT PAGE
// =====================================================

function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ===================================================
  // REFS
  // ===================================================

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const textareaRef = useRef(null);

  // =====================================================
  // LOAD SESSIONS
  // =====================================================

  const loadSessions = async () => {
    if (!id) {
      return;
    }

    try {
      setLoadingSessions(true);
      setError(null);

      const response = await api.get("/chat/sessions", {
        params: {
          repositoryId: id,
        },
      });

      const loadedSessions =
        Array.isArray(response) ? response : [];

      setSessions(loadedSessions);

      if (loadedSessions.length > 0) {
        const firstSession = loadedSessions[0];

        setSelectedSession(firstSession);

        await loadMessages(firstSession.id);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);

      setError(
        getErrorMessage(
          err,
          "Failed to load chat sessions."
        )
      );
    } finally {
      setLoadingSessions(false);
    }
  };

  // =====================================================
  // LOAD MESSAGES
  // =====================================================

  const loadMessages = async (sessionId) => {
    if (!sessionId) {
      return;
    }

    try {
      setLoadingMessages(true);
      setError(null);

      const response = await api.get(
        `/chat/sessions/${sessionId}`
      );

      setMessages(
        Array.isArray(response) ? response : []
      );
    } catch (err) {
      console.error("Failed to load messages:", err);

      setError(
        getErrorMessage(
          err,
          "Failed to load messages."
        )
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadSessions();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [id]);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =====================================================
  // CREATE SESSION
  // =====================================================

  const createSession = async (title) => {
    if (!id || !title?.trim()) {
      return null;
    }

    try {
      setError(null);

      const response = await api.post(
        "/chat/sessions",
        {
          repositoryId: id,
          title: title.trim(),
        }
      );

      const newSession = response;

      setSessions((previous) => [
        newSession,
        ...previous,
      ]);

      setSelectedSession(newSession);
      setMessages([]);

      return newSession;
    } catch (err) {
      console.error(
        "Session creation failed:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to create chat session."
        )
      );

      return null;
    }
  };

  // =====================================================
  // SELECT SESSION
  // =====================================================

  const handleSelectSession = async (session) => {
    if (streaming || loadingMessages) {
      return;
    }

    setSelectedSession(session);
    setMessages([]);

    await loadMessages(session.id);

    setSidebarOpen(false);
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSendMessage = async () => {
    const content = input.trim();

    if (!content || streaming || !id) {
      return;
    }

    // -----------------------------------------------
    // CREATE SESSION
    // -----------------------------------------------

    let session = selectedSession;

    if (!session) {
      session = await createSession(content);

      if (!session) {
        return;
      }
    }

    // -----------------------------------------------
    // USER MESSAGE
    // -----------------------------------------------

    const userMessage = {
      id: `temp-user-${Date.now()}`,
      role: "USER",
      content,
      citations: [],
      createdAt: new Date().toISOString(),
    };

    // -----------------------------------------------
    // ASSISTANT PLACEHOLDER
    // -----------------------------------------------

    const assistantId =
      `temp-assistant-${Date.now()}`;

    const assistantMessage = {
      id: assistantId,
      role: "ASSISTANT",
      content: "",
      citations: [],
      createdAt: new Date().toISOString(),
      streaming: true,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
    setStreaming(true);
    setError(null);

    // -----------------------------------------------
    // ABORT CONTROLLER
    // -----------------------------------------------

    const controller = new AbortController();

    abortControllerRef.current = controller;

    try {
      // ---------------------------------------------
      // SSE REQUEST
      // ---------------------------------------------
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URI}/chat/sessions/${session.id}/messages`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            content,
          }),
          signal: controller.signal,
        }
      );

      // ---------------------------------------------
      // HTTP ERROR
      // ---------------------------------------------

      if (!response.ok) {
        let message =
          `Request failed (${response.status})`;

        try {
          const data = await response.json();

          message =
            data?.message ||
            message;
        } catch {
          // Response was not JSON
        }

        throw new Error(message);
      }

      if (!response.body) {
        throw new Error(
          "Streaming is not supported by this browser."
        );
      }

      // ---------------------------------------------
      // READ STREAM
      // ---------------------------------------------

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder("utf-8");

      let buffer = "";

      while (true) {
        const {
          value,
          done,
        } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(
          value,
          {
            stream: true,
          }
        );

        const events =
          buffer.split("\n\n");

        buffer =
          events.pop() || "";

        for (const event of events) {
          processSseEvent(
            event,
            assistantId
          );
        }
      }

      // ---------------------------------------------
      // REMAINING BUFFER
      // ---------------------------------------------

      if (buffer.trim()) {
        processSseEvent(
          buffer,
          assistantId
        );
      }

      // ---------------------------------------------
      // STREAM FINISHED
      // ---------------------------------------------

      setMessages((previous) =>
        previous.map((message) => {
          if (
            message.id === assistantId
          ) {
            return {
              ...message,
              streaming: false,
            };
          }

          return message;
        })
      );
    } catch (err) {
      if (err?.name === "AbortError") {
        setMessages((previous) =>
          previous.map((message) => {
            if (
              message.id === assistantId
            ) {
              return {
                ...message,
                streaming: false,
              };
            }

            return message;
          })
        );

        return;
      }

      console.error(
        "Chat streaming failed:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to send message."
        )
      );

      setMessages((previous) =>
        previous.filter(
          (message) =>
            message.id !== assistantId
        )
      );
    } finally {
      setStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // =====================================================
  // PROCESS SSE EVENT
  // =====================================================

  const processSseEvent = (
    event,
    assistantId
  ) => {
    const lines = event.split("\n");

    let data = "";

    for (const line of lines) {
      if (line.startsWith("data:")) {
        data += line
          .substring(5)
          .trimStart();
      }
    }

    if (!data) {
      return;
    }

    let parsed = null;

    try {
      parsed = JSON.parse(data);
    } catch {
      // Plain text SSE
    }

    let chunk = data;
    let citations = null;

    if (
      parsed &&
      typeof parsed === "object"
    ) {
      chunk =
        parsed.content ??
        parsed.text ??
        parsed.delta ??
        parsed.data ??
        "";

      citations =
        parsed.citations ?? null;
    }

    if (!chunk && !citations) {
      return;
    }

    setMessages((previous) =>
      previous.map((message) => {
        if (
          message.id === assistantId
        ) {
          return {
            ...message,
            content:
              message.content + chunk,
            citations:
              citations ??
              message.citations ??
              [],
          };
        }

        return message;
      })
    );
  };

  // =====================================================
  // STOP STREAM
  // =====================================================

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setStreaming(false);
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/dashboard/repositories");
  };

  // =====================================================
  // NEW CHAT
  // =====================================================

  const handleNewChat = () => {
    if (streaming) {
      return;
    }

    setSelectedSession(null);
    setMessages([]);
    setError(null);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          flex w-[290px] flex-col
          border-r border-border/60
          bg-background/95
          backdrop-blur-xl
          transition-transform duration-300
          md:relative md:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Sidebar Header */}

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-4">

          <div className="flex items-center gap-3">

            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
              <Bot className="h-4.5 w-4.5" />

              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                Repository Chat
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                AI workspace
              </p>
            </div>

          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>

        </div>

        {/* New Chat */}

        <div className="p-3">

          <Button
            variant="outline"
            disabled={streaming}
            onClick={handleNewChat}
            className="
              h-10 w-full justify-start gap-2.5
              rounded-xl border-border/70
              bg-card/50
              shadow-sm
              transition-all
              hover:border-primary/30
              hover:bg-primary/5
              hover:text-primary
            "
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <MessageSquarePlus className="h-3.5 w-3.5" />
            </div>

            <span className="text-sm font-medium">
              New conversation
            </span>
          </Button>

        </div>

        {/* Sessions */}

        <div className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Conversations
            </span>

            {sessions.length > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                {sessions.length}
              </span>
            )}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1 px-3">

          <div className="pb-5">

            {loadingSessions ? (

              <div className="flex flex-col items-center justify-center gap-3 py-12">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-muted/30">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>

                <span className="text-xs text-muted-foreground">
                  Loading conversations...
                </span>

              </div>

            ) : sessions.length === 0 ? (

              <div className="mx-2 mt-4 rounded-xl border border-dashed border-border/70 bg-muted/10 px-4 py-8 text-center">

                <MessageSquarePlus className="mx-auto h-5 w-5 text-muted-foreground/60" />

                <p className="mt-3 text-xs font-medium">
                  No conversations
                </p>

                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  Start asking questions about your repository.
                </p>

              </div>

            ) : (

              <div className="space-y-1.5">

                {sessions.map((session) => (

                  <button
                    key={session.id}
                    type="button"
                    disabled={streaming}
                    onClick={() =>
                      handleSelectSession(session)
                    }
                    className={`
                      group flex w-full items-center gap-3
                      rounded-xl border px-3 py-2.5
                      text-left transition-all
                      disabled:pointer-events-none

                      ${
                        selectedSession?.id ===
                        session.id
                          ? `
                            border-primary/20
                            bg-primary/[0.07]
                            shadow-sm
                          `
                          : `
                            border-transparent
                            hover:border-border/60
                            hover:bg-muted/40
                          `
                      }
                    `}
                  >

                    <div
                      className={`
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-lg
                        ${
                          selectedSession?.id ===
                          session.id
                            ? "bg-primary/10 text-primary"
                            : "bg-muted/60 text-muted-foreground"
                        }
                      `}
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5" />
                    </div>

                    <span className="min-w-0 flex-1 truncate text-sm">
                      {session.title ||
                        "Conversation"}
                    </span>

                    {selectedSession?.id ===
                      session.id && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}

                  </button>

                ))}

              </div>

            )}

          </div>

        </ScrollArea>

        {/* Sidebar Footer */}

        <div className="border-t border-border/60 p-3">

          <div className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5">

            <div className="flex items-center gap-2">

              <div className="h-1.5 w-1.5 rounded-full bg-primary" />

              <span className="text-[11px] font-medium">
                Repository connected
              </span>

            </div>

            <p className="mt-1 pl-3.5 text-[10px] text-muted-foreground">
              Ask about files, code & architecture
            </p>

          </div>

        </div>

      </aside>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          MAIN
      ================================================= */}

      <section className="flex min-w-0 flex-1 flex-col bg-background">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-3 backdrop-blur-xl sm:px-5">

          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() =>
              setSidebarOpen(
                (previous) => !previous
              )
            }
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>

          <Separator
            orientation="vertical"
            className="mx-1 h-6"
          />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg text-muted-foreground hover:text-foreground"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0 flex-1">

            <div className="flex items-center gap-2">

              <p className="truncate text-sm font-semibold tracking-tight">
                {selectedSession?.title ||
                  "Repository Chat"}
              </p>

              {streaming && (
                <span className="hidden rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-primary sm:inline-flex">
                  Generating
                </span>
              )}

            </div>

            <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
              Ask questions about your indexed repository
            </p>

          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={streaming}
            onClick={handleNewChat}
            className="
              hidden h-9 gap-2 rounded-lg
              border-border/70
              bg-background/50
              sm:flex
            "
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            New chat
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={streaming}
            onClick={handleNewChat}
            className="rounded-lg sm:hidden"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </Button>

        </header>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="shrink-0 px-4 pt-3 sm:px-6">
            <Alert
              variant="destructive"
              className="rounded-xl"
            >
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* =================================================
            MESSAGES
        ================================================= */}

        <main className="min-h-0 flex-1 overflow-y-auto">

          <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">

            {/* Empty state */}

            {!selectedSession &&
              !loadingSessions &&
              messages.length === 0 && (

                <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">

                  <div className="relative">

                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-primary/[0.06] shadow-sm">
                      <Bot className="h-9 w-9 text-primary" />
                    </div>

                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                    </div>

                  </div>

                  <div className="mt-7">

                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                      Repository intelligence
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight">
                      Understand your codebase
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                      Ask questions about your indexed repository,
                      architecture, authentication, APIs,
                      implementation details, and more.
                    </p>

                  </div>

                  {/* Suggested questions */}

                  <div className="mt-9 grid w-full max-w-2xl gap-3 sm:grid-cols-2">

                    {[
                      "Explain the project architecture",
                      "How does authentication work?",
                      "Where is the GitHub API used?",
                      "Explain the indexing flow",
                    ].map((suggestion) => (

                      <button
                        key={suggestion}
                        type="button"
                        onClick={() =>
                          setInput(suggestion)
                        }
                        className="
                          group flex items-start gap-3
                          rounded-xl border border-border/60
                          bg-card/40 px-4 py-3.5
                          text-left text-sm
                          shadow-sm
                          transition-all
                          hover:-translate-y-0.5
                          hover:border-primary/25
                          hover:bg-primary/[0.035]
                          hover:shadow-md
                        "
                      >

                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                          <MessageSquarePlus className="h-3 w-3" />
                        </div>

                        <span className="leading-5">
                          {suggestion}
                        </span>

                      </button>

                    ))}

                  </div>

                </div>
              )}

            {/* Loading */}

            {selectedSession &&
              loadingMessages && (

                <div className="flex min-h-[45vh] flex-col items-center justify-center">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-muted/30">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">
                    Loading conversation...
                  </p>

                </div>
              )}

            {/* Messages */}

            {!loadingMessages && (
              <div className="space-y-10">

                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                  />
                ))}

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

        </main>

        {/* =================================================
            INPUT
        ================================================= */}

        <div className="shrink-0 border-t border-border/60 bg-background/80 px-3 py-3 backdrop-blur-xl sm:px-5 sm:py-4">

          <div className="mx-auto w-full max-w-5xl">

            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 shadow-sm transition-all focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5">

              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                disabled={streaming}
                placeholder="Ask anything about your repository..."
                className="
                  min-h-[68px]
                  resize-none
                  border-0
                  bg-transparent
                  px-4
                  py-4
                  pr-14
                  text-sm
                  leading-6
                  shadow-none
                  placeholder:text-muted-foreground/70
                  focus-visible:ring-0
                "
                rows={1}
              />

              <div className="absolute bottom-2.5 right-2.5">

                {streaming ? (

                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleStop}
                    title="Stop generating"
                    className="h-9 w-9 rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                  >
                    <Square
                      className="h-3.5 w-3.5 fill-current"
                    />
                  </Button>

                ) : (

                  <Button
                    type="button"
                    size="icon"
                    disabled={
                      !input.trim() || !id
                    }
                    onClick={
                      handleSendMessage
                    }
                    title="Send message"
                    className="h-9 w-9 rounded-xl shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>

                )}

              </div>

            </div>

            <div className="flex items-center justify-center gap-2 pt-2">

              <span className="text-[10px] text-muted-foreground">
                Enter to send
              </span>

              <span className="text-border">
                ·
              </span>

              <span className="text-[10px] text-muted-foreground">
                Shift + Enter for new line
              </span>

            </div>

          </div>

        </div>

      </section>
    </div>
  );
}

// =====================================================
// CHAT MESSAGE
// =====================================================

function ChatMessage({ message }) {
  const isUser =
    message.role === "USER";

  return (
    <div
      className={`
        group flex w-full gap-3
        ${
          isUser
            ? "justify-end"
            : "justify-start"
        }
      `}
    >

      {/* =================================================
          ASSISTANT
      ================================================= */}

      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.06] text-primary shadow-sm">
          <Bot className="h-4 w-4" />
        </div>
      )}

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className={`
          min-w-0 max-w-[96%]
          text-sm leading-7
          sm:max-w-[88%]

          ${
            isUser
              ? "order-1"
              : ""
          }
        `}
      >

        {/* Message label */}

        <div
          className={`
            mb-2 flex items-center gap-2
            ${
              isUser
                ? "justify-end"
                : "justify-start"
            }
          `}
        >

          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {isUser ? "You" : "Repository AI"}
          </span>

          {message.streaming && (
            <span className="flex items-center gap-1 text-[10px] text-primary">
              <span className="h-1 w-1 animate-pulse rounded-full bg-primary" />
              Thinking
            </span>
          )}

        </div>

        {/* =================================================
            MESSAGE CONTENT

            Intentionally NO background/bubble.
        ================================================= */}

        <div
          className={`
            ${
              isUser
                ? "text-right"
                : "text-left"
            }
          `}
        >

          <MarkdownContent
            content={message.content}
            streaming={message.streaming}
          />

          {!isUser &&
            message.citations?.length > 0 && (
              <CitationList
                citations={message.citations}
              />
            )}

        </div>

      </div>

      {/* =================================================
          USER
      ================================================= */}

      {isUser && (
        <div className="order-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
          <User className="h-4 w-4" />
        </div>
      )}

    </div>
  );
}

// =====================================================
// MARKDOWN CONTENT
// =====================================================

// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// Assuming CodeBlock is imported somewhere up here

function MarkdownContent({ content, streaming }) {
  if (!content) {
    return streaming ? (
      <div className="flex items-center gap-1.5 py-4 text-primary">
        <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
      </div>
    ) : null;
  }

  return (
    <div className="max-w-none text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headers
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 mb-4 border-b border-border/50 pb-2 text-xl font-semibold tracking-tight text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-3 text-lg font-semibold tracking-tight text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-6 mb-2 text-base font-semibold text-foreground">
              {children}
            </h4>
          ),

          // Typography
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-foreground/90 last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/90">{children}</em>
          ),
          del: ({ children }) => (
            <del className="line-through text-muted-foreground">{children}</del>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="mb-4 ml-2 list-outside list-disc space-y-2 pl-4 marker:text-foreground/60">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-2 list-outside list-decimal space-y-2 pl-4 marker:text-foreground/60">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-foreground/90 pl-1">
              {children}
            </li>
          ),

          // Links & Media
          a: ({ children, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="my-6 max-w-full rounded-xl border border-border/50 shadow-sm"
            />
          ),
          hr: () => (
            <hr className="my-8 border-t border-border/50" />
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-4 border-muted-foreground/30 bg-muted/20 px-5 py-3 text-muted-foreground rounded-r-lg [&>p]:mb-0">
              {children}
            </blockquote>
          ),

          // Code
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "text";
            const codeString = String(children).replace(/\n$/, "");

            // Inline Code formatting
            if (inline || !match) {
              return (
                <code
                  className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.875em] font-medium text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Code Block formatting (using your existing CodeBlock component)
            return (
              <div className="my-6">
                <CodeBlock language={language} code={codeString} />
              </div>
            );
          },

          // Tables
          table: ({ children }) => (
            <div className="my-6 w-full overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm text-left">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/50">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/20 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-foreground/80">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
// =====================================================
// CODE BLOCK
// =====================================================

function CodeBlock({
  language,
  code,
}) {
  const [copied, setCopied] =
    useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        code
      );

      setCopied(true);

      setTimeout(
        () => setCopied(false),
        1500
      );
    } catch (err) {
      console.error(
        "Failed to copy code:",
        err
      );
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border/70 bg-muted/20 shadow-sm">

      {/* =================================================
          CODE HEADER
      ================================================= */}

      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-2">

        <div className="flex items-center gap-2">

          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileCode2 className="h-3.5 w-3.5" />
          </div>

          <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {language}
          </span>

        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="
            h-7
            gap-1.5
            rounded-md
            px-2
            text-xs
            text-muted-foreground
            hover:bg-accent
            hover:text-foreground
          "
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-primary" />
              <span className="text-primary">
                Copied
              </span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>

      </div>

      {/* =================================================
          CODE
      ================================================= */}

      <pre
        className="
          m-0
          overflow-x-auto
          bg-muted/20
          p-4
          text-[13px]
          leading-6
          text-foreground
        "
      >
        <code className="font-mono">
          {code}
        </code>
      </pre>

    </div>
  );
}

// =====================================================
// CITATION LIST
// =====================================================

function CitationList({
  citations,
}) {
  return (
    <div className="mt-8 border-t border-border/60 pt-4">

      {/* Header */}

      <div className="mb-3 flex items-center gap-2">

        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <FileCode2 className="h-3 w-3" />
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Sources
        </span>

        <span className="rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
          {citations.length}
        </span>

      </div>

      {/* Source Cards */}

      <div className="grid gap-2">

        {citations.map(
          (citation, index) => {
            const sourceUrl =
              getSourceUrl(citation);

            const sourceName =
              getSourceName(citation);

            const location =
              getSourceLocation(
                citation
              );

            const sourceContent = (
              <div
                className="
                  group flex items-center gap-3
                  rounded-xl
                  border border-border/60
                  bg-muted/20
                  px-3 py-3
                  transition-all
                  hover:border-primary/20
                  hover:bg-primary/[0.035]
                  hover:shadow-sm
                "
              >

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/70 text-primary">
                  <FileCode2 className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="truncate font-mono text-xs font-medium">
                    {sourceName}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">

                    {location && (
                      <span>
                        {location}
                      </span>
                    )}

                    {citation.language &&
                      location && (
                        <span className="text-border">
                          •
                        </span>
                      )}

                    {citation.language && (
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-primary">
                        {citation.language}
                      </span>
                    )}

                  </div>

                </div>

                {sourceUrl && (
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                )}

              </div>
            );

            if (sourceUrl) {
              return (
                <a
                  key={
                    citation.id ||
                    `${citation.filePath}-${index}`
                  }
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open source on GitHub"
                  className="block"
                >
                  {sourceContent}
                </a>
              );
            }

            return (
              <div
                key={
                  citation.id ||
                  `${citation.filePath}-${index}`
                }
              >
                {sourceContent}
              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

// =====================================================
// SOURCE URL
// =====================================================

function getSourceUrl(citation) {
  if (!citation) {
    return null;
  }

  return (
    citation.sourceUrl ||
    null
  );
}

// =====================================================
// SOURCE NAME
// =====================================================

function getSourceName(citation) {
  if (!citation) {
    return "Repository source";
  }

  return (
    citation.filePath ||
    "Repository source"
  );
}

// =====================================================
// SOURCE LOCATION
// =====================================================

function getSourceLocation(citation) {
  if (!citation) {
    return "";
  }

  const start =
    citation.startLine;

  const end =
    citation.endLine;

  if (
    start == null ||
    start <= 0
  ) {
    return "";
  }

  if (
    end != null &&
    end > 0 &&
    end !== start
  ) {
    return `Lines ${start}-${end}`;
  }

  return `Line ${start}`;
}

// =====================================================
// LANGUAGE LABEL
// =====================================================

function getLanguageLabel(citation) {
  if (!citation?.language) {
    return "SRC";
  }

  return citation.language
    .substring(0, 3)
    .toUpperCase();
}

// =====================================================
// ERROR HELPER
// =====================================================

function getErrorMessage(
  error,
  fallback
) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

// =====================================================
// EXPORT
// =====================================================

export default ChatPage;

