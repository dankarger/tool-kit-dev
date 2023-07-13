import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import * as z from "zod";
import e from "express";
interface InputWithButtonProps {
  // value: string;
  handleSubmitButton: (value: string) => void;
  placeholder?: string;
  buttonText?: string;
  buttonVariant?: string;
}

const postPatchSchema = z.object({
  prompt: z.string(z.string().min(1).max(128)),
});

export function InputWithButton({
  handleSubmitButton,
}: // placeholder,
InputWithButtonProps) {
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
    <div className="mt-4">
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <div>
          <Input
            type="text"
            placeholder="Type your Prompt here."
            autoFocus
            {...register("prompt")}
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
