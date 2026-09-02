import {
  Bot,
  Check,
  Copy,
  User,
} from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import CodeBlock from "./CodeBlock";


const ChatMessage = ({
  message,
}) => {

  const isUser =
    message.role === "USER";


  /*
   * Split markdown code blocks:
   *
   * ```java
   * code
   * ```
   */

  const parts =
    parseContent(
      message.content || ""
    );


  return (

    <div
      className={`
        mb-8
        flex
        gap-4
        ${
          isUser
            ? "justify-end"
            : "justify-start"
        }
      `}
    >

      {!isUser && (

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            bg-background
          "
        >

          <Bot className="h-4 w-4" />

        </div>

      )}


      <div
        className={`
          min-w-0
          max-w-[85%]
          ${
            isUser
              ? "rounded-2xl bg-primary px-4 py-3 text-primary-foreground"
              : ""
          }
        `}
      >

        <div className="space-y-3">

          {parts.map(
            (part, index) => {

              if (
                part.type ===
                "code"
              ) {

                return (

                  <CodeBlock
                    key={index}
                    code={part.content}
                    language={
                      part.language
                    }
                  />

                );

              }


              return (

                <div
                  key={index}
                  className="
                    whitespace-pre-wrap
                    break-words
                    text-sm
                    leading-7
                  "
                >
                  {part.content}
                </div>

              );

            }
          )}

        </div>


        {/* Citations */}

        {message.citations?.length >
          0 && (

          <div className="mt-4 space-y-2">

            <p
              className="
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              Sources
            </p>

            {message.citations.map(
              (citation, index) => (

                <div
                  key={
                    citation.id ||
                    index
                  }
                  className="
                    rounded-lg
                    border
                    bg-muted/30
                    px-3
                    py-2
                    text-xs
                  "
                >
                  {citation.fileName ||
                    citation.path ||
                    citation.content ||
                    `Source ${index + 1}`}
                </div>

              )
            )}

          </div>

        )}

      </div>


      {isUser && (

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-muted
          "
        >

          <User className="h-4 w-4" />

        </div>

      )}

    </div>
  );
};


// ========================================
// PARSE MARKDOWN CODE BLOCKS
// ========================================

function parseContent(content) {

  const regex =
    /```([\w+-]*)\n?([\s\S]*?)```/g;


  const parts = [];

  let lastIndex = 0;

  let match;


  while (
    (match =
      regex.exec(content))
  ) {

    if (
      match.index >
      lastIndex
    ) {

      parts.push({
        type: "text",
        content:
          content.slice(
            lastIndex,
            match.index
          ),
      });

    }


    parts.push({

      type: "code",

      language:
        match[1] ||
        "text",

      content:
        match[2].trimEnd(),

    });


    lastIndex =
      regex.lastIndex;
  }


  if (
    lastIndex <
    content.length
  ) {

    parts.push({
      type: "text",
      content:
        content.slice(lastIndex),
    });

  }


  return parts.length
    ? parts
    : [
        {
          type: "text",
          content,
        },
      ];
}


export default ChatMessage;