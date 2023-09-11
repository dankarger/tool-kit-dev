import React, { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { SessionsSection } from "@/components/sessions-section";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-separator";
import { StoryResultDiv } from "@/components/story-result";
import { StorySteps } from "@/components/story-steps";
import { TextInputForm } from "@/components/text-input-form";

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
  const scrollDivRef = React.useRef<HTMLDivElement>(null);

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

  // generating the story
  const {
    mutate: mutateText,
    isSuccess: textIsSuccess,
    isLoading,
    data: textData,
    status: textStatus,
    reset: textReset,
  } = api.story.createStoryTextResult.useMutation({
    onSuccess: (data) => {
      setTextResult(data);
      console.log("sucesssdata ", data);
      createPrompt({ story: data });
      // createImageStable({ prompt: data }); // uncomment to send the image api the story directly
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
      setPromptForImage(data);
      console.log("prompt result ", data);
      // createImage({ prompt: data }); // openai image creation

      createImageStable({ prompt: data }); //  to create dedicated promt for image with stability

      // if (textData) createImageStable({ prompt: textData }); // to create image with the story as prompt;
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
      console.log(
        "%c--------------------------------------------------------",
        "color: yellow"
      );
      console.log("type of data", data);
      // setImageUrlResult(data);
      // uplaodImageToCloudinary({ image_url: data });

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

  // Stability ai ----------------------------------
  const {
    mutate: createImageStable,
    data: imageDataStable,
    isLoading: ImageIsLoadingStable,
    isSuccess: imageStableSuccess,
    reset: resetStable,
  } = api.story.createImageStable.useMutation({
    onSuccess: (data) => {
      // void session.refetch();
      // const uri = `data:image/jpeg;base64,${data}`;
      // const stringifyData = JSON.stringify(data);
      console.log("SSSSSS", data.substring(0, 10));
      setImageUrlResult(data);
      setImageCloudinaryUrl(data);
      createFullStoryResult({
        title: title,
        text: userPromt,
        resultText: textResult,
        resultPrompt: promptForImage,
        resultImageUrl: data,
      });
      // uplaodImageToCloudinary({ image_url: data });
      console.log(
        "%c--------------------------------------------------------",
        "color: red"
      );
      console.log("type of data stable", typeof data);
      console.log("image from stable------------------00000---  ", data);
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
      setTitle(data);
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

  // const {
  //   mutate: uplaodImageToCloudinary,
  //   data: imageCloudinaryData,
  //   status: imageCloudinaryStatus,
  //   reset: imageCloudinaryReset,
  //   isLoading: cloudinaryIsLoading,
  //   isSuccess: imageIsSuccess,
  // } = api.story.uploadImageToCloudinary.useMutation({
  //   onSuccess(data: string) {
  //     console.log(";cloudinary result", data);
  //     setImageCloudinaryUrl(data);
  //     createFullStoryResult({
  //       title: title,
  //       text: userPromt,
  //       resultText: textResult,
  //       resultPrompt: promptForImage,
  //       resultImageUrl: data,
  //     });
  //   },
  //   onError: (error) => {
  //     const errorMessage = error.data?.zodError?.fieldErrors.content;
  //     if (errorMessage && errorMessage[0]) {
  //       toast({
  //         title: errorMessage[0],
  //         description: (
  //           <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //             <code className="text-white">
  //               {JSON.stringify(errorMessage, null, 2)}
  //             </code>
  //           </pre>
  //         ),
  //       });
  //       console.log("errorMessage", errorMessage[0]);
  //     } else {
  //       toast({
  //         title: "failed",
  //         description: (
  //           <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //             <code className="text-white">
  //               Failed to generate story , please try again,
  //             </code>
  //           </pre>
  //         ),
  //       });
  //       console.log("Failed to generate, please try again");
  //     }
  //   },
  // });

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
    // console.log("story", text);
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
    fullStoryReset();
    textReset();
    titleReset();
    resetStable();
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
    console.log("storyId", storyId);
    const obj = {
      storyId: storyId ?? "default-id",
    };
    setCurrenSession(obj);
    void selectedStoryRefetch();
    void fullStoryReset();
  };

  const handleCreateNewSession = () => {
    selectedStoryReset();
    textReset();
    titleReset();
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
            heading="Generate Story"
            text="Generate a Story with"
          />
          <section className="flex w-full gap-2 space-y-2 p-0   px-0 pb-2 pt-2   sm:px-0 md:pb-2 md:pt-4 lg:px-3 lg:py-2">
            <div className="lg:dark:hover: flex w-full flex-col-reverse items-start justify-between gap-6 rounded-md  px-0  sm:flex-col-reverse sm:px-0 md:flex-col-reverse  lg:flex-row  lg:gap-y-0 lg:rounded-md    lg:bg-white   lg:py-8   lg:shadow-sm  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none  lg:dark:hover:border-gray-700  lg:dark:hover:bg-gray-800  lg:dark:hover:text-white     lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-900">
              <div className="w-full sm:w-full md:w-full lg:w-3/4">
                <TextInputForm
                  inputType="area"
                  handleSubmitButton={handleStoryGenerateButton}
                  placeholder="Type or past a text here to generate a Story...."
                />
              </div>
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
            // ImageIsLoading ||
            ImageIsLoadingStable ||
            titleisLoading ||
            promptIsLoading) && (
            <section className="container space-y-2 bg-slate-50  py-6 dark:bg-transparent md:py-8 lg:py-14">
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className=" flex h-1/2 w-1/2 flex-col justify-center pl-4">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Please wait...
                  </h4>
                </div>
                <StorySteps
                  completedStep1={textIsSuccess}
                  completedStep2={!!dataTitle}
                  completedStep3={!!imageDataStable}
                />
              </div>
            </section>
          )}
          {/* {data && !isShowingPrevResults && (
            <>
              <Separator />
              <section className="container space-y-2 bg-slate-50  py-6 dark:bg-transparent md:py-8 lg:py-14">
                <StoryResultDiv
                  title={data.title}
                  resultText={data.resultText}
                  resultImageUrl={data.resultImageUrl}
                />
              </section>
            </>
          )} */}
          {data && imageDataStable && !isShowingPrevResults && (
            <>
              <Separator />
              <section className="container space-y-2 bg-slate-50  py-6 dark:bg-transparent md:py-8 lg:py-14">
                <StoryResultDiv
                  title={data.title}
                  resultText={data.resultText}
                  resultImageUrl={imageDataStable}
                />
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
