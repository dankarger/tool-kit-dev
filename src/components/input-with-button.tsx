import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";

interface InputWithButtonProps {
  // value: string;
  handleSubmitButton: (value: string) => Promise<void> | any;
  placeholder?: string;
  buttonText?: string;
  buttonVariant?: string;
}
// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {}

export function InputWithButton({
  // value,
  handleSubmitButton,
  placeholder,
}: InputWithButtonProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      prompt: "",
    },
  });

  console.log("dsdsd");
  return (
    <div className=" p-21 flex w-full  items-center gap-2 space-x-2">
      <form
        onSubmit={handleSubmit(async (value) => {
          try {
            void handleSubmitButton(value.prompt);
          } catch (e) {
            console.log("e", e);
          }
          void resetField("prompt");
        })}
      >
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
