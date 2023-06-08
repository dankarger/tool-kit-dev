import React, { use, useEffect, useId } from "react";
import { type NextPage } from "next";
import type {
  Session,
  Response,
  ChatMessage,
  StoryResult,
  TranslationResultType,
} from "@/types";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import Head from "next/head";
import { dashboardConfig } from "@/config/dashboard";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { DashboardNav } from "@/components/nav";
import { InputWithButton } from "@/components/input-with-button";
import { ResponseDiv } from "@/components/response-div";
import { ResponseSection } from "@/components/response-sections";
import { SessionsSection } from "@/components/sessions-section";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { TextInputForm } from "@/components/text-input-form";
import { toast } from "@/components/ui/use-toast";
const DEFAULT_ID = "defaultId";

const handleToastError = (errorMessage: string[]) => {
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
};

const Sessionfeed = ({ id }: { id: string }) => {
  const { data, isLoading, isError, refetch } =
    api.chat.getSessionMessagesBySessionId.useQuery({
      id: id,
    });
  if (!data) return null;
  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  if (isError) return <div>Error</div>;
  return <ResponseSection messages={data} />;
};

const ChatPage: NextPage = () => {
  const [promptValue, setPromptValue] = React.useState("");
  const [chatResponce, setChatResponse] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([
    { role: "", content: "" },
  ]);
  const [isSessionActivated, setIsSessionActivated] = React.useState(false);
  const [needRefresh, setNeedRefresh] = React.useState(false);
  const [currentSession, setCurrenSession] = React.useState({
    id: DEFAULT_ID,
  });
  const router = useRouter();
  const [isDeleteDialogueOpen, setIsDeleteDialogueOpen] = React.useState(false);
  const user = useUser();
  const randomName = useId();
  const ctx = api.useContext();

  const [isShowingPrevResults, setIsShowingPrevResults] = React.useState(false);

  const session = api.chat.getSessionMessagesBySessionId.useQuery(
    {
      id: currentSession.id,
    },
    { trpc: { abortOnUnmount: true } } // maybe
  );

  const {
    data: sessionData,
    isLoading: sessionSectionLoading,
    refetch: sessionRefetch,
    isSuccess,
  } = api.session.getChatSessionsByAuthorId.useQuery({
    authorId: user.user?.id ?? "random3",
  });
  const deleteResult = api.chat.deleteResult.useMutation({
    async onSuccess() {
      toast({
        title: "Deleted 1 Result",
      });
      await sessionRefetch();
    },
  });

  const createNewSession = api.session.createChatSession.useMutation({
    onSuccess: (data) => {
      console.log("dattttaaa", data);
      if (currentSession.id === DEFAULT_ID) {
        handleCreateNewChateMessage(chatHistory, promptValue, data);
      }
      const currenId = { id: data };
      setCurrenSession(currenId);
      void session.refetch();
      void sessionRefetch();
      return data;
    },
    onSettled: (sessionId, arg2NotUsed, data) => {
      setCurrenSession({ id: sessionId ?? DEFAULT_ID });
      console.log(
        "Yes, I have access to props after I receive the response: " +
          JSON.stringify(sessionId)
      );

      // handleCreateNewChateMessage(chatHistory, promptValue);
      void session.refetch();
      void sessionRefetch();
      return sessionId;
    },
    // errorHandler
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        handleToastError(errorMessage);
      } else {
        handleToastError(["Failed to create translation, please try again"]);
      }
    },
  });
  const { mutate, isLoading, data } = api.chat.create.useMutation({
    onSuccess: (data) => {
      setPromptValue("");
      void session.refetch();
    },
    // errorHandler

    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        handleToastError(errorMessage);
      } else {
        handleToastError(["Failed to create translation, please try again"]);
      }
    },
  });

  const handleCreateNewSession = () => {
    if (!user.user?.id) {
      // errorHandler

      handleToastError(["You need to be logged in to create a new session"]);
      return;
    }
    const currentTime = new Date();
    const currentDate = currentTime.toISOString();
    const time = ` ${currentDate}`;
    const username = user.user?.username || "user";
    const sessionName = `${username}]: ${time}`;
    createNewSession.mutate({
      authorId: user.user.id,
      name: sessionName,
      title: sessionName,
    });
    setIsShowingPrevResults(false);
  };

  // useEffect(() => {
  //   if (currentSession.id === DEFAULT_ID) {
  //     handleCreateNewSession();
  //   }
  //   // setNeedRefresh(true);
  //   void ctx.session.getChatSessionsByAuthorId.invalidate();
  //   void session.refetch();
  //   void sessionRefetch();
  // }, []);

  // useEffect(() => {
  //   if (currentSession.id === DEFAULT_ID) {
  //     handleCreateNewSession();
  //     void session.refetch();
  //     void sessionRefetch();
  //   }
  //   void session.refetch();
  //   void sessionRefetch();
  // }, [isSessionActivated, currentSession.id]);

  // useEffect(() => {
  //   console.log("currentSession", currentSession);
  // }, [isSessionActivated]);

  // const handleUserStartTyping = () => {
  //   console.log("fdfdfdfdfdf");
  //   if (currentSession.id === DEFAULT_ID) {
  //     console.log("currentSession");
  //     handleCreateNewSession();
  //     return;
  //   }
  //   return;
  // };

  // // useEffect(() => {
  //   window.addEventListener("keypress", handleUserStartTyping);

  //   return () => {
  //     window.removeEventListener("keypress", handleUserStartTyping);
  //   };
  // }, []);

  const handleCreateNewChateMessage = (
    chatHistory: { role: string; content: string }[],
    value: string,
    currentSessionVariable: string
  ) => {
    // console.log("sessionData", sessionData);
    // setTimeout(() => {
    // if (currentSession.id === DEFAULT_ID) {
    //   alert("d");
    //   return;
    // }
    mutate({
      latestMessage: value,
      messages: chatHistory,
      sessionId: currentSessionVariable,
    });
    // }, 1000);
    setIsShowingPrevResults(false);
    void sessionRefetch();
  };

  const arrangeChatHistory = (
    data: { message: string; response: string }[]
  ) => {
    if (!data) return [];
    // let chatHistory;
    const chatHistory = data.map((item) => {
      // messages: [{ role: "user", content: input.message }],
      const userMessage = {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: item.message,
      };
      const botMessage = {
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: item.response,
      };
      // chatHistory.push(userMessage);
      // chatHistory.push(botMessage);
      return [{ ...userMessage }, { ...botMessage }];
    });
    const result = chatHistory.flat();

    console.log("chatHistory", result);
    return result;
  };

  const handleSubmitButton = (value: string) => {
    const prompt = { role: "user", content: value };

    let chatHistory: { role: string; content: string }[] = [];
    setIsShowingPrevResults(false);
    setPromptValue(value);
    if (!user.user?.id) {
      return handleToastError(["Please login to continue"]);
    }
    setIsSessionActivated(true);
    // console.log(
    //   "sessionData2323232",
    //   sessionData?.filter((session) => session.id === currentSession.id)
    // );
    const currentSessionMesages =
      sessionData?.filter((session) => session.id === currentSession.id) || [];
    if (currentSessionMesages[0] !== undefined) {
      if (
        currentSessionMesages &&
        currentSessionMesages[0]?.messages.length > 0
      ) {
        chatHistory = arrangeChatHistory(currentSessionMesages[0].messages);
        // console.log(
        //   "currentSessionMesages-----222---",
        //   currentSessionMesages[0]?.messages
        // );
      }
    }

    // if (currentSession.id === DEFAULT_ID) alert("fffffffff");

    chatHistory.push(prompt);
    console.log("chatHistory", chatHistory);

    // handleCreateNewSession();
    // setTimeout(() => {
    setChatHistory(chatHistory);
    setPromptValue(value);
    if (currentSession.id === DEFAULT_ID) {
      void handleCreateNewSession();
      console.log("wwf");
      return;
    } else {
      handleCreateNewChateMessage(chatHistory, value, currentSession.id);
      void session.refetch();
      void sessionRefetch();
      return;
    }
    // return message;
    // }, 5000);
  };
  const handleSelectSession = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const selectedSessionId = e.currentTarget.dataset?.valueid;
    console.log("hi", selectedSessionId);
    const obj = {
      id: selectedSessionId ?? DEFAULT_ID,
    };
    setCurrenSession(obj);
    setIsShowingPrevResults(true);
    void session.refetch();
    void sessionRefetch();
  };
  // const handleNewSessionButton = () => {
  //   setCurrenSession({ id: DEFAULT_ID });
  //   setIsSessionActivated(true);

  //   void session.refetch();
  //   void sessionRefetch();
  // };

  const handleSelectSession2 = (sessionId: string) => {
    console.log("sessionId", sessionId);
    const obj = {
      id: sessionId ?? DEFAULT_ID,
    };
    setCurrenSession(obj);
    void session.refetch();
    setIsShowingPrevResults(true);
    // ctx.chat.getSessionMessagesBySessionId.invalidate();
    void sessionRefetch();
  };

  const handleDeleteResult = (id: string) => {
    void deleteResult.mutate({
      id: id,
    });
    void sessionRefetch();
    setIsDeleteDialogueOpen(false);
  };

  const handleDialogueOpen = (id: string) => {
    setIsDeleteDialogueOpen(true);
  };

  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="description" content="GPTool kit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardShell>
        <main className="flex w-full flex-1 flex-col gap-2 overflow-hidden">
          <DashboardHeader heading="Chat" text="Have a Chat with ChatGPT." />
          <section className=" items-top flex-col justify-center space-y-2 px-3 pb-10 pt-2 md:pb-2 md:pt-4 lg:py-12">
            {/* <div className="flex  w-full  flex-row justify-between "> */}
            <div className="lg:dark:hover: flex h-full w-full  flex-col items-start justify-start rounded-md p-4 align-middle lg:flex-row  lg:flex-wrap lg:items-center  lg:justify-between  lg:gap-x-4  lg:gap-y-0 lg:rounded-md  lg:border lg:border-gray-200  lg:bg-white   lg:px-3 lg:py-8  lg:align-middle  lg:shadow-sm  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none  lg:dark:hover:border-gray-700  lg:dark:hover:bg-gray-800  lg:dark:hover:text-white     lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-400">
              <TextInputForm
                inputType="text"
                placeholder={"Type your message here."}
                handleSubmitButton={handleSubmitButton}
                className="flex-grow:1 flex-1"
              ></TextInputForm>
              {sessionSectionLoading && (
                <div className=" flex w-1/3   flex-col items-end justify-center   ">
                  <SessionsSection
                    sessions={[]}
                    onClick={handleSelectSession}
                    onSelect={handleSelectSession2}
                    onNewSession={handleCreateNewSession}
                    handleDeleteResult={handleDialogueOpen}
                  />
                </div>
              )}
              {sessionData && (
                <div className=" flex w-1/3   flex-col items-end justify-center   ">
                  <SessionsSection
                    sessions={sessionData}
                    onClick={handleSelectSession}
                    onSelect={handleSelectSession2}
                    onNewSession={handleCreateNewSession}
                    handleDeleteResult={handleDialogueOpen}
                  />
                </div>
              )}
            </div>
            {/* <DeleteDialogue
              onDelete={handleDeleteResult}
              isOpen={isDeleteDialogueOpen}
            /> */}
          </section>
          <div className=" container relative flex max-w-[64rem] flex-col items-center gap-4 text-center">
            {isLoading && (
              <div className="flex w-full items-center justify-center">
                <LoadingSpinner size={40} />
              </div>
            )}
            {session.data && <ResponseSection messages={session.data} />}
          </div>
          {/* {isShowingPrevResults && currentSession.id !== DEFAULT_ID && (
            // {sessionData && currentSession.id !== DEFAULT_ID && (
            <Sessionfeed id={currentSession.id} />
          )} */}
          {/* {data &&
            // !isShowingPrevResults &&
            currentSession.id !== DEFAULT_ID && (
              // {data && (
              <div>
                <Sessionfeed id={currentSession.id} />
              </div>
            )} */}
        </main>
        {/* </div> */}
      </DashboardShell>
    </>
  );
};

export default ChatPage;
