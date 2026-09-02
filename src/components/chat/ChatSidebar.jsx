import {
  MessageSquare,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";


const ChatSidebar = ({
  sessions,
  selectedSession,
  loading,
  onSelect,
  onNewChat,
}) => {

  return (

    <div
      className="
        flex
        h-full
        w-72
        flex-col
      "
    >

      {/* Header */}

      <div className="p-3">

        <Button
          variant="outline"
          className="
            w-full
            justify-start
            gap-2
          "
          onClick={onNewChat}
        >

          <Plus className="h-4 w-4" />

          New Chat

        </Button>

      </div>


      <Separator />


      {/* Sessions */}

      <ScrollArea className="flex-1">

        <div className="p-2">

          <p
            className="
              px-2
              py-2
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            Chat History
          </p>


          {loading && (

            <div
              className="
                px-3
                py-4
                text-sm
                text-muted-foreground
              "
            >
              Loading chats...
            </div>

          )}


          {!loading &&
            sessions.length === 0 && (

              <div
                className="
                  px-3
                  py-6
                  text-center
                  text-sm
                  text-muted-foreground
                "
              >
                No conversations yet.
              </div>

            )}


          {!loading &&
            sessions.map((session) => {

              const active =
                selectedSession?.id ===
                session.id;


              return (

                <button
                  key={session.id}
                  type="button"
                  onClick={() =>
                    onSelect(session)
                  }
                  className={`
                    mb-1
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    transition-colors
                    ${
                      active
                        ? "bg-muted"
                        : "hover:bg-muted/70"
                    }
                  `}
                >

                  <MessageSquare
                    className="
                      h-4
                      w-4
                      shrink-0
                      text-muted-foreground
                    "
                  />

                  <span
                    className="
                      min-w-0
                      flex-1
                      truncate
                    "
                  >
                    {session.title ||
                      "New Chat"}
                  </span>

                </button>

              );

            })}

        </div>

      </ScrollArea>

    </div>
  );
};


export default ChatSidebar;