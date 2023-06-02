import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Icons } from "@/components/icons";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type {
  Session,
  StoryResult,
  TranslationResultType,
  SummarizeResultType,
  Response,
  ChatMessage,
} from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const FormSchema = z.object({
  session: z.string({
    required_error: "Please select an sesion to display.",
  }),
});
type SelectElementProps = {
  options:
    | Session[]
    | StoryResult[]
    | TranslationResultType[]
    | SummarizeResultType[];
  onSelect: (value: string) => void;
  onNewSession: () => void;
};

export function SelectElement({
  options,
  onSelect,
  onNewSession,
}: SelectElementProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { isDirty, isValid } = form.formState;

  function onSubmit(
    data: z.infer<typeof FormSchema>,
    e?: React.BaseSyntheticEvent
  ) {
    e?.preventDefault();
    console.log("sub", data);
    void onSelect(data.session);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  if (!options) return null;
  type ReturnLabelProp =
    | Session
    | StoryResult
    | TranslationResultType
    | SummarizeResultType;

  const checkStoryType = (tbd: unknown): tbd is StoryResult => {
    if ((tbd as StoryResult).title) {
      return true;
    }
    return false;
  };
  const checkSessionType = (tbd: unknown): tbd is Session => {
    if ((tbd as Session).name) {
      return true;
    }

    return false;
  };

  function returnLabelFromOption(option: ReturnLabelProp): string {
    if (checkSessionType(option)) return option.name;
    if (checkStoryType(option)) return option.title;
    return option.text.substring(0, 10);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="session"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous </FormLabel>
              <Select onValueChange={field.onChange} defaultValue="none">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="New Session" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* {!options && <div>LoadingPage...</div>} */}
                  <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
                    {options.map((option) => (
                      <SelectItem
                        key={option.id}
                        value={option.id}
                        data-valueid={option.id}
                      >
                        {returnLabelFromOption(option)}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <FormDescription>
                You can resume a previous chat{" "}
                {/* <Link href="/examples/forms">email settings</Link>. */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between align-middle ">
          <Button disabled={!isDirty || !isValid} type="submit">
            Load
          </Button>
          <Button
            className="w-16 bg-slate-400"
            onClick={() => {
              onNewSession();
              form.reset();
            }}
            type="button"
          >
            <span>
              <Icons.add className="mr-2 h-4 w-4" />
            </span>
            NEW
          </Button>
        </div>
      </form>
    </Form>
  );
}
