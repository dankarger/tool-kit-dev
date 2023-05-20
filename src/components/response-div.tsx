import { Separator } from "@/components/ui/separator";
// import type { Response } from "@/types";

interface Response {
  message?: string;
  response?: string;
  authorId?: string;
}

export const ResponseDiv = ({ message, response }: Response) => {
  // if (!text) return null;

  return (
    <div className="flex h-full w-full flex-col justify-start rounded-md border-2 border-gray-300 p-4 align-middle">
      {/* <div className="w-full bg-green-100">
        <p className="leading-7 [&:not(:first-child)]:mt-6 ">{author}</p>
      </div>
      <Separator /> */}
      <p className="gap-2 text-left text-xl leading-7 text-muted-foreground [&:not(:first-child)]:mt-6">
        {" "}
        <span className="px-2 font-semibold">ME</span> {message}
      </p>
      <Separator className="mt-6" />
      <p className="gap-2 text-left text-xl leading-7 text-muted-foreground [&:not(:first-child)]:mt-6">
        {" "}
        <span className="px-2 font-semibold">AI</span> {response}
      </p>
    </div>
  );
};
