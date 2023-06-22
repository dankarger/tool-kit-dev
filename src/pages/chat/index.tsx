import React from "react";
import { type NextPage } from "next";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import Head from "next/head";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { ResponseSection } from "@/components/response-sections";
import { SessionsSection } from "@/components/sessions-section";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/spinner";
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

const ChatPage: NextPage = () => {
  const [promptValue, setPromptValue] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([
    { role: "", content: "" },
  ]);

  const [currentSession, setCurrenSession] = React.useState({
    id: DEFAULT_ID,
  });
  const user = useUser();

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

  const renameSession = api.session.renameSessionById.useMutation({
    async onSuccess() {
      await sessionRefetch();
    },
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
      // console.log(
      //   "Yes, I have access to props after I receive the response: " +
      //     JSON.stringify(sessionId)
      // );

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
        handleToastError(["Failed to create chat, please try again"]);
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

  const handleCreateNewChateMessage = (
    chatHistory: { role: string; content: string }[],
    value: string,
    currentSessionVariable: string
  ) => {
    mutate({
      latestMessage: value,
      messages: chatHistory,
      sessionId: currentSessionVariable,
    });
    setIsShowingPrevResults(false);
    void sessionRefetch();
    if (chatHistory.length === 1) {
      const newName = `${value.slice(0, 30)}...`;
      void renameSession.mutate({ id: currentSessionVariable, name: newName });
    }
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
    // setIsSessionActivated(true);

    const currentSessionMesages =
      sessionData?.filter((session) => session.id === currentSession.id) || [];
    if (currentSessionMesages[0] !== undefined) {
      if (
        currentSessionMesages &&
        currentSessionMesages[0]?.messages.length > 0
      ) {
        chatHistory = arrangeChatHistory(currentSessionMesages[0].messages);
      }
    }
    chatHistory.push(prompt);
    // console.log("chatHistory", chatHistory);
    setChatHistory(chatHistory);
    setPromptValue(value);
    if (currentSession.id === DEFAULT_ID) {
      void handleCreateNewSession();
      return;
    } else {
      handleCreateNewChateMessage(chatHistory, value, currentSession.id);
      void session.refetch();
      void sessionRefetch();
      return;
    }
  };

  const handleSelectSession = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const selectedSessionId = e.currentTarget.dataset?.valueid;
    const obj = {
      id: selectedSessionId ?? DEFAULT_ID,
    };
    setCurrenSession(obj);
    setIsShowingPrevResults(true);
    void session.refetch();
    void sessionRefetch();
  };

  const handleSelectSession2 = (sessionId: string) => {
    // console.log("sessionId", sessionId);
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
    // setIsDeleteDialogueOpen(false);
  };

  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="description" content="GPTool kit" />
        <link rel="icon" href="/fav.png" />
      </Head>
      <DashboardShell>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader heading="Chat" text="Have a Chat with ChatGPT." />
          <section className="flex w-full gap-2 space-y-2 p-0   px-0 pb-2 pt-2   sm:px-0 md:pb-2 md:pt-4 lg:px-3 lg:py-2">
            {" "}
            <div className="lg:dark:hover: flex w-full flex-col-reverse items-start justify-between gap-6 rounded-md  px-0  sm:flex-col-reverse sm:px-0 md:flex-col-reverse  lg:flex-row  lg:gap-y-0 lg:rounded-md    lg:bg-white   lg:py-8   lg:shadow-sm  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none  lg:dark:hover:border-gray-700  lg:dark:hover:bg-gray-800  lg:dark:hover:text-white     lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-900">
              <div className="w-full sm:w-full md:w-full lg:w-3/4">
                <TextInputForm
                  inputType="text"
                  placeholder={"Type your message here."}
                  handleSubmitButton={handleSubmitButton}
                  // className="flex-grow:1 flex-1"
                ></TextInputForm>
                {sessionSectionLoading && (
                  <div className=" w-full sm:w-full  md:w-full  lg:w-1/4 ">
                    <SessionsSection
                      sessions={[]}
                      onClick={handleSelectSession}
                      onSelect={handleSelectSession2}
                      onNewSession={handleCreateNewSession}
                      handleDeleteResult={handleDeleteResult}
                    />
                  </div>
                )}
              </div>
              {sessionData && (
                <div className=" w-full sm:w-full  md:w-full  lg:w-1/4 ">
                  <SessionsSection
                    sessions={sessionData}
                    onClick={handleSelectSession}
                    onSelect={handleSelectSession2}
                    onNewSession={handleCreateNewSession}
                    handleDeleteResult={handleDeleteResult}
                  />
                </div>
              )}
            </div>
          </section>
          <div className=" container relative flex max-w-[64rem] flex-col items-center gap-4 text-center">
            {isLoading && (
              <div className="flex w-full items-center justify-center">
                <LoadingSpinner size={90} />
              </div>
            )}
            {session.data && <ResponseSection messages={session.data} />}
          </div>
        </main>
      </DashboardShell>
    </>
  );
};

export default ChatPage;
