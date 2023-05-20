import React, { useEffect, useId } from "react";
import { type NextPage } from "next";
import type { Session } from "@/types";
import Head from "next/head";
import Link from "next/link";
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
import { set } from "mongoose";
// const ctx = api.useContext();

const Sessionfeed = ({ id }: { id: string }) => {
  const { data, isLoading, isError } =
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
}: {
  authorId: string;
  onClick: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  const { data, isLoading, isError } =
    api.session.getChatSessionsByAuthorId.useQuery({
      authorId: authorId,
    });
  if (!data) return null;
  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  if (isError) return <div>Error</div>;
  return <SessionsSection sessions={data} onClick={onClick} />;
};
const ChatPage: NextPage = () => {
  const [promptValue, setPromptValue] = React.useState("");
  const [chatResponce, setChatResponse] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([]);
  const [isSessionActivated, setIsSessionActivated] = React.useState(false);
  const [currentSession, setCurrenSession] = React.useState({
    id: "defaultId",
  });
  const router = useRouter();
  const user = useUser();
  const randomName = useId();

  const session = api.chat.getSessionMessagesBySessionId.useQuery({
    id: currentSession.id,
  });
  const createNewSession = api.session.createChatSession.useMutation({
    onSuccess: (data) => {
      console.log("dattttaaa", data);
      if (data?.id) {
        setCurrenSession({ id: data?.id });
      }
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

  // useEffect(() => {
  const handleCreateNewSession = () => {
    if (currentSession.id === "defaultId") {
      const currentTime = new Date().getTime();

      createNewSession.mutate({
        authorId: user.user?.id ?? "random3",
        name: `@${user.user?.username ?? "randomName"}-${currentTime}`,
      });
      // setCurrenSession({ id:newSession ?? "default-session" });
      session.refetch();
    }
    session.refetch();
  };
  // }, []);
  useEffect(() => {
    if (isSessionActivated) {
      handleCreateNewSession();
      // session.refetch();
    }
  }, [isSessionActivated, currentSession.id]);

  const handleCreateNewChateMessage = (value: string) => {
    mutate({
      message: value,
      sessionId: currentSession.id,
    });
  };

  const handleSubmitButton = async (value: string) => {
    setPromptValue(value);
    if (!user.user?.id) {
      return toast.error("Please login to continue");
    }
    setIsSessionActivated(true);
    const newSession = handleCreateNewSession();

    // if (currentSession.id === "random2") {
    //   createNewSession.mutate({ authorId: user.user.id });
    //   console.log("hi");
    //   // handleSubmitButton(value);
    // }

    handleCreateNewChateMessage(value);
    session.refetch();
  };
  const handleSelectSession = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSessionId = e.target.dataset.valueid;
    // if (e.target.value === "random2") {
    //   createNewSession.mutate({ authorId: user.user.id });
    console.log("hi", selectedSessionId);
    //   // handleSubmitButton(value);
    // }
    setCurrenSession({ id: selectedSessionId ?? "default-session" });
    // console.log("currentSession", currentSession);
    // handleCreateNewChateMessage(value);
    // setCurrenSession({ id: e.target.value });
    session.refetch();
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
              // value={promptValue}
              handleSubmitButton={handleSubmitButton}
              placeholder={"Type your message here."}
              buttonText={"Send"}
              // buttonVariant={buttonVariants.}
            />
            <div className="z-150  top-59 left-1  h-40 overflow-y-auto  ">
              <SessionsSectionFeed
                authorId={user.user?.id ?? "anonimous"}
                onClick={handleSelectSession}
              />
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
              {/* {session.data && <ResponseSection responses={session.data} />} */}
              {/* {user.user?.id && <Sessionfeed id={user.user.id} />} */}
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
