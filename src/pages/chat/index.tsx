import React, { useEffect } from "react";
import { type NextPage } from "next";
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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { set } from "mongoose";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// const ctx = api.useContext();

const Sessionfeed = ({ id }: { id: string }) => {
  // const ctx = api.useContext();
  // const user = useUser();
  // if (!user) return null;
  // const userId = user.user?.id;
  // console.log("userId", userId);
  // if (!user.user?.id) return null;
  // console.log("user", user.user?.id);
  const { data, isLoading, isError } =
    // api.chat.getAllChatMessagesByAuthorId.useQuery({
    //   authorId: id,
    // });
    api.chat.getSessionMessagesBySessionId.useQuery({
      id: id,
    });
  if (!data) return null;
  if (isLoading) return <div>Loading</div>;
  return <ResponseSection responses={data} />;
  // return <div>seesssison</div>;
};
const ChatPage: NextPage = () => {
  const [promptValue, setPromptValue] = React.useState("");
  const [chatResponce, setChatResponse] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([]);

  const [currentSession, setCurrenSession] = React.useState({ id: "random2" });
  const router = useRouter();
  const user = useUser();
  // const session = api.chat.getAllChatMessagesByAuthorId.useQuery({
  //   authorId: "user_2PyMrNlCa1UWxngPWVC6NTTkyxC",
  // });
  const session = api.chat.getSessionMessagesBySessionId.useQuery({
    id: currentSession.id,
  });
  console.log("session", session);
  const createNewSession = api.session.createChatSession.useMutation({
    onSuccess: (data) => {
      // setPromptValue("");
      // void ctx.chat.getAll.invalidate();
      // router.refresh();
      console.log("success", data);
      if (data?.id) {
        setCurrenSession({ id: data?.id });
      }
      // setCurrenSession({ id: data?.id || {id:""} });
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
        // console.log("errorMessage", errorMessage[0]);
      } else {
        toast.error("Failed to create session, please try again");
        // console.log("Failed to create post, please try again");
      }
    },
  });
  // const {data : sessionData, isLoading: sessionLoading, isError: sessionError} = api.chat.getAllChatMessagesByAuthorId.useQuery({authorId: "user_2PyMrNlCa1UWxngPWVC6NTTkyxC"})
  const { mutate, isLoading, data } = api.chat.create.useMutation({
    onSuccess: () => {
      setPromptValue("");
      // void ctx.chat.getAll.invalidate();
      // router.refresh();
      session.refetch();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
        // console.log("errorMessage", errorMessage[0]);
      } else {
        toast.error("Failed to create chat, please try again");
        // console.log("Failed to create post, please try again");
      }
    },
  });

  useEffect(() => {
    if (currentSession.id === "random2") {
      createNewSession.mutate({ authorId: user.user?.id ?? "random3" });
      console.log("hi");
      session.refetch();
      // handleSubmitButton(value);
    }
  }, []);

  const handleCreateNewChateMessage = (value: string) => {
    mutate({
      message: value,
      sessionId: currentSession.id,
    });
  };

  const handleSubmitButton = async (value: string) => {
    setPromptValue(value);
    console.log("value", value);
    if (!user.user?.id) {
      return toast.error("Please login to continue");
    }
    // if (currentSession.id === "random2") {
    //   createNewSession.mutate({ authorId: user.user.id });
    //   console.log("hi");
    //   // handleSubmitButton(value);
    // }

    console.log("currentSession", currentSession);
    // const sessionId = currentSession "test";
    // mutate({
    //   message: value,
    //   sessionId: currentSession.id,
    // });
    setTimeout(() => {
      console.log("s------------------------------------", currentSession);
      handleCreateNewChateMessage(value);
    }, 200);
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
            <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-14">
              <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                {isLoading && <p>Loading...</p>}
                {/* {data && (
                  <ResponseDiv
                    response={data.response}
                    message={data.message}
                  />
                )} */}
              </div>
              {/* {session.data && <ResponseSection responses={session.data} />} */}
              {/* {user.user?.id && <Sessionfeed id={user.user.id} />} */}
              {currentSession.id !== "random2" && (
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
