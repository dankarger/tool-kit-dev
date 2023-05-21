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
import { InputWithButton } from "@/components/input-with-button";
import { ResponseDiv } from "@/components/response-div";
import { ResponseSection } from "@/components/response-sections";
import { SessionsSection } from "@/components/sessions-section";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { TranslateSection } from "@/components/translate-section";

const SessionsSectionFeed = ({
  authorId,
  onClick,
  needRefresh,
  sessionData,
}: {
  sessionData: Session[];
  needRefresh: boolean;
  authorId: string;
  onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}): JSX.Element => {
  if (!sessionData) return <></>;
  return <SessionsSection sessions={sessionData} onClick={onClick} />;
};

const TranslatePage: NextPage = () => {
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
    });
  };

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
  return (
    <>
      <Head>
        <title>Translate</title>
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
              heading="Translate"
              text="Translate a text with GPTool."
            />
            <section className="  space-y-1  pb-4 md:pb-2 md:pt-2 lg:py-2"></section>
            1
            <section className="space-y-2 px-3 pb-10 pt-2 md:pb-2 md:pt-4 lg:py-12">
              <TranslateSection />
            </section>
            <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-14">
              <div className=" container relative flex max-w-[64rem] flex-col items-center gap-4 text-center">
                3
                {isLoading && (
                  <div className="flex w-full items-center justify-center">
                    <LoadingSpinner size={40} />
                  </div>
                )}
                {data && (
                  <ResponseDiv
                    response={data.response}
                    message={data.message}
                  />
                )}
              </div>
            </section>
          </main>
        </div>
      </DashboardShell>
    </>
  );
};

export default TranslatePage;
