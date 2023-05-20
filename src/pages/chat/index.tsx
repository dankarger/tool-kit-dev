import React, { useEffect, useId } from "react";
import { type NextPage } from "next";
import type { Session, Response, ChatMessage } from "@/types";
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
  return <ResponseSection responses={data} />;
};

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
}) => {
  // const { data, isLoading, isError, refetch } =
  //   api.session.getChatSessionsByAuthorId.useQuery({
  //     authorId: authorId,
  //   });
  useEffect(() => {
    // refetch();
  }, [sessionData]);
  // if (!data) return null;
  // if (isLoading)
  //   return (
  //     <div>
  //       <LoadingSpinner />
  //     </div>
  //   );
  // if (isError) return <div>Error</div>;
  if (!sessionData) return null;
  return <SessionsSection sessions={sessionData} onClick={onClick} />;
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

  // const handleCreateNewSession = async () => {
  useEffect(() => {
    if (currentSession.id === "defaultId") {
      const currentTime = new Date().getTime();

      createNewSession.mutate({
        authorId: user.user?.id ?? "random3",
        name: `@${user.user?.username ?? "randomName"}-${currentTime}`,
      });

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
        role: "user",
        content: item.message,
      };
      const botMessage = {
        role: "bot",
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
  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="description" content="GPTool kit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardShell>
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <DashboardNav items={dashboardConfig.chat} />
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            <DashboardHeader heading="Chat" text="Have a Chat with ChatGPT." />

            <section className="space-y-6 px-3 pb-10 pt-6 md:pb-12 md:pt-10 lg:py-12"></section>
            <InputWithButton
              handleSubmitButton={handleSubmitButton}
              placeholder={"Type your message here."}
              buttonText={"Send"}
              // buttonVariant={buttonVariants.}
            />
            <div className="z-150  top-59 left-1  h-40 overflow-y-auto  ">
              {sessionData && (
                <SessionsSectionFeed
                  needRefresh={needRefresh}
                  authorId={user.user?.id ?? "anonimous"}
                  sessionData={sessionData}
                  onClick={handleSelectSession}
                />
              )}
            </div>
            <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-14">
              <div className=" container relative flex max-w-[64rem] flex-col items-center gap-4 text-center">
                {isLoading && (
                  <div className="flex w-full items-center justify-center">
                    <LoadingSpinner size={40} />
                  </div>
                )}
                {/* {data && (
                  <ResponseDiv
                    response={data.response}
                    message={data.message}
                  />
                )} */}
              </div>
              {currentSession.id !== "defaultId" && (
                <Sessionfeed id={currentSession.id} />
              )}
            </section>
          </main>
        </div>
      </DashboardShell>
    </>
  );
};

export default ChatPage;
