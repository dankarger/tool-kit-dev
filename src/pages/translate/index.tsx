import React, { useState } from "react";
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
  const [isShowingPrevResults, setIsShowingPrevResults] = useState(false);
  const user = useUser();

  const {
    data: sessionData,
    isLoading: sessionSectionLoading,
    refetch: sessionRefetch,
    isSuccess,
  } = api.translate.getAllTranslationsByAuthorId.useQuery({
    authorId: user.user?.id || "random",
  });

  const {
    data: selectedTranslateResult,
    isLoading: selectedTranslateLoading,
    refetch: selectedTranslateRefetch,
    isSuccess: selectedTranslateIsSucess,
  } = api.translate.getTranlateResultById.useQuery(
    {
      translateId:
        currentSession.translateId !== "default-id"
          ? currentSession.translateId
          : "",
    },
    { trpc: { abortOnUnmount: true } }
  );

  const { mutate, isLoading, data } =
    api.translate.createTranslation.useMutation({
      // mutationFn:async({text,language}:)=>{
      //   console.log("mutate");

      // },
      onSuccess: (data) => {
        setCurrenSession({ translateId: data.id });
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
    setIsShowingPrevResults(false);
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
    setIsShowingPrevResults(true);
    // void fullStoryReset();
  };

  const handleCreateNewSession = () => {
    // setCurrenSession({ storyId: "default-id" });
    setCurrenSession({ translateId: "default-id" });
    // setImageUrlResult("");
    // setTextResult("");
    // setTitle("");
    setIsShowingPrevResults(false);
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
              {/* <Separator orientation="vertical" /> */}
              <div className=" flex w-1/3   flex-col items-end justify-center   ">
                {sessionSectionLoading && (
                  <SessionsSection
                    sessions={[]}
                    onSelect={handleSelectStory}
                    onNewSession={handleCreateNewSession}
                  />
                )}
                {sessionData && (
                  <SessionsSection
                    sessions={sessionData}
                    onSelect={handleSelectStory}
                    onNewSession={handleCreateNewSession}
                  />
                )}
              </div>
            </div>
          </section>
          {isLoading && (
            <div className="flex h-fit w-full items-center justify-center">
              <LoadingSpinner size={90} />
            </div>
          )}
          {data &&
            !isShowingPrevResults &&
            currentSession.translateId !== "default-id" && (
              <section className=" w-full  space-y-2 bg-slate-50 py-2 dark:bg-transparent md:py-8 lg:py-6">
                <Separator className="mt-2" />
                <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
                  <TranslationResultComponent data={data} />
                </div>
              </section>
            )}
          {selectedTranslateResult && isShowingPrevResults && (
            <section className=" w-full  space-y-2 bg-slate-50 py-2 dark:bg-transparent md:py-8 lg:py-6">
              <DashboardHeader
                heading="Result"
                text="You can see past result with the  top right select menu"
              />
              {/* <Separator className="mt-2" /> */}
              <div className="py-4">
                <TranslationResultComponent data={selectedTranslateResult} />
              </div>
            </section>
          )}
        </main>
      </DashboardShell>
    </>
  );
};

export default TranslatePage;
