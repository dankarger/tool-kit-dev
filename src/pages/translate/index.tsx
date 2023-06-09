import React, { useState } from "react";
import { type NextPage } from "next";
import type {
  Session,
  Response,
  ChatMessage,
  TranslationResultType,
} from "@/types";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import Head from "next/head";
import { dashboardConfig } from "@/config/site";
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
    id: "default-id",
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
  const deleteResult = api.translate.deleteResult.useMutation({
    async onSuccess() {
      toast({
        title: "Deleted 1 Result",
        // description: (
        //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //     <code className="text-white">
        //       Failed to summarize , please try again{" "}
        //     </code>
        //   </pre>
        // ),
      });
      await sessionRefetch();
    },
  });
  const {
    data: selectedTranslateResult,
    isLoading: selectedTranslateLoading,
    refetch: selectedTranslateRefetch,
    isSuccess: selectedTranslateIsSucess,
  } = api.translate.getTranlateResultById.useQuery(
    {
      id: currentSession.id !== "default-id" ? currentSession.id : "",
    },
    { trpc: { abortOnUnmount: true } }
  );

  const { mutate, isLoading, data } =
    api.translate.createTranslation.useMutation({
      // mutationFn:async({text,language}:)=>{
      //   console.log("mutate");

      // },
      onSuccess: (data: TranslationResultType) => {
        setCurrenSession({ id: data.id });
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
      id: translateId ?? "default-id",
    };
    setCurrenSession(obj);
    void sessionRefetch();
    void selectedTranslateRefetch();
    setIsShowingPrevResults(true);
    // void fullStoryReset();
  };

  const handleCreateNewSession = () => {
    // setCurrenSession({ storyId: "default-id" });
    setCurrenSession({ id: "default-id" });
    // setImageUrlResult("");
    // setTextResult("");
    // setTitle("");
    setIsShowingPrevResults(false);
  };
  const handleDeleteResult = (id: string) => {
    void deleteResult.mutate({
      id: id,
    });
    void sessionRefetch();
  };
  return (
    <>
      <Head>
        <title>Translate</title>
        <meta name="description" content="GPTool kit" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <DashboardShell>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader
            heading="Translate"
            text="Translate a text with GPTool."
          />

          <section className="jus flex   gap-2 space-y-2 px-3 pb-2 pt-2 md:pb-2 md:pt-4 lg:py-2">
            {/* <div className="flex  w-full  flex-row justify-between "> */}
            <div className="lg:dark:hover: flex w-full flex-col  items-start  justify-between gap-6 rounded-md  px-4  lg:flex-row      lg:gap-y-0 lg:rounded-md  lg:border lg:border-gray-200  lg:bg-white   lg:py-8   lg:shadow-sm  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none  lg:dark:hover:border-gray-700  lg:dark:hover:bg-gray-800  lg:dark:hover:text-white     lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-900">
              <TranslateSection handleTranslateButton={handleTranslateButton} />
              {/* <Separator orientation="vertical" /> */}
              <div className=" flex w-1/3     ">
                {sessionSectionLoading && (
                  <SessionsSection
                    sessions={[]}
                    onSelect={handleSelectStory}
                    onNewSession={handleCreateNewSession}
                    handleDeleteResult={handleDeleteResult}
                  />
                )}
                {sessionData && (
                  <SessionsSection
                    sessions={sessionData}
                    onSelect={handleSelectStory}
                    onNewSession={handleCreateNewSession}
                    handleDeleteResult={handleDeleteResult}
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
            currentSession.id !== "default-id" && (
              <section className=" w-full  space-y-2 py-2 dark:bg-transparent md:py-8 lg:py-6">
                <Separator className="mt-2" />

                <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
                  <DashboardHeader
                    heading="Result"
                    text="You can see past result with the  top right select menu"
                  />
                  <TranslationResultComponent data={data} />
                </div>
              </section>
            )}
          {selectedTranslateResult &&
            isShowingPrevResults &&
            selectedTranslateResult.id !== "default-id" && (
              <section className=" space-y-2py-2  w-full dark:bg-transparent md:py-8 lg:py-6">
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
