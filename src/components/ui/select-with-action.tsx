import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Icons } from "@/components/icons";
import { SessionsCombobox } from "@/components/sessions-combobox";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  Session,
  StoryResult,
  TranslationResultType,
  SummarizeResultType,
  Response,
  ChatMessage,
} from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  handleDeleteResult: (value: string) => void;
};

export function SelectElement({
  options,
  onSelect,
  onNewSession,
  handleDeleteResult,
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
  const optionsTemp = [...options];
  const sortedOptions: ReturnLabelProp[] = (
    optionsTemp as ReturnLabelProp[]
  ).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="whitespace-nowrap">Previous Results</CardTitle>
        <CardDescription className="color-muted text-[10px]">
          {/* <div className="flex flex-row"> */}
          {/* <span className="translate-y--2">*</span> */}
          {/* <p className="color-muted text-xs">In the box below you can */}
          load or delete previous results
          {/* </p> */}
          {/* </div> */}
          {/* , click on the box below and */}
          {/* press the three dots to load or delete */}
        </CardDescription>
      </CardHeader>
      <CardContent
      // className=" grid gap-6 "
      >
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
                  {/* <FormLabel>Click below </FormLabel> */}
                  <TooltipProvider>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={options.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="color-muted-foreground text-[11px]">
                          <SelectValue
                            placeholder={
                              options.length > 0 ? "Previous Results" : ""
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
                              {sortedOptions.map(
                                (
                                  option:
                                    | Session
                                    | StoryResult
                                    | TranslationResultType
                                    | SummarizeResultType
                                ) => (
                                  <SessionsCombobox
                                    value={option.id}
                                    valueid={option.id}
                                    label={returnLabelFromOption(option)}
                                    title={returnLabelFromOption(option)}
                                    key={option.id}
                                    onSelect={onSelect}
                                    handleDeleteResult={handleDeleteResult}
                                  />
                                )
                              )}
                            </ScrollArea>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>hello</p>
                          </TooltipContent>
                        </Tooltip>
                      </SelectContent>
                    </Select>
                  </TooltipProvider>
                  {/* <FormDescription>
                    You can resume a previous chat{" "}
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between align-middle ">
              <Button
                variant="secondary"
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
      </CardContent>
    </Card>
  );
}
