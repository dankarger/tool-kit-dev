import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Result } from "@/types";

export const ResultPopover = ({
  result,
  children,
}: {
  result: Result;
  children: React.ReactElement;
}) => {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-96">
        <CardHeader>
          <CardDescription>Original Text</CardDescription>
          {result.text}
        </CardHeader>
        <CardContent>{/* <p>{result.result}</p> */}</CardContent>
        <CardDescription>Result</CardDescription>
        {result.result}
      </PopoverContent>
    </Popover>
  );
};
