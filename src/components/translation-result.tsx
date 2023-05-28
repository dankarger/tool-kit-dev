import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Separator } from "@/components/ui/separator";
import { TranslationResult } from "@prisma/client";

interface TranslationResultProps {
  data: TranslationResult;
}
export const TranslationResultComponent = (
  data: TranslationResultProps
): React.ReactElement => {
  return (
    <div>
      <div className="rounded-md bg-slate-200 p-4">
        <Collapsible className="justify-start align-baseline align-top">
          <CollapsibleTrigger>Show original text</CollapsibleTrigger>
          <CollapsibleContent>{data.data.text}</CollapsibleContent>
        </Collapsible>
      </div>
      <div>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <span className="text-gray-500 underline">
            {" "}
            #{data.data.language}{" "}
          </span>
          : {data.data.translation}
        </p>
      </div>
      <Separator />
    </div>
  );
};
