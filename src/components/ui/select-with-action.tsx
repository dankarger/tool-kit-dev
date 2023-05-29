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
import type { Session, StoryResult, Response, ChatMessage } from "@/types";

const FormSchema = z.object({
  session: z.string({
    required_error: "Please select an sesion to display.",
  }),
});
type SelectElementProps = {
  options: Session[] | StoryResult[];
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
              <FormLabel>Previous Sessions</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={"none"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="New Session" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={option.id}
                      data-valueid={option.id}
                    >
                      {option.name || `${option.title?.substring(0, 25)}...`}
                    </SelectItem>
                  ))}
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
