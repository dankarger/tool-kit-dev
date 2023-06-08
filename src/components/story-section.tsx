import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
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

export const FormSchema = z.object({
  text: z
    .string()
    .min(2, {
      message: "Cant proceed with less than 2 characters.",
    })
    .max(1300),
});

interface StorylateSectionProps {
  handleSubmitButton: (text: string) => void;
}

export function StorySection({ handleSubmitButton }: StorylateSectionProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
    },
  });

  type FormData = {
    text: string;
    // e: Event;
  };

  const onSubmit: SubmitHandler<FormData> = (
    data: z.infer<typeof FormSchema>,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();

    void handleSubmitButton(data.text);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>text for story generator</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Past or type here the instructions for the story generator"
                  rows={4}
                  className=""
                  autoFocus
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
            Generate
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
