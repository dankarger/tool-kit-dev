import React from "react";
import { type NextPage } from "next";
import type { Session, Response, ChatMessage } from "@/types";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import Head from "next/head";
import { dashboardConfig } from "@/config/dashboard";
import { SessionsSection } from "@/components/sessions-section";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { DashboardNav } from "@/components/nav";
import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";
import { toast } from "@/components/ui/use-toast";
import { TranslateSection } from "@/components/translate-section";
import { FormSchema } from "@/components/translate-section";
import { TranslationResultComponent } from "@/components/translation-result";
import { InputAreaWithButton } from "@/components/input-area-with-button";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

const TranslatePage: NextPage = () => {
  const [currentSession, setCurrenSession] = React.useState({
    translateId: "default-id",
  });
  const user = useUser();

  const {
    data: sessionData,
    isLoading: sessionSectionLoading,
    refetch: sessionRefetch,
    isSuccess,
  } = api.translate.getAllTranslationsByAuthorId.useQuery({
    authorId: user.user?.id ?? "",
  });

  const {
    data: selectedTranslateResult,
    isLoading: selectedTranslateLoading,
    refetch: selectedTranslateRefetch,
    isSuccess: selectedTranslateIsSucess,
  } = api.translate.getTranlateResultById.useQuery({
    translateId:
      currentSession.translateId !== "default-id"
        ? currentSession.translateId
        : "",
  });

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
      // title: text.substring(0,15)
    });
  };
  const handleSelectStory = (translateId: string) => {
    console.log("storyId", translateId);
    const obj = {
      translateId: translateId ?? "default-id",
    };
    setCurrenSession(obj);
    void sessionRefetch();
    void selectedTranslateRefetch();
    // void fullStoryReset();
  };

  const handleCreateNewSession = () => {
    // setCurrenSession({ storyId: "default-id" });
    setCurrenSession({ translateId: "default-id" });
    // setImageUrlResult("");
    // setTextResult("");
    // setTitle("");
  };
  return (
    <>
      <Head>
        <title>Translate</title>
        <meta name="description" content="GPTool kit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardShell>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader
            heading="Translate"
            text="Translate a text with GPTool."
          />

          <section className=" items-top flex-col justify-center space-y-2 px-3 pb-2 pt-2 md:pb-2 md:pt-4 lg:py-2">
            {" "}
            <div className="flex  w-full  flex-row justify-between ">
              <TranslateSection handleTranslateButton={handleTranslateButton} />
              {sessionData && (
                <div className=" flex w-1/3   flex-col items-end justify-center   ">
                  <SessionsSection
                    sessions={sessionData}
                    onSelect={handleSelectStory}
                    onNewSession={handleCreateNewSession}
                  />
                </div>
              )}
            </div>
            {/* <InputAreaWithButton
                handleSubmitteButton={handleTranslateButton}
                placeholder="Past or type here the text to translate..."
              /> */}
          </section>
          {isLoading && (
            <div className="flex h-fit w-full items-center justify-center">
              <LoadingSpinner size={90} />
            </div>
          )}
          {data && (
            <section className="container space-y-2 bg-slate-50 py-2 dark:bg-transparent md:py-8 lg:py-14">
              <Separator className="mt-2" />
              <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
                <>
                  <TranslationResultComponent data={data} />

                  {/* <div>
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                      {data.title}
                    </h1>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      <span>Original :</span> {data.text}
                    </p>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      <span>{data.language}:</span> {data.translation}
                    </p>
                  </div> */}
                </>
              </div>
            </section>
          )}
          {selectedTranslateResult && (
            <div>
              <TranslationResultComponent data={selectedTranslateResult} />
              {/* <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {selectedTranslateResult.title}
              </h1>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                <span>Original :</span> {selectedTranslateResult.text}
              </p>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                <span>{selectedTranslateResult.language}:</span>{" "}
                {selectedTranslateResult.translation}
              </p> */}
            </div>
          )}
        </main>
      </DashboardShell>
    </>
  );
};

export default TranslatePage;
