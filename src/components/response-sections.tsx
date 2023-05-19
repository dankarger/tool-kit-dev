import { Separator } from "@/components/ui/separator";
import { ResponseDiv } from "./response-div";

interface Response {
  text: string;
  author?: string;
}
interface ResponseSectionProps {
  responses: Response[];
}

export const ResponseSection = ({ responses }: ResponseSectionProps) => {
  if (!responses) return null;

  return (
    <div className="flex h-full w-full flex-col justify-start rounded-md border-2 border-gray-300 p-4 align-middle">
      {responses.map((response, index) => (
        <>
          <ResponseDiv key={index} text={response.text} />
          {index !== responses.length - 1 && <Separator />}
        </>
      ))}
    </div>
  );
};
