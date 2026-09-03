import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import api from "@/api/api";

import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  FileCode2,
  Loader2,
  Menu,
  MessageSquarePlus,
  Send,
  Sparkles,
  Square,
  User,
  Bot
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    if (!id) return;
    try {
      setLoadingSessions(true);
      setError(null);
      const response = await api.get("/chat/sessions", {
        params: { repositoryId: id },
      });
      const loadedSessions = Array.isArray(response) ? response : [];
      setSessions(loadedSessions);

      if (loadedSessions.length > 0) {
        const firstSession = loadedSessions[0];
        setSelectedSession(firstSession);
        await loadMessages(firstSession.id);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError(getErrorMessage(err, "Failed to load chat sessions."));
    } finally {
      setLoadingSessions(false);
    }
  };

  // =====================================================
  // LOAD MESSAGES
  // =====================================================
  const loadMessages = async (sessionId) => {
    if (!sessionId) return;
    try {
      setLoadingMessages(true);
      setError(null);
      const response = await api.get(`/chat/sessions/${sessionId}`);
      setMessages(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError(getErrorMessage(err, "Failed to load messages."));
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =====================================================
  // CREATE SESSION
  // =====================================================
  const createSession = async (title) => {
    if (!id || !title?.trim()) return null;
    try {
      setError(null);
      const response = await api.post("/chat/sessions", {
        repositoryId: id,
        title: title.trim(),
      });
      const newSession = response;
      setSessions((previous) => [newSession, ...previous]);
      setSelectedSession(newSession);
      setMessages([]);
      return newSession;
    } catch (err) {
      console.error("Session creation failed:", err);
      setError(getErrorMessage(err, "Failed to create chat session."));
      return null;
    }
  };

  // =====================================================
  // SELECT SESSION
  // =====================================================
  const handleSelectSession = async (session) => {
    if (streaming || loadingMessages) return;
    setSelectedSession(session);
    setMessages([]);
    await loadMessages(session.id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================
  const handleSendMessage = async () => {
    const content = input.trim();
    if (!content || streaming || !id) return;

    let session = selectedSession;
    if (!session) {
      session = await createSession(content);
      if (!session) return;
    }

    const userMessage = {
      id: `temp-user-${Date.now()}`,
      role: "USER",
      content,
      citations: [],
      createdAt: new Date().toISOString(),
    };

    const assistantId = `temp-assistant-${Date.now()}`;
    const assistantMessage = {
      id: assistantId,
      role: "ASSISTANT",
      content: "",
      citations: [],
      createdAt: new Date().toISOString(),
      streaming: true,
    };

    setMessages((previous) => [...previous, userMessage, assistantMessage]);
    setInput("");
    setStreaming(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URI}/chat/sessions/${session.id}/messages`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ content }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        let message = `Request failed (${response.status})`;
        try {
          const data = await response.json();
          message = data?.message || message;
        } catch {}
        throw new Error(message);
      }
      if (!response.body) throw new Error("Streaming is not supported by this browser.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const event of events) {
          processSseEvent(event, assistantId);
        }
      }

      if (buffer.trim()) {
        processSseEvent(buffer, assistantId);
      }

      setMessages((previous) =>
        previous.map((message) => {
          if (message.id === assistantId) return { ...message, streaming: false };
          return message;
        })
      );
    } catch (err) {
      if (err?.name === "AbortError") {
        setMessages((previous) =>
          previous.map((message) => {
            if (message.id === assistantId) return { ...message, streaming: false };
            return message;
          })
        );
        return;
      }
      console.error("Chat streaming failed:", err);
      setError(getErrorMessage(err, "Failed to send message."));
      setMessages((previous) => previous.filter((message) => message.id !== assistantId));
    } finally {
      setStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // =====================================================
  // PROCESS SSE EVENT
  // =====================================================
  const processSseEvent = (event, assistantId) => {
    const lines = event.split("\n");
    let data = "";
    for (const line of lines) {
      if (line.startsWith("data:")) {
        data += line.substring(5).trimStart();
      }
    }
    if (!data) return;

    let parsed = null;
    try {
      parsed = JSON.parse(data);
    } catch {}

    let chunk = data;
    let citations = null;

    if (parsed && typeof parsed === "object") {
      chunk = parsed.content ?? parsed.text ?? parsed.delta ?? parsed.data ?? "";
      citations = parsed.citations ?? null;
    }

    if (!chunk && !citations) return;

    setMessages((previous) =>
      previous.map((message) => {
        if (message.id === assistantId) {
          return {
            ...message,
            content: message.content + chunk,
            citations: citations ?? message.citations ?? [],
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
    if (event.key === "Enter" && !event.shiftKey) {
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
    if (streaming) return;
    setSelectedSession(null);
    setMessages([]);
    setError(null);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-serif text-foreground">
      {/* =================================================
          SIDEBAR (Gemini Style)
      ================================================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          flex w-[280px] flex-col
          bg-muted/30 dark:bg-[#1e1f20]
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header / New Chat Pill */}
        <div className="p-4 pt-5">
          <Button
            variant="ghost"
            disabled={streaming}
            onClick={handleNewChat}
            className="h-12 w-fit rounded-full bg-background dark:bg-muted/50 px-5 text-sm font-medium shadow-sm transition-all hover:bg-muted hover:shadow-md"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            New chat
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="pb-5">
            {loadingSessions ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted-foreground">No recent chats</p>
            ) : (
              <div className="space-y-1 mt-4">
                <p className="px-4 pb-2 text-xs font-semibold text-muted-foreground">Recent</p>
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    disabled={streaming}
                    onClick={() => handleSelectSession(session)}
                    className={`
                      group flex w-full items-center gap-3
                      rounded-full px-4 py-3
                      text-left text-sm transition-all
                      disabled:pointer-events-none
                      ${
                        selectedSession?.id === session.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                      }
                    `}
                  >
                    <MessageSquareIcon className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="min-w-0 flex-1 truncate">
                      {session.title || "Conversation"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start rounded-full text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5" 
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Repositories
          </Button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =================================================
          MAIN CANVAS
      ================================================= */}
      <section className="flex min-w-0 flex-1 flex-col bg-background">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:bg-muted"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-lg font-medium text-foreground ml-2">
              {selectedSession?.title || "Repository Chat"}
            </h2>
          </div>
              <div className="flex items-center gap-2">
      
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
                      <Bot className="h-4.5 w-4.5" />
        
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                    </div>
    </div>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="px-4 py-2 mx-auto w-full max-w-4xl">
            <Alert variant="destructive" className="rounded-2xl border-none bg-red-50 dark:bg-red-950/30 text-red-600">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto px-4 pb-36">
          <div className="mx-auto flex w-full max-w-4xl flex-col pb-8 pt-4">
            
            {/* Empty State (Gemini Greeting) */}
            {!selectedSession && !loadingSessions && messages.length === 0 && (
              <div className="flex flex-col justify-center min-h-[50vh]">
                <h1 className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-5xl font-medium tracking-tight text-transparent sm:text-6xl mb-2">
                  Hello, Developer
                </h1>
                <h2 className="text-4xl font-medium text-muted-foreground sm:text-5xl mb-12">
                  Understand your codebase.
                </h2>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {[
                    "Explain the project architecture",
                    "How does authentication work?",
                    "Where is the GitHub API used?",
                    "Explain the indexing flow",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="flex h-32 flex-col justify-between rounded-2xl bg-muted/40 p-4 text-left transition-colors hover:bg-muted/80 dark:bg-[#1e1f20] dark:hover:bg-[#2a2b2c]"
                    >
                      <span className="text-sm text-foreground/80">{suggestion}</span>
                      <Sparkles className="h-5 w-5 text-muted-foreground self-end opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {selectedSession && loadingMessages && (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {/* Message List */}
            {!loadingMessages && (
              <div className="space-y-8">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </main>

        {/* =================================================
            FLOATING INPUT BAR (Gemini Style)
        ================================================= */}
<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-6 pb-6 px-4 md:left-[280px]">
  <div className="mx-auto w-full max-w-4xl">
    
    {/* UPDATED: Removed flat background, added border, shadow, and focus glow */}
 <div className="sticky bottom-0 w-full px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
  <div
    className="
      relative mx-auto flex w-full max-w-4xl items-end
      rounded-2xl border border-border/70
      bg-background/95
      p-2
      shadow-lg shadow-black/5
      backdrop-blur-md
      transition-all duration-200
      focus-within:border-primary/40
      focus-within:shadow-md
      focus-within:ring-2
      focus-within:ring-primary/10
    "
  >
    <Textarea
      ref={textareaRef}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={streaming}
      placeholder="Ask anything about your repository..."
      rows={1}
      className="
        min-h-[48px]
        max-h-[180px]
        w-full
        resize-none
        border-0
        bg-transparent
        px-3
        py-3
        pr-12
        text-sm
        leading-6
        shadow-none
        placeholder:text-muted-foreground/70
        focus-visible:ring-0
        focus-visible:ring-offset-0
        sm:px-4
        sm:py-3.5
        sm:text-[15px]
      "
    />

    <div className="absolute bottom-2.5 right-2.5">
      {streaming ? (
        <Button
          type="button"
          size="icon"
          onClick={handleStop}
          aria-label="Stop generating"
          className="
            h-9 w-9
            rounded-xl
            border border-border/60
            bg-muted
            text-foreground
            shadow-sm
            transition-all
            hover:bg-muted/80
            active:scale-95
          "
        >
          <Square className="h-3.5 w-3.5 fill-current" />
        </Button>
      ) : (
        <Button
          type="button"
          size="icon"
          disabled={!input.trim() || !id}
          onClick={handleSendMessage}
          aria-label="Send message"
          className="
            h-9 w-9
            rounded-xl
            bg-primary
            text-primary-foreground
            shadow-sm
            transition-all duration-150
            hover:scale-105
            hover:bg-primary/90
            active:scale-95
            disabled:pointer-events-none
            disabled:scale-100
            disabled:opacity-40
          "
        >
          <Send className="ml-0.5 h-4 w-4" />
        </Button>
      )}
    </div>
  </div>

  <p className="mt-2 hidden text-center text-[11px] text-muted-foreground/60 sm:block">
    Enter to send · Shift + Enter for new line
  </p>
</div>

    {/* ADDED font-sans so the disclaimer doesn't use Merriweather if you set it globally */}
    <p className="mt-3 text-center font-sans text-xs text-muted-foreground">
      AI can make mistakes. Verify important code before using it.
    </p>
    
  </div>
</div>
      </section>
    </div>
  );
}

// -----------------------------------------------------
// Icons for local use in file
// -----------------------------------------------------
function PlusIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}
function MessageSquareIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
}

// =====================================================
// CHAT MESSAGE (Inline version for ChatPage)
// =====================================================
function ChatMessage({ message }) {
  const isUser = message.role === "USER";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`flex max-w-[85%] gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar/Icon */}
        <div className="mt-1 flex shrink-0 items-start">
          {!isUser && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Content Bubble */}
        <div
          className={`
            relative flex flex-col gap-2 
            ${isUser ? "rounded-3xl bg-[#f0f4f9] px-6 py-4 dark:bg-[#1e1f20]" : "pt-1"}
          `}
        >
          {message.streaming && !isUser && (
            <span className="flex items-center gap-1 text-sm font-medium text-primary animate-pulse">
              Thinking...
            </span>
          )}

          <div className={`text-base leading-relaxed ${isUser ? "text-foreground" : "text-foreground"}`}>
            <MarkdownContent content={message.content} streaming={message.streaming && !isUser} />
          </div>

          {!isUser && message.citations?.length > 0 && (
            <CitationList citations={message.citations} />
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// MARKDOWN CONTENT
// =====================================================
function MarkdownContent({ content, streaming }) {
  if (!content) {
    return streaming ? (
      <div className="flex gap-1.5 py-2">
        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" />
        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]" />
        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.4s]" />
      </div>
    ) : null;
  }

  return (
    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {children}
            </a>
          ),
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "text";
            const codeString = String(children).replace(/\n$/, "");
            if (inline || !match) {
              return (
                <code className="rounded-md bg-muted/50 px-1.5 py-0.5 font-mono text-[0.9em]" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock language={language} code={codeString} />;
          },
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="bg-muted/50 px-4 py-2 font-medium">{children}</th>,
          td: ({ children }) => <td className="border-t border-border px-4 py-2">{children}</td>,
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
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <div className="my-4 overflow-hidden rounded-2xl bg-[#1e1f20] text-gray-100 dark:bg-black/50 border border-border/10 shadow-sm">
      <div className="flex items-center justify-between bg-black/20 px-4 py-2">
        <span className="text-xs font-mono text-gray-400">{language}</span>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/10">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy code"}
        </Button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="m-0 bg-transparent p-0 text-sm leading-relaxed"><code className="font-mono">{code}</code></pre>
      </div>
    </div>
  );
}

// =====================================================
// CITATION LIST (Inline)
// =====================================================
function CitationList({ citations }) {
  return (
    <div className="mt-4 pt-4 border-t border-border/40">
      <div className="flex flex-wrap gap-2">
        {citations.map((citation, index) => {
          const url = citation.sourceUrl || null;
          const content = (
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted">
              <FileCode2 className="h-3.5 w-3.5" />
              <span className="truncate max-w-[150px]">{citation.filePath || `Source ${index + 1}`}</span>
            </div>
          );
          return url ? (
            <a key={index} href={url} target="_blank" rel="noopener noreferrer">{content}</a>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================
// ERROR HELPER
// =====================================================
function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export default ChatPage;