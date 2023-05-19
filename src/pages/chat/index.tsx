import React from "react";

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
import toast from "react-hot-toast";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// const ctx = api.useContext();

const ChatPage: NextPage = () => {
  const [promptValue, setPromptValue] = React.useState("");
  const [chatResponce, setChatResponse] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([]);
  // const res = api.chat.sendPrompt.useQuery({ prompt: promptValue });

  const { mutate, isLoading, data } = api.chat.create.useMutation({
    onSuccess: () => {
      setPromptValue("");
      // void ctx.chat.getAll.invalidate();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
        // console.log("errorMessage", errorMessage[0]);
      } else {
        toast.error("Failed to create post, please try again");
        // console.log("Failed to create post, please try again");
      }
    },
  });

  const handleSubmitButton = (value: string) => {
    setPromptValue(value);
    console.log("value", value);

    mutate({
      message: value,
    });
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
                {data && <ResponseDiv text={data.response ?? ""} />}
              </div>
            </section>
          </main>
        </div>
      </DashboardShell>
    </>
  );
};

export default ChatPage;
