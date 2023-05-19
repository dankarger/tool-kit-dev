import { Separator } from "@/components/ui/separator";
import { ResponseDiv } from "./response-div";
import { Fragment } from "react";
import type { ResponseSectionProps } from "@/types";

export const ResponseSection = ({ responses }: ResponseSectionProps) => {
  if (!responses) return null;

  return (
    <div className="flex h-full w-full flex-col justify-start rounded-md  p-4 align-middle">
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
