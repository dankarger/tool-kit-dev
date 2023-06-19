import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { CardExample } from "./card-example";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const LANGUAGES = [
  "",
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Korean",
  "Portuguese",
  "Russian",
  "Turkish",
];

export const FormSchema = z.object({
  text: z.string().min(1, {
    message: "Cant translate empty text.",
  }),
  // .max(960, {
  //   message: "The text is too long...",
  // }),
  language: z.string(),
});

interface TranslateSectionProps {
  handleTranslateButton: (text: string, language: string) => void;
  // setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  // selectedLanguage: string;
  // setTextToTranslate: React.Dispatch<React.SetStateAction<string>>;
}

export function TranslateSection({
  handleTranslateButton,
}: TranslateSectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [textToTranslate, setTextToTranslate] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      language: LANGUAGES[1],
      text: "",
    },
  });

  type FormData = {
    text: string;
    language: string;
    // e: Event;
  };

  const onSubmit: SubmitHandler<FormData> = (
    data: z.infer<typeof FormSchema>,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    setTextToTranslate(data.text);
    setSelectedLanguage(data.language);
    void handleTranslateButton(data.text, data.language);
    // api call
    console.log("from onSubmit", data.text, data.language);
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
    <Card>
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          // className="bg-grey-950 first-letter:  flex w-2/3 flex-row-reverse items-start  justify-between  gap-8 rounded-md  border px-6 py-4"
        >
          <CardHeader>
            {/* <CardTitle>Report an issue</CardTitle>
        <CardDescription>
          What area are you having problems with?
        </CardDescription> */}
          </CardHeader>
          <CardContent
          // className=" grid gap-6 "
          >
            <div className="grid grid-cols-5 grid-rows-1 gap-4">
              {/* <CardExample> */}

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>text for translate:</FormLabel> */}
                      <FormControl>
                        <Textarea
                          placeholder="Past or type here the text..."
                          rows={4}
                          className="w-full"
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
              </div>
              {/* </CardExample> */}
              <div className=" col-span-2 col-start-4 ">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-sm">Translate to:</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={LANGUAGES[1]}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a target language " />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((language) => (
                            <SelectItem value={language} key={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* <FormDescription>
                You can manage email addresses in your{" "}
              </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-4 grid-rows-1 gap-4">
            <div className="col-span-4">
              <div className="flex w-3/5 items-center justify-between">
                <Button
                  // disabled={!form.formState.isValid}
                  type="submit"
                >
                  Translate
                </Button>
                <Button
                  variant={"ghost"}
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
        </form>
      </Form>
    </Card>
  );
}
