import { Separator } from "@/components/ui/separator";
import { ResponseDiv } from "./response-div";
import { Fragment } from "react";
import type { ResponseSectionProps, ChatMessage } from "@/types";

export const ResponseSection = ({ responses }: ResponseSectionProps) => {
  if (!responses) return null;

  return (
    <div className=" flex h-full w-full  flex-col-reverse items-start justify-start rounded-md p-4 align-middle lg:h-auto  lg:w-auto   lg:flex-wrap lg:items-center  lg:justify-between  lg:gap-x-4  lg:gap-y-0 lg:rounded-md  lg:border lg:border-gray-200  lg:bg-white   lg:p-4  lg:align-middle  lg:shadow-lg  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none   ">
      {responses.map((response, index) => (
        <Fragment key={index}>
          <ResponseDiv
            message={response.message}
            response={response.response}
          />
          {index !== responses.length - 1 && <Separator />}
        </Fragment>
      ))}
    </div>
  );
};
