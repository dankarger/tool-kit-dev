import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
    message: "Cant have empty text.",
  }),
});

interface InputAreaWithButtonProps {
  handleSubmitteButton: (text: string) => void;
  placeholder: string;
  // setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  // setTextToTranslate: React.Dispatch<React.SetStateAction<string>>;
}

export function InputAreaWithButton({
  handleSubmitteButton,
  placeholder,
}: InputAreaWithButtonProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    void handleSubmitteButton(data.text);
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
                  placeholder={placeholder}
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
