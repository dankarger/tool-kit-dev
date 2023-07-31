import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface TextInputFormProps extends React.HTMLAttributes<HTMLFormElement> {
  // user: Pick<User, "id" | "name">;;
  handleSubmitButton: (text: string) => void;
  placeholder?: string;
  inputType?: "text" | "area";
  description?: string;
  children?: React.ReactNode;
}
const TextInputSchema = z.object({
  text: z.string().min(1).max(1330),
});
type FormData = {
  text: string;
};

export function TextInputForm({
  // user,
  className,
  placeholder,
  inputType,
  description,
  children,
  handleSubmitButton,
  ...props
}: TextInputFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(TextInputSchema),
  });

  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const onSubmit: SubmitHandler<FormData> = (
    data: z.infer<typeof TextInputSchema>,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    void handleSubmitButton(data.text);
    console.log("from onSubmit", data.text);
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
        className={cn(className)}
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        {...props}
      >
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <div className="grid w-full ">
              {inputType === "area" ? (
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          id="text"
                          placeholder={placeholder}
                          autoFocus
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="text"
                          autoFocus
                          // className="w-full"
                          placeholder={placeholder}
                          size={70}
                          {...form.register("text")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-4 grid-rows-1 gap-4">
            <div className="col-span-4">
              <div className="flex w-full items-center justify-between">
                <Button variant={"default"} type="submit" id="chat_submit">
                  {isSaving && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <span>Submit</span>
                </Button>
                <Button
                  variant={"outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    form.reset({ text: "" });
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
