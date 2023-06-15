import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type TranslationResult } from "@prisma/client";
import { type TranslationResultType } from "@/types";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";

interface TranslationResultProps {
  data: TranslationResultType;
}
export const TranslationResultComponent = (
  data: TranslationResultProps
): React.ReactElement => {
  return (
    <Card className="w-full text-left">
      <CardHeader>
        <CardDescription className="flex gap-2 ">
          {" "}
          <span className="flex items-center text-gray-500 ">
            {" "}
            <Badge variant="secondary">Original </Badge>
          </span>{" "}
          {data.data.text}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="flex gap-2 pt-4 ">
          <span className="flex items-center text-gray-500 ">
            {" "}
            <Badge variant="default">{data.data.language} </Badge>
          </span>
          {data.data.translation}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};
