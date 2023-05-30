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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { TextInputForm } from "@/components/text-input-form";

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
  const [chatHistory, setChatHistory] = React.useState([]);
  const [isSessionActivated, setIsSessionActivated] = React.useState(false);
  const [needRefresh, setNeedRefresh] = React.useState(false);
  const [currentSession, setCurrenSession] = React.useState({
    id: "defaultId",
  });
  const router = useRouter();
  const user = useUser();
  const randomName = useId();
  const ctx = api.useContext();

  const session = api.chat.getSessionMessagesBySessionId.useQuery({
    id: currentSession.id,
  });

  const {
    data: sessionData,
    isLoading: sessionSectionLoading,
    refetch: sessionRefetch,
    isSuccess,
  } = api.session.getChatSessionsByAuthorId.useQuery({
    authorId: user.user?.id ?? "random3",
  });

  const createNewSession = api.session.createChatSession.useMutation({
    // mutationFn:
    onSuccess: (data) => {
      console.log("dattttaaa", data);
      // if (data?.id) {
      const currenId = { id: data.id };
      setCurrenSession((prev) => currenId);
      void session.refetch();
      void sessionRefetch();
      setNeedRefresh(true);
      // }
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to create session, please try again");
      }
    },
  });
  const { mutate, isLoading, data } = api.chat.create.useMutation({
    onSuccess: () => {
      setPromptValue("");
      void session.refetch();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
        console.log("errorMessage", errorMessage[0]);
      } else {
        toast.error("Failed to create chat, please try again");
        console.log("Failed to create post, please try again");
      }
    },
  });

  const handleCreateNewSession = () => {
    if (!user.user?.id) {
      toast.error("Please login to create a new session");
      return;
    }
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentSeconds = currentTime.getSeconds();
    const time = `${currentHour} - ${currentMinute}-  ${currentSeconds}`;
    const username = user.user?.username || "user";
    const sessionName = `@ ${username} ${time}`;
    createNewSession.mutate({
      authorId: user.user.id,
      name: sessionName,
      title: sessionName,
    });
  };

  useEffect(() => {
    if (currentSession.id === "defaultId") {
      // const currentTime = new Date();
      // const currentHour = currentTime.getHours();
      // const currentMinute = currentTime.getMinutes();

      // const currentSeconds = currentTime.getSeconds();
      // const time = `${currentHour}:${currentMinute}:${currentSeconds}`;
      // createNewSession.mutate({
      //   authorId: user.user?.id ?? "random3",
      //   name: `@${user.user?.username}-${time}`,
      // });
      handleCreateNewSession();
      // setCurrenSession({ id: data?.id ?? "default-session" });
      // session.refetch();
    }
    setNeedRefresh(true);
    void ctx.session.getChatSessionsByAuthorId.invalidate();
    void session.refetch();
    void sessionRefetch();
  }, []);
  // };
  useEffect(() => {
    if (isSessionActivated && currentSession.id === "defaultId") {
      // handleCreateNewSession();
      void session.refetch();
      void sessionRefetch();
    }
    void session.refetch();
    void sessionRefetch();
  }, [isSessionActivated, currentSession.id]);

  useEffect(() => {
    console.log("currentSession", currentSession);
  }, [isSessionActivated]);

  const handleCreateNewChateMessage = (
    chatHistory: { role: string; content: string }[],
    value: string
  ) => {
    void sessionRefetch();
    console.log("sessionData", sessionData);
    mutate({
      latestMessage: value,
      messages: chatHistory,
      sessionId: currentSession.id,
    });
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
    let chatHistory: string | { role: string; content: string }[] = [];
    setPromptValue(value);
    if (!user.user?.id) {
      return toast.error("Please login to continue");
    }
    setIsSessionActivated(true);
    console.log(
      "sessionData2323232",
      sessionData?.filter((session) => session.id === currentSession.id)
    );
    const currentSessionMesages =
      sessionData?.filter((session) => session.id === currentSession.id) || [];
    if (currentSessionMesages[0] !== undefined) {
      if (
        currentSessionMesages &&
        currentSessionMesages[0]?.messages.length > 0
      ) {
        chatHistory = arrangeChatHistory(currentSessionMesages[0].messages);
        console.log(
          "currentSessionMesages-----222---",
          currentSessionMesages[0]?.messages
        );
      }
    }

    const prompt = { role: "user", content: value };

    chatHistory.push(prompt);
    console.log("prompt", prompt);
    const message = handleCreateNewChateMessage(chatHistory, value);
    void session.refetch();
    return message;
  };
  const handleSelectSession = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const selectedSessionId = e.currentTarget.dataset?.valueid;
    console.log("hi", selectedSessionId);
    const obj = {
      id: selectedSessionId ?? "default-session",
    };
    setCurrenSession((prev) => obj);
    void session.refetch();
  };
  const handleNewSessionButton = () => {
    // setCurrenSession({ id: "defaultId" });
    setIsSessionActivated(true);

    void session.refetch();
    void sessionRefetch();
  };

  const handleSelectSession2 = (sessionId: string) => {
    console.log("sessionId", sessionId);
    const obj = {
      id: sessionId ?? "default-session",
    };
    setCurrenSession((prev) => obj);
    void session.refetch();
  };
  // const handleSelectSession3 = (
  //   option
  // ): Session | StoryResult | TranslationResultType => {
  //   console.log("optionId", option.id);
  //   // const obj = {
  //   //   id: sessionId ?? "default-session",
  //   // };
  //   setCurrenSession((prev) => option);
  //   void session.refetch();
  // };
  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="description" content="GPTool kit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardShell>
        {/* <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <DashboardNav items={dashboardConfig.chat} />
          </aside> */}
        <main className="flex w-full flex-1 flex-col gap-2 overflow-hidden">
          <DashboardHeader heading="Chat" text="Have a Chat with ChatGPT." />
          <section className=" items-top flex-col justify-center space-y-2 px-3 pb-10 pt-2 md:pb-2 md:pt-4 lg:py-12">
            <div className="flex  w-full  flex-row justify-between ">
              <TextInputForm
                inputType="text"
                placeholder={"Type your message here."}
                handleSubmitButton={handleSubmitButton}
                className="flex-grow:1 flex-1"
              ></TextInputForm>
              {sessionData && (
                <div className=" flex w-1/3   flex-col items-end justify-center   ">
                  <SessionsSection
                    sessions={sessionData}
                    onClick={handleSelectSession}
                    onSelect={handleSelectSession2}
                    onNewSession={handleCreateNewSession}
                  />
                </div>
              )}
            </div>
          </section>
          <div className=" container relative flex max-w-[64rem] flex-col items-center gap-4 text-center">
            {isLoading && (
              <div className="flex w-full items-center justify-center">
                <LoadingSpinner size={40} />
              </div>
            )}
            {/* {data && (
                <ResponseDiv response={data.response} message={data.message} />
              )} */}
          </div>
          {currentSession.id !== "defaultId" && (
            <Sessionfeed id={currentSession.id} />
          )}
          {/* </section> */}
        </main>
        {/* </div> */}
      </DashboardShell>
    </>
  );
};

export default ChatPage;
