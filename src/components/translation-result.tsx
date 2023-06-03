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
  const text = data.data.text.split("]")[1];
  return (
    <Card className="w-full text-left">
      <CardHeader>
        {/* <CardTitle>[{data.data.language}]</CardTitle> */}
        <CardDescription>
          {" "}
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            <span className="flex items-center text-gray-500 underline">
              {" "}
              Original:{" "}
            </span>{" "}
            {data.data.text}
          </p>
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
            <span className="flex items-center text-gray-500 underline">
              {" "}
              #{data.data.language}{" "}
            </span>
            {data.data.translation}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* {data.data.translation} */}
      </CardFooter>
    </Card>
  );
};
