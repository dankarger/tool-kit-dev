import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Switch } from "@/components/ui/switch"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { a } from "react-spring";

const LANGUAGES = [
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
  text: z.string().min(2, {
    message: "Cant translate less than 2 characters.",
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
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setTextToTranslate(data.text);
    setSelectedLanguage(data.language);
    handleTranslateButton(data.text, data.language);
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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Language</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={LANGUAGES[0]}
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
              <FormDescription>
                You can manage email addresses in your{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>text for translate:</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Past or type here the text for translate and press the Enter button"
                  rows={4}
                  className=""
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can view older translations results
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button disabled={!form.formState.isValid} type="submit">
            Translate
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setTextToTranslate("");
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
