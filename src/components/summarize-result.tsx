import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { SummarizeResultType } from "@/types";

export const SummarizeResult = ({ data }: { data: SummarizeResultType }) => {
  // if (!data) return null;
  const bulletPoints: string[] = data?.result.split("*");
  return (
    <div>
      <Card>
        <CardHeader className=" flex justify-between gap-2 border-b-2 border-gray-300  ">
          {/* <CardTitle className="flex-start flex">
           
            Summarize 
          </CardTitle> */}
          {/* <CardDescription> */}
          <Collapsible className="flex flex-wrap gap-4 p-2">
            <CollapsibleTrigger className=" flex-start radius-lg flex border border-gray-300 p-2">
              Click here to see the original text.
            </CollapsibleTrigger>{" "}
            <CollapsibleContent className=" flex flex-wrap	gap-4">
              <CardTitle className="flex-start flex">Original</CardTitle>

              <div className="bg-slate-50  p-3 py-4 text-left leading-7">
                {data.text}
              </div>
            </CollapsibleContent>
          </Collapsible>
          {/* </CardDescription> */}
        </CardHeader>
        <CardContent className="marker:  alig-middle flex flex-col justify-start p-6">
          {" "}
          <CardTitle className="flex-start flex">Summarize</CardTitle>
          <ul className="my-1 ml-6 list-disc leading-6 [&>li]:mt-2">
            {bulletPoints.map((bulletPoint: string) => (
              <>
                {bulletPoint.length > 0 && (
                  <li key={bulletPoint} className="text-left">
                    {bulletPoint}
                  </li>
                )}
              </>
            ))}
          </ul>
        </CardContent>
        <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
      </Card>
    </div>
  );
};
