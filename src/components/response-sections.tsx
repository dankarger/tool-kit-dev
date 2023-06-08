import { Separator } from "@/components/ui/separator";
import { ResponseDiv } from "./response-div";
import { Fragment } from "react";
import type { ResponseSectionProps } from "@/types";
import { type ChatMessage } from "@prisma/client";

export function ResponseSection({
  messages,
}: {
  messages: ChatMessage[];
}): JSX.Element | null {
  return (
    <>
      {/* <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Chat history:
      </h3> */}
      {/* <div className=" flex h-full w-full  flex-col-reverse items-start justify-start rounded-md p-4 align-middle lg:h-auto  lg:w-auto   lg:flex-wrap lg:items-center  lg:justify-between  lg:gap-x-4  lg:gap-y-0 lg:rounded-md  lg:border lg:border-gray-200  lg:bg-white   lg:p-4  lg:align-middle  lg:shadow-lg  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none   "> */}
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
      {/* </div> */}
    </>
  );
}
