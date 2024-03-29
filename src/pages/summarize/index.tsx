import React, { useState } from "react";
import { type NextPage } from "next";

import Head from "next/head";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { DashboardNav } from "@/components/nav";
// import toast from "react-hot-toast";

import { SessionsSection } from "@/components/sessions-section";
import { TextInputForm } from "@/components/text-input-form";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/spinner";
import { SummarizeResult } from "@/components/summarize-result";

const SummarizePage: NextPage = () => {
  const [currentSession, setCurrenSession] = React.useState({
    id: "default-id",
  });
  const [isShowingPrevResults, setIsShowingPrevResults] = useState(false);
  const user = useUser();

  const {
    data: sessionData,
    isLoading: sessionSectionLoading,
    refetch: sessionRefetch,
  } = api.summarize.getAllSummarizeByAuthorId.useQuery({
    authorId: user.user?.id ?? "",
  });
  const deleteResult = api.summarize.deleteResult.useMutation({
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
    data: selectedSummarizeResult,
    isLoading: selectedSummarizeLoading,
    refetch: selectedSummarizeRefetch,
    isSuccess: selectedSummarizeIsSucess,
  } = api.summarize.getSummarizeResultById.useQuery(
    {
      id: currentSession.id !== "default-id" ? currentSession.id : "",
    },
    { trpc: { abortOnUnmount: true } }
  );

  const { mutate, isLoading, data } =
    api.summarize.createSummarizeResult.useMutation({
      onSuccess: () => {
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
                <code className="text-white">
                  Failed to summarize , please try again{" "}
                </code>
              </pre>
            ),
          });
          console.log("Failed to summarize, please try again");
        }
      },
    });

  const handleSummarizeButton = (text: string) => {
    if (!text) {
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
    console.log("summarize button clicked");
    console.log("text", text);
    setIsShowingPrevResults(false);
    void mutate({
      text: text,
    });
  };

  const handleSelectSummary = (id: string) => {
    console.log("id", id);
    const obj = {
      id: id ?? "default-id",
    };
    setCurrenSession(obj);
    void sessionRefetch();
    void selectedSummarizeRefetch();
    setIsShowingPrevResults(true);
  };
  const handleCreateNewSession = () => {
    setCurrenSession({ id: "default-id" });
    setIsShowingPrevResults(false);
  };
  const handleDeleteResult = (id: string) => {
    if (id && id.length > 0) {
      void deleteResult.mutate({
        id: id,
      });
    }
    void sessionRefetch();
  };

  return (
    <>
      <Head>
        <title>Summarize</title>
        <meta name="description" content="GPTool kit" />
        <link rel="icon" href="/fav.png" />
      </Head>
      <DashboardShell>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader
            heading="Summarize"
            text="Summarize a text with GPTool."
          />
          <section className="flex w-full gap-2 space-y-2 p-0   px-0 pb-2 pt-2   sm:px-0 md:pb-2 md:pt-4 lg:px-3 lg:py-2">
            {" "}
            <div className="lg:dark:hover: flex w-full flex-col-reverse items-start justify-between gap-6 rounded-md  px-0  sm:flex-col-reverse sm:px-0 md:flex-col-reverse  lg:flex-row  lg:gap-y-0 lg:rounded-md    lg:bg-white   lg:py-8   lg:shadow-sm  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none  lg:dark:hover:border-gray-700  lg:dark:hover:bg-gray-800  lg:dark:hover:text-white     lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-900">
              <div className="w-full sm:w-full md:w-full lg:w-3/4">
                <TextInputForm
                  inputType="area"
                  handleSubmitButton={handleSummarizeButton}
                  placeholder="Type or past text here to summarize...."
                />
              </div>
              <div className=" w-full sm:w-full  md:w-full  lg:w-1/4 ">
                {sessionSectionLoading && (
                  <SessionsSection
                    sessions={[]}
                    onSelect={handleSelectSummary}
                    onNewSession={handleCreateNewSession}
                    handleDeleteResult={handleDeleteResult}
                    // disabled={true}
                  />
                )}
                {sessionData && (
                  <SessionsSection
                    sessions={sessionData}
                    onSelect={handleSelectSummary}
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
          {selectedSummarizeResult &&
            isShowingPrevResults &&
            selectedSummarizeResult.id !== "default-id" && (
              <section className="  container flex   space-y-2 bg-slate-50 py-2 dark:bg-transparent md:py-8 lg:py-14">
                <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col  gap-4   p-2 text-center">
                  <SummarizeResult data={selectedSummarizeResult} />
                </div>
              </section>
            )}
          {data && (
            <section className="  container flex   space-y-2 bg-slate-50 py-2 dark:bg-transparent md:py-8 lg:py-14">
              <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-start  gap-4   p-2 text-center">
                {data && !isShowingPrevResults && (
                  <SummarizeResult data={data} />
                )}
              </div>
            </section>
          )}
        </main>
      </DashboardShell>
    </>
  );
};

export default SummarizePage;
