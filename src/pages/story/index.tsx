import React, { use, useEffect, useId } from "react";
import { type NextPage } from "next";
import type { Session, Response, ChatMessage } from "@/types";
import Head from "next/head";
import { dashboardConfig } from "@/config/dashboard";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { DashboardNav } from "@/components/nav";
import { SessionsSection } from "@/components/sessions-section";
// import toast from "react-hot-toast";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { SummarizeSection } from "@/components/summarize-section2";
import { SessionsSection2 } from "@/components/session-section2";
import { SummarizeResult } from "@/components/summarize-result";
import { TextInputForm } from "@/components/text-input-form";

const StoryPage: NextPage = () => {
  const user = useUser();
  const ctx = api.useContext();

  // const { data, isLoading, isFetching } = api.translate.getAllTranslationsByAuthorId.useQ({
  //   authorId: user.user?.id,
  // })

  const {
    data: sessionData,
    isLoading: sessionSectionLoading,
    refetch: sessionRefetch,
    isSuccess,
  } = api.summarize.getAllSummarizeByAuthorId.useQuery({
    authorId: user.user?.id ?? "",
  });

  const { mutate, isLoading, data } =
    api.summarize.createSummarizeResult.useMutation({
      onSuccess: () => {
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
                <code className="text-white">
                  Failed to generate story , please try again{" "}
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
    console.log("translate button clicked");
    console.log("text", text);
    void mutate({
      text: text,
    });
  };

  return (
    <>
      <Head>
        <title>Summarize</title>
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
              heading="Generate Story"
              text="Generate a Story with"
            />
            <section className=" items-top flex-col justify-center space-y-2 px-3 pb-10 pt-2 md:pb-2 md:pt-4 lg:py-12">
              <div className="f-full flex justify-between">
                {/* <SummarizeSection
                  handleSummarizeButton={handleSummarizeButton}
                /> */}
                <TextInputForm handleSubmitButton={handleSummarizeButton} />
                {sessionData && <SessionsSection2 sessions={sessionData} />}
              </div>
              {isLoading && (
                <div className="flex h-fit w-full items-center justify-center">
                  <LoadingSpinner size={90} />
                </div>
              )}
            </section>
            {data && (
              <section className="container space-y-2 bg-slate-50 py-2 dark:bg-transparent md:py-8 lg:py-14">
                <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
                  {data && (
                    <div>
                      <SummarizeResult result={data.result} />
                    </div>
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      </DashboardShell>
    </>
  );
};

export default StoryPage;
