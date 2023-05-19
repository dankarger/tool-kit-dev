import { Separator } from "@/components/ui/separator";
import { ResponseDiv } from "./response-div";
import { Fragment } from "react";

interface Response {
  message?: string;
  authorId?: string;
}
interface ResponseSectionProps {
  responses: Response[];
}

export const ResponseSection = ({ responses }: ResponseSectionProps) => {
  if (!responses) return null;

  return (
    <div className="flex h-full w-full flex-col justify-start rounded-md border-2 border-gray-300 p-4 align-middle">
      {responses.map((response, index) => (
        <Fragment key={index}>
          <ResponseDiv text={response.message ?? ""} />
          {index !== responses.length - 1 && <Separator />}
        </Fragment>
      ))}
    </div>
  );
};
