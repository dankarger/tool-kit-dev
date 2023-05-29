import React, { useState } from "react";
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
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { StorySection } from "@/components/story-section";
import { Skeleton } from "@/components/ui/skeleton";

const StoryPage: NextPage = () => {
  const [userPromt, setUserPrompt] = useState("");
  const [textResult, setTextResult] = useState("");
  const [promptForImage, setPromptForImage] = useState("");
  const [imageCloudinaryUrl, setImageCloudinaryUrl] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrlResult, setImageUrlResult] = useState("");
  const [currentSession, setCurrenSession] = React.useState({
    storyId: "default-id",
  });
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
  } = api.story.getAllStoriesByAuthorId.useQuery({
    authorId: user.user?.id ?? "",
  });
  const {
    data: selectedStory,
    isLoading: selectedStoryLoading,
    refetch: selectedStoryRefetch,
    isSuccess: selectedStoryIsSucess,
  } = api.story.getStoryByStoryId.useQuery({
    storyId:
      currentSession.storyId !== "default-id" ? currentSession.storyId : "",
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
      // create title
      createTitle({ story: data });
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
        uplaodImageToCloudinary({ image_url: data });
        console.log("image url result ", data);
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

  const { mutate: createTitle, data: dataTitle } =
    api.story.createTitle.useMutation({
      onSuccess: (data) => {
        // void session.refetch();
        setTitle(data);
        console.log("image url result ", data);
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

  const { mutate: uplaodImageToCloudinary } =
    api.story.uploadImageToCloudinary.useMutation({
      onSuccess(data) {
        console.log(";cloudinary result", data);
        setImageCloudinaryUrl(data);
        createFullStoryResult({
          title: title,
          text: userPromt,
          resultText: textResult,
          resultPrompt: promptForImage,
          resultImageUrl: data,
        });
      },
      //TODO : ADD ERROR handeling
    });

  const {
    mutate: createFullStoryResult,
    data,
    isLoading: isFullStoryLoading,
    reset: fullStoryReset,
  } = api.story.createFullStoryResult.useMutation({
    onSuccess(data) {
      console.log("%c,prisma result---------------", data);
      // handleSelectStory(data.id);
      sessionRefetch();
    },
    //TODO : ADD ERROR handeling
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

    setUserPrompt(text);
    handleCreateNewSession();
    void mutateText({
      text: text,
    });
  };

  const handleSelectStory = (storyId: string) => {
    console.log("storyId", storyId);
    const obj = {
      storyId: storyId ?? "default-id",
    };
    setCurrenSession(obj);
    // void session.refetch();
    selectedStoryRefetch();
    fullStoryReset();
  };

  const handleCreateNewSession = () => {
    setCurrenSession({ storyId: "default-id" });
    setImageUrlResult("");
    setTextResult("");
    setTitle("");
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
              {sessionSectionLoading && (
                <Skeleton className="h-[150px] w-[200px]" />
              )}
              {sessionData && (
                <SessionsSection
                  sessions={sessionData}
                  onSelect={handleSelectStory}
                  onNewSession={handleCreateNewSession}
                />
              )}
            </div>
            {(isLoading || isFullStoryLoading) && (
              <div className="flex h-fit w-full items-center justify-center">
                <LoadingSpinner size={390} />
              </div>
            )}
          </section>
          <div>
            {selectedStory && (
              <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {selectedStory.title}
                </h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  {selectedStory.resultText}
                </p>
                <img src={selectedStory.resultImageUrl} alt="image" />
              </div>
            )}
          </div>
          {data && (
            <section className="container space-y-2 bg-slate-50 py-2 dark:bg-transparent md:py-8 lg:py-14">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {data.title}
              </h1>
              <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  {data.resultText}
                </p>
                <img src={data.resultImageUrl} alt="image" />
              </div>
            </section>
          )}
          {/* <section className="container space-y-2 bg-slate-50 py-2 dark:bg-transparent md:py-8 lg:py-14">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {title}---
            </h1>
            <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                {textResult}
              </p>
            </div>
            {imageUrlResult && <img src={imageUrlResult} alt="image" />}
          </section> */}
        </main>
      </DashboardShell>
    </>
  );
};

export default StoryPage;
