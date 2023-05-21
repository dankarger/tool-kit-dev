import React, { use, useEffect, useId } from "react";
import { type NextPage } from "next";
import type { Session, Response, ChatMessage } from "@/types";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import Head from "next/head";
import { dashboardConfig } from "@/config/dashboard";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { DashboardNav } from "@/components/nav";
import { InputWithButton } from "@/components/input-with-button";
import { ResponseDiv } from "@/components/response-div";
import { ResponseSection } from "@/components/response-sections";
import { SessionsSection } from "@/components/sessions-section";
// import toast from "react-hot-toast";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { TranslateSection } from "@/components/translate-section";
import { FormSchema } from "@/components/translate-section";

const SessionsSectionFeed = ({
  authorId,
  onClick,
  sessionData,
}: {
  sessionData: Session[];
  needRefresh: boolean;
  authorId: string;
  onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}): JSX.Element => {
  if (!sessionData) return <></>;
  return <SessionsSection sessions={sessionData} onClick={onClick} />;
};

const TranslatePage: NextPage = () => {
  const [promptValue, setPromptValue] = React.useState("");
  const [chatResponce, setChatResponse] = React.useState("");
  const [textToTranslate, setTextToTranslate] = React.useState("");
  const [selectedLanguage, setSelectedLanguage] = React.useState("English");
  const [currentSession, setCurrenSession] = React.useState({
    id: "defaultId",
  });
  const router = useRouter();
  const user = useUser();
  const ctx = api.useContext();

  // const { data, isLoading, isFetching } = api.translate.getAllTranslationsByAuthorId.useQ({
  //   authorId: user.user?.id,
  // })

  const { mutate, isLoading, data } =
    api.translate.createTranslation.useMutation({
      // mutationFn:async({text,language}:)=>{
      //   console.log("mutate");

      // },
      onSuccess: () => {
        // setPromptValue("");
        // void session.refetch();
        console.log("sucesss ");
      },
      onError: (error) => {
        const errorMessage = error.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast({
            title: errorMessage[0],
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify(errorMessage, null, 2)}
                </code>
              </pre>
            ),
          });
          console.log("errorMessage", errorMessage[0]);
        } else {
          toast({
            title: "fialed",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">Failed </code>
              </pre>
            ),
          });
          console.log("Failed to create translation, please try again");
        }
      },
    });

  const handleTranslateButton = (text: string, language: string) => {
    if (!text || !language) {
      toast({
        title: "Please enter all fields",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">Please enter all fields </code>
          </pre>
        ),
      });
      return;
    }
    console.log("translate button clicked");
    console.log("text", text);
    console.log("language", language);
    void mutate({
      text: text,
      language: language,
    });
  };

  return (
    <>
      <Head>
        <title>Translate</title>
        <meta name="description" content="GPTool kit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardShell>
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <DashboardNav items={dashboardConfig.chat} />
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            <DashboardHeader
              heading="Translate"
              text="Translate a text with GPTool."
            />
            {/* <section className="  space-y-1  pb-4 md:pb-2 md:pt-2 lg:py-2"></section>
            1 */}
            <section className="space-y-2 px-3 pb-10 pt-2 md:pb-2 md:pt-4 lg:py-12">
              <TranslateSection
                handleTranslateButton={handleTranslateButton}
                // selectedLanguage={selectedLanguage}
                // setTextToTranslate={setTextToTranslate}
                // setSelectedLanguage={setSelectedLanguage}
              />
            </section>
            <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-14">
              <div className=" container relative flex max-w-[64rem] flex-col items-center gap-4 text-center">
                3
                {isLoading && (
                  <div className="flex w-full items-center justify-center">
                    <LoadingSpinner size={40} />
                  </div>
                )}
                {/* {data && (
                  <ResponseDiv
                    response={data.response}
                    message={data.message}
                  />  */}
              </div>
            </section>
          </main>
        </div>
      </DashboardShell>
    </>
  );
};

export default TranslatePage;
