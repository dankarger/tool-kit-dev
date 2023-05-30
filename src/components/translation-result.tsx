import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Separator } from "@/components/ui/separator";
import { TranslationResult } from "@prisma/client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TranslationResultProps {
  data: TranslationResult;
}
export const TranslationResultComponent = (
  data: TranslationResultProps
): React.ReactElement => {
  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>[{data.data.language}]</CardTitle>
          <CardDescription>
            {" "}
            <span className="text-gray-100"> Original: </span> {data.data.text}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator />

          {/* <div className="rounded-md bg-slate-200 p-4">
            <Collapsible className="justify-start  align-top">
              <CollapsibleTrigger>Show original text</CollapsibleTrigger>
              <CollapsibleContent>{data.data.text}</CollapsibleContent>
            </Collapsible>
          </div> */}
          <div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <span className="text-gray-500 underline">
                {" "}
                #{data.data.language}{" "}
              </span>
              : {data.data.translation}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* {data.data.translation} */}
        </CardFooter>
      </Card>
    </div>
  );
};
