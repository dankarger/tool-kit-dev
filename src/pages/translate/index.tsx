import React, { useState } from "react";
import { type NextPage } from "next";
import type { TranslationResultType } from "@/types";
import Head from "next/head";
import { SessionsSection } from "@/components/sessions-section";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { DashboardNav } from "@/components/nav";
import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";
import { toast } from "@/components/ui/use-toast";
import { TranslateSection } from "@/components/translate-section";
import { TranslationResultComponent } from "@/components/translation-result";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

const DEFAULT_ID = "defaultId";

const TranslatePage: NextPage = () => {
  const [currentSession, setCurrenSession] = React.useState({
    id: DEFAULT_ID,
  });
  const [isShowingPrevResults, setIsShowingPrevResults] = useState(false);
  const user = useUser();

  const {
    data: sessionData,
    isLoading: sessionSectionLoading,
    refetch: sessionRefetch,
    isSuccess,
  } = api.translate.getAllTranslationsByAuthorId.useQuery({
    authorId: user.user?.id || DEFAULT_ID,
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
      id: currentSession.id !== DEFAULT_ID ? currentSession.id : DEFAULT_ID,
    }
    // { trpc: { abortOnUnmount: true } }
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
      id: translateId ?? DEFAULT_ID,
    };
    setCurrenSession(obj);
    void sessionRefetch();
    void selectedTranslateRefetch();
    setIsShowingPrevResults(true);
    // void fullStoryReset();
  };

  const handleCreateNewSession = () => {
    // setCurrenSession({ storyId: DEFAULT_ID });
    setCurrenSession({ id: DEFAULT_ID });
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

          <section className="flex w-full   gap-2 space-y-2 px-3 pb-2 pt-2 md:pb-2 md:pt-4 lg:py-2">
            {/* <div className="flex  w-full  flex-row justify-between "> */}
            <div className="lg:dark:hover: flex  w-full flex-col-reverse items-start justify-between  gap-6 rounded-md  px-4 sm:flex-col-reverse md:flex-col-reverse  lg:flex-row     lg:gap-y-0 lg:rounded-md    lg:bg-white   lg:py-8   lg:shadow-sm  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none  lg:dark:hover:border-gray-700  lg:dark:hover:bg-gray-800  lg:dark:hover:text-white     lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-900">
              <div className="w-full sm:w-full md:w-full lg:w-3/4">
                <TranslateSection
                  handleTranslateButton={handleTranslateButton}
                />
              </div>
              {/* <Separator orientation="vertical" /> */}
              <div className=" w-full sm:w-full  md:w-full  lg:w-1/4 ">
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
            currentSession.id !== DEFAULT_ID && (
              <section className=" w-full  space-y-2 py-2 dark:bg-transparent md:py-8 lg:py-6">
                <Separator className="mt-2" />

                <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
                  <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Result
                  </h2>
                  <TranslationResultComponent data={data} />
                </div>
              </section>
            )}
          {selectedTranslateResult &&
            isShowingPrevResults &&
            selectedTranslateResult.id !== DEFAULT_ID && (
              <section className=" space-y-2py-2  w-full px-8 dark:bg-transparent md:py-8 lg:py-6">
                <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  Result
                </h2>
                <div className=" py-6">
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
