import { Separator } from "@/components/ui/separator";
import { ResponseDiv } from "./response-div";
import { Fragment } from "react";
import { type ChatMessage } from "@prisma/client";

export function ResponseSection({
  messages,
}: {
  messages: ChatMessage[];
}): JSX.Element | null {
  return (
    <>
      {messages
        .slice(0)
        .reverse()
        .map((message: ChatMessage, index: number) => (
          <Fragment key={index}>
            <ResponseDiv
              message={message.message}
              response={message.response}
            />
            {index !== messages.length - 1 && <Separator />}
          </Fragment>
        ))}
    </>
  );
}
