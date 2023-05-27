import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// import { User } from "@prisma/client"
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { userTextInputSchema } from "@/lib/validations/user";
import { buttonVariants } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface TextInputFormProps extends React.HTMLAttributes<HTMLFormElement> {
  // user: Pick<User, "id" | "name">;;
  handleSubmitButton: (text: string) => void;
  placeholder?: string;
  inputType?: "text" | "area";
  description?: string;
  children?: ReactNode;
}

type FormData = z.infer<typeof userTextInputSchema>;

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
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(userTextInputSchema),
    defaultValues: {
      text: "",
    },
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  function onSubmit(data: FormData, e?: React.BaseSyntheticEvent) {
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
  }

  return (
    // <div>
    <form
      className={cn(className)}
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
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
          <div className="grid w-full gap-1">
            <Label className="sr-only" htmlFor="name">
              Text
            </Label>
            {inputType === "area" ? (
              <Textarea
                id="text"
                className="w-full"
                placeholder={placeholder}
                autoFocus
                max={132}
                min={230}
                {...register("text")}
              />
            ) : (
              <Input
                id="text"
                autoFocus
                className="w-full"
                placeholder={placeholder}
                size={32}
                {...register("text")}
              />
            )}
            {errors?.text && (
              <p className="px-1 text-xs text-red-600">{errors.text.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-between space-x-2">
            <button
              type="submit"
              className={cn(buttonVariants(), className)}
              disabled={isSaving}
            >
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>Submit</span>
            </button>
            <Button
              variant={"destructive"}
              onClick={(e) => {
                e.preventDefault();
                reset({ text: "" });
              }}
            >
              Clear
            </Button>
          </div>
        </CardFooter>
        {/* </div>
            <div>{children}</div>
          </div> */}
      </Card>
    </form>
    // </div>
  );
}
