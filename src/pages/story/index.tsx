import React, { useState } from "react";
import { type NextPage } from "next";
import type { Session, Response, ChatMessage } from "@/types";
import Head from "next/head";
import { dashboardConfig } from "@/config/site";
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
import { Separator } from "@radix-ui/react-separator";
import { StoryResultDiv } from "@/components/story-result";
import { StorySteps } from "@/components/story-steps";

const StoryPage: NextPage = () => {
  const [userPromt, setUserPrompt] = useState("");
  const [textResult, setTextResult] = useState("");
  const [promptForImage, setPromptForImage] = useState("");
  const [imageCloudinaryUrl, setImageCloudinaryUrl] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrlResult, setImageUrlResult] = useState("");
  const [isShowingPrevResults, setIsShowingPrevResults] = useState(false);
  const [currentSession, setCurrenSession] = React.useState({
    storyId: "default-id",
  });
  const user = useUser();
  const ctx = api.useContext();
  const scrollDivRef = React.useRef<HTMLDivElement>(null);

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
    remove: selectedStoryReset,
  } = api.story.getStoryByStoryId.useQuery({
    storyId:
      currentSession.storyId !== "default-id" ? currentSession.storyId : "",
  });
  const deleteResult = api.story.deleteResult.useMutation({
    async onSuccess() {
      toast({
        title: "Deleted 1 Story",
      });
      await sessionRefetch();
    },
  });

  const {
    mutate: mutateText,
    isSuccess: textIsSuccess,
    isLoading,
    data: textData,
    status: textStatus,
    reset: textReset,
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

  const {
    mutate: createPrompt,
    data: promptData,
    isLoading: promptIsLoading,
  } = api.story.createPromptForImage.useMutation({
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

  const {
    mutate: createImage,
    data: imageData,
    isLoading: ImageIsLoading,
  } = api.story.createImage.useMutation({
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

  const {
    mutate: createTitle,
    data: dataTitle,
    isLoading: titleisLoading,
    isSuccess: titleSuccess,
    status: titleStatus,
    reset: titleReset,
  } = api.story.createTitle.useMutation({
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

  const {
    mutate: uplaodImageToCloudinary,
    data: imageCloudinaryData,
    status: imageCloudinaryStatus,
    reset: imageCloudinaryReset,
    isLoading: cloudinaryIsLoading,
    isSuccess: imageIsSuccess,
  } = api.story.uploadImageToCloudinary.useMutation({
    onSuccess(data: string) {
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
      void sessionRefetch();
    },
    //TODO : ADD ERROR handeling
  });

  const handleStoryGenerateButton = (text: string) => {
    scrollDivRef.current?.scrollIntoView();
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
    selectedStoryReset();
    textReset();
    titleReset();
    imageCloudinaryReset();
    setIsShowingPrevResults(false);
    setUserPrompt(text);
    handleCreateNewSession();
    void mutateText({
      text: text,
    });
  };

  const handleSelectStory = (storyId: string) => {
    setIsShowingPrevResults(true);
    scrollDivRef.current?.scrollIntoView({
      behavior: "auto",
      // block: "end",
      // inline: "nearest",
    });
    // handleScroll();
    console.log("storyId", storyId);
    const obj = {
      storyId: storyId ?? "default-id",
    };
    setCurrenSession(obj);
    // void session.refetch();
    void selectedStoryRefetch();
    void fullStoryReset();
  };

  const handleCreateNewSession = () => {
    selectedStoryReset();
    textReset();
    titleReset();
    imageCloudinaryReset();
    setIsShowingPrevResults(false);
    setCurrenSession({ storyId: "default-id" });
    setImageUrlResult("");
    setTextResult("");
    setTitle("");
  };
  const handleDeleteResult = (id: string) => {
    void deleteResult.mutate({
      id: id,
    });
    void sessionRefetch();
  };

  function handleScroll() {
    window.scroll({
      top: 12, // or document.scrollingElement || document.body
      left: 10,
      behavior: "smooth",
    });
  }

  return (
    <>
      <Head>
        <title>Summarize</title>
        <meta name="description" content="GPTool kit" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <DashboardShell>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader
            heading="Generate Story"
            text="Generate a Story with"
          />
          <section className=" items-top mb-6 flex-col justify-center space-y-2 px-3 pb-10 pt-2 md:pb-2 md:pt-4 lg:py-12">
            {/* <div className="f-full container flex justify-between gap-12  rounded-md  border border-slate-400  shadow-md dark:bg-transparent md:py-8 lg:py-14"> */}
            <div className="lg:dark:hover: flex h-full w-full  flex-col items-start justify-start rounded-md p-4 align-middle lg:flex-row  lg:flex-wrap lg:items-center  lg:justify-between  lg:gap-x-4  lg:gap-y-0 lg:rounded-md  lg:border lg:border-gray-200  lg:bg-white   lg:p-8  lg:align-middle  lg:shadow-lg  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none  lg:dark:hover:border-gray-700  lg:dark:hover:bg-gray-800  lg:dark:hover:text-white     lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-900">
              <StorySection handleSubmitButton={handleStoryGenerateButton} />
              {sessionSectionLoading && (
                // <Skeleton className="h-[150px] w-[200px]" />
                <SessionsSection
                  sessions={[]}
                  onSelect={handleSelectStory}
                  onNewSession={handleCreateNewSession}
                  handleDeleteResult={handleDeleteResult}
                  // disabled={true}
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
          </section>

          <div>
            {selectedStory &&
              isShowingPrevResults &&
              selectedStory.id !== "default-id" && (
                <section className="container space-y-2 bg-slate-50  py-6 dark:bg-transparent md:py-8 lg:py-14">
                  <Separator />
                  <StoryResultDiv
                    title={selectedStory.title}
                    resultText={selectedStory.resultText}
                    resultImageUrl={selectedStory.resultImageUrl}
                  />
                </section>
              )}
          </div>
          {(isLoading ||
            isFullStoryLoading ||
            ImageIsLoading ||
            titleisLoading ||
            cloudinaryIsLoading ||
            promptIsLoading) && (
            <section className="container space-y-2 bg-slate-50  py-6 dark:bg-transparent md:py-8 lg:py-14">
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className=" flex h-1/2 w-1/2 flex-col justify-center pl-4">
                  {/* <LoadingSpinner size={16} /> */}
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Please wait...
                  </h4>
                  {/* <LoadingSpinner size={16} /> */}
                </div>
                <StorySteps
                  completedStep1={textIsSuccess}
                  completedStep2={titleSuccess}
                  completedStep3={imageIsSuccess}
                />
              </div>
            </section>
          )}
          {data && !isShowingPrevResults && (
            // currentSession.storyId !== "default-id" &&
            <>
              <Separator />
              <section className="container space-y-2 bg-slate-50  py-6 dark:bg-transparent md:py-8 lg:py-14">
                <StoryResultDiv
                  title={data.title}
                  resultText={data.resultText}
                  resultImageUrl={data.resultImageUrl}
                />
                {/* <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {data.title}
                  </h1>
                  <div className="container  relative flex h-fit w-full max-w-[64rem] flex-col items-center gap-4   p-2 text-center">
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      {data.resultText}
                    </p>
                    <img src={data.resultImageUrl} alt="image" />
                  </div> */}
              </section>
            </>
          )}
          <div
            className="visibility:hidden 	absolute bottom-10  left-0 right-0 "
            ref={scrollDivRef}
          ></div>
        </main>
      </DashboardShell>
    </>
  );
};

export default StoryPage;
