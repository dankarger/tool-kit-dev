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

const GlassDiv = ({ children }: ReactElement) => {
  return (
    <div className="to-[rgba(255,255,255,0) box-shadow-xl bg-gradient-to-r from-[rgba(255,255,255,-.1)]">
      {children}
    </div>
  );
};

export const ResultPopover = ({
  result,
  children,
}: {
  result: Result;
  children: ReactElement;
}) => {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-96">
        {/* <Card> */}
        {/* <GlassDiv> */}
        <CardHeader>
          {/* <CardTitle>{result.text}</CardTitle> */}
          <CardDescription>Original Text</CardDescription>
          {result.text}
        </CardHeader>
        <CardContent>{/* <p>{result.result}</p> */}</CardContent>
        <CardDescription>Result</CardDescription>
        {result.result}
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
        {/* </Card> */}
        {/* </GlassDiv> */}
      </PopoverContent>
    </Popover>
  );
};
