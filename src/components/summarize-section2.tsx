import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea";
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

const FormSchema = z.object({
  text: z.string().min(1, {
    message: "Cant summarize empty text.",
  }),
});

interface SummarizeSectionProps {
  handleSummarizeButton: (text: string) => void;
  // setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  // selectedLanguage: string;
  // setTextToTranslate: React.Dispatch<React.SetStateAction<string>>;
}

export function SummarizeSection({
  handleSummarizeButton,
}: SummarizeSectionProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    void handleSummarizeButton(data.text);
    // api call
    console.log("from onSubmit", data.text);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="w-full space-y-1"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Past here text to summarize</FormLabel> */}
              <FormControl>
                <Textarea
                  placeholder="Past or type here the text to summarize..."
                  rows={4}
                  autoFocus
                  className="w-full"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                You can view older translations results
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between space-x-2">
          <Button disabled={!form.formState.isValid} type="submit">
            Summarize
          </Button>
          <Button
            variant={"destructive"}
            onClick={(e) => {
              e.preventDefault();
              form.reset({ text: "" });
            }}
          >
            Clear
          </Button>
        </div>
      </form>
    </Form>
  );
}
