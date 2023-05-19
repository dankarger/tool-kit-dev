import { Separator } from "@/components/ui/separator";

interface Props {
  text: string;
  author?: string;
}

export const ResponseDiv = ({ text, author = "Assistense" }: Props) => {
  if (!text) return null;

  return (
    <div className="flex h-full w-full flex-col justify-start rounded-md border-2 border-gray-300 p-4 align-middle">
      {/* <div className="w-full bg-green-100">
        <p className="leading-7 [&:not(:first-child)]:mt-6 ">{author}</p>
      </div>
      <Separator /> */}
      <p className="gap-2 text-left text-xl leading-7 text-muted-foreground [&:not(:first-child)]:mt-6">
        {" "}
        <span className="px-2 font-semibold">{author.toUpperCase()}</span>{" "}
        {text}
      </p>
    </div>
  );
};
