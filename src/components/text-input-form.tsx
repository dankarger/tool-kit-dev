import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// import { User } from "@prisma/client"
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
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(TextInputSchema),
    // defaultValues,
    // mode: "onChange",
  });

  // const {
  //   handleSubmit,
  //   register,
  //   formState: { errors },
  //   reset,
  // } = useForm<FormData>({
  //   resolver: zodResolver(TextInputSchema),
  //   defaultValues: {
  //     text: "",
  //   },
  // });

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
          {/* <div className="flex w-full justify-between">
            <div> */}
          <CardHeader>
            {/* <CardTitle>{placeholder}</CardTitle>
          <CardDescription>{description}</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid w-full ">
              <Label className="sr-only" htmlFor="name">
                Text
              </Label>
              {inputType === "area" ? (
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text</FormLabel>
                      <FormControl>
                        <Textarea
                          id="text"
                          // className="w-full"
                          placeholder={placeholder}
                          autoFocus
                          // max={332}
                          // min={130}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can <span>@mention</span> other users and
                        organizations to link to them.
                      </FormDescription>
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
                      <FormLabel>Text</FormLabel>
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
                      <FormDescription>
                        You can load and continue previous chats by using the
                        panel on the right
                      </FormDescription>
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
                <Button
                  // variant="default"
                  variant={"default"}
                  type="submit"
                  // className={cn(buttonVariants(), className)}
                  // disabled={isSaving}
                >
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
          {/* </div>
            <div>{children}</div>
          </div> */}
        </Card>
      </form>
    </Form>
  );
}
