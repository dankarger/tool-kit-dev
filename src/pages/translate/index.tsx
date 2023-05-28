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
import { SessionsSection } from "@/components/sessions-section";
// import toast from "react-hot-toast";
import { toast } from "@/components/ui/use-toast";
import { TranslateSection } from "@/components/translate-section";
import { FormSchema } from "@/components/translate-section";
import { TranslationResultComponent } from "@/components/translation-result";
import { InputAreaWithButton } from "@/components/input-area-with-button";
import { LoadingSpinner } from "@/components/ui/spinner";

const TranslatePage: NextPage = () => {
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
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader
            heading="Translate"
            text="Translate a text with GPTool."
          />

          <section className="space-y-2 px-3 pb-10 pt-2 md:pb-2 md:pt-4 lg:py-12">
            <TranslateSection handleTranslateButton={handleTranslateButton} />
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
              <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
                <>
                  <TranslationResultComponent data={data} />
                </>
              </div>
            </section>
          )}
        </main>
      </DashboardShell>
    </>
  );
};

export default TranslatePage;
