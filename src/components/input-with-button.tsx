import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import * as z from "zod";
import e from "express";
// import { zodResolver } from "@hookform/resolvers/zod";
interface InputWithButtonProps {
  // value: string;
  handleSubmitButton: (value: string) => void;
  placeholder?: string;
  buttonText?: string;
  buttonVariant?: string;
}
// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {}

const postPatchSchema = z.object({
  prompt: z.string(z.string().min(3).max(128)),
});

export function InputWithButton({
  // value,
  handleSubmitButton,
}: // placeholder,
InputWithButtonProps) {
  // const {
  //   register,
  //   formState: { errors },
  //   handleSubmit,
  //   resetField,
  // } = useForm({
  //   mode: "onChange",
  //   reValidateMode: "onChange",
  //   defaultValues: {
  //     prompt: "",
  //   },
  const router = useRouter();
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    // resolver: zodResolver(postPatchSchema),
  });

  // });
  type FormData = {
    prompt: string;
    e: Event;
  };

  const onSubmit: SubmitHandler<FormData> = (
    data,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    void handleSubmitButton(data.prompt);
    resetField("prompt");
  };
  return (
    <div
      className="mt-4"
      // className="   justify-space-between flex w-full   gap-2 space-x-1"
    >
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        // className="flex w-full max-w-sm items-center space-x-2"
      >
        <div
        // className="justify-space-between flex w-full max-w-sm   items-center space-y-2  "
        >
          <Input
            type="text"
            placeholder="Type your Prompt here."
            autoFocus
            // onError={errors}
            // value={value}
            // name="promptinpute"
            {...register("prompt")}

            // inputRef={register({ required: true })}
            // error={!!errors.prompt}
            // onChange={(e) => handleSubmit(e.target.value)}
          />
          {errors.prompt && <p>prompt is required.</p>}
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </div>
      </form>{" "}
    </div>
  );
}
// function zodResolver(postPatchSchema: z.ZodObject<{ prompt: z.ZodString; }, "strip", z.ZodTypeAny, { prompt: string; }, { prompt: string; }>): import("react-hook-form").Resolver<{ prompt: string; }, any> | undefined {
//   throw new Error("Function not implemented.");
// }
