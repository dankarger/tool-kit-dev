import React, { useState, useEffect, useId } from "react";
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
import { StorySection } from "@/components/story-section";

const StoryPage: NextPage = () => {
  const [textResult, setTextResult] = useState("");
  const [promptForImage, setPromptForImage] = useState("");
  const [imageBase64Result, setImageBase64Result] = useState("");
  const [imageUrlResult, setImageUrlResult] = useState("");

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

  const {
    mutate: mutateText,
    isLoading,
    data: textData,
  } = api.story.createStoryTextResult.useMutation({
    onSuccess: (data) => {
      // void session.refetch();
      setTextResult(data);

      console.log("sucesssdata ", data);
      createPrompt({ story: data });
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
          title: "failed",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                Failed to generate story , please try again{" "}
              </code>
            </pre>
          ),
        });
        console.log("Failed to generate, please try again");
      }
    },
  });

  const { mutate: createPrompt, data: promptData } =
    api.story.createPromptForImage.useMutation({
      onSuccess: (data) => {
        // void session.refetch();
        setPromptForImage(data);
        console.log("prompt result ", data);
        createImage({ prompt: data });
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
            title: "failed",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  Failed to generate story , please try again{" "}
                </code>
              </pre>
            ),
          });
          console.log("Failed to generate, please try again");
        }
      },
    });

  const { mutate: createImage, data: imageData } =
    api.story.createImage.useMutation({
      onSuccess: (data) => {
        // void session.refetch();
        setImageUrlResult(data);
        console.log("image result ", data);
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
            title: "failed",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  Failed to generate story , please try again{" "}
                </code>
              </pre>
            ),
          });
          console.log("Failed to generate, please try again");
        }
      },
    });

  const handleStoryGenerateButton = (text: string) => {
    console.log("story", text);
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
    void mutateText({
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
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader
            heading="Generate Story"
            text="Generate a Story with"
          />
          <section className=" items-top flex-col justify-center space-y-2 px-3 pb-10 pt-2 md:pb-2 md:pt-4 lg:py-12">
            <div className="f-full flex justify-between">
              <StorySection handleSubmitButton={handleStoryGenerateButton} />
            </div>
            {isLoading && (
              <div className="flex h-fit w-full items-center justify-center">
                <LoadingSpinner size={90} />
              </div>
            )}
          </section>
          {textData && (
            <section className="container space-y-2 bg-slate-50 py-2 dark:bg-transparent md:py-8 lg:py-14">
              <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
                {textData && <div>{textData}</div>}
              </div>
              {imageData && <img src={imageData} alt="image" />}
            </section>
          )}
        </main>
      </DashboardShell>
    </>
  );
};

export default StoryPage;
