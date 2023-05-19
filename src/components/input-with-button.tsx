import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { SubmitHandler } from "react-hook-form";

import * as z from "zod";
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

  // function onSubmit(data: FormData, e?: React.BaseSyntheticEvent) {
  //   e?.preventDefault();
  //   handleSubmitButton(data.prompt);
  //   console.log("from form2", data.prompt);
  //   resetField("prompt");
  // const response = await fetch(`/api/posts/${post.id}`, {
  //   method: "PATCH",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     title: data.title,
  //     content: blocks,
  //   }),
  // router.refresh();
  // }
  const onSubmit: SubmitHandler<FormData> = (
    data,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    void handleSubmitButton(data.prompt);
    console.log("from form2", data.prompt);
    resetField("prompt");
  };
  console.log("dsdsd");
  return (
    <div className=" p-21 flex w-full  items-center gap-2 space-x-2">
      <form onSubmit={void handleSubmit(onSubmit)}>
        <div className="flex w-full max-w-sm items-center space-x-2">
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
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
// function zodResolver(postPatchSchema: z.ZodObject<{ prompt: z.ZodString; }, "strip", z.ZodTypeAny, { prompt: string; }, { prompt: string; }>): import("react-hook-form").Resolver<{ prompt: string; }, any> | undefined {
//   throw new Error("Function not implemented.");
// }
