import React, { use, useEffect, useState } from "react";
import { type NextPage } from "next";
import type { SummarizeResultType } from "@/types";
import Head from "next/head";
import { dashboardConfig } from "@/config/dashboard";
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
import { SummarizeSection } from "@/components/summarize-section2";
import { SessionsSection2 } from "@/components/session-section2";
import { SummarizeResult } from "@/components/summarize-result";
import { ComboboxDropdownMenu } from "@/components/ui/ComboboxDropdownMenu";
import { IdentificationLink } from "@clerk/nextjs/server";

// const fetchResult = (id: string) => {
//   const helloNoArgs = api.summarize.getSummarizeResultById.useQuery({
//     id: id,
//   });
//   return helloNoArgs;
// };

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

  // const {data: selectedSummarizeData , isLoading} = api.summarize.getSummarizeResultById.useQuery({

  // })

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
    // void fullStoryReset();
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardShell>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader
            heading="Summarize"
            text="Summarize a text with GPTool."
          />
          <section className=" items-top flex-col justify-center space-y-2 px-3 pb-10 pt-2 md:pb-2 md:pt-4 lg:py-12">
            <div className="flex w-full ">
              {/* <SummarizeSection
                  handleSummarizeButton={handleSummarizeButton}
                /> */}
              <div className="w-full">
                <TextInputForm
                  inputType="area"
                  handleSubmitButton={handleSummarizeButton}
                  placeholder="Type or past text here to summarize...."
                />
              </div>
              {sessionSectionLoading && (
                // <Skeleton className="h-[150px] w-[200px]" />
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
            {/* {/* <ComboboxDropdownMenu /> */}
            {isLoading && (
              <div className="flex h-fit w-full items-center justify-center">
                <LoadingSpinner size={90} />
              </div>
            )}
          </section>
          {selectedSummarizeResult &&
            isShowingPrevResults &&
            selectedSummarizeResult.id !== "default-id" && (
              <div>
                <SummarizeResult result={selectedSummarizeResult.result} />
              </div>
            )}
          {data && (
            <section className="container space-y-2 bg-slate-50 py-2 dark:bg-transparent md:py-8 lg:py-14">
              <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
                {data && !isShowingPrevResults && (
                  // currentSession.id !== "default-id" && (
                  <div>
                    <SummarizeResult result={data.result} />
                  </div>
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
