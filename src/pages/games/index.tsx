import React, { useState } from "react";
import { type NextPage } from "next";
import type { TranslationResultType } from "@/types";
import Head from "next/head";
import { SessionsSection } from "@/components/sessions-section";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { DashboardNav } from "@/components/nav";
import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";
import { toast } from "@/components/ui/use-toast";
import { TranslateSection } from "@/components/translate-section";
import { TranslationResultComponent } from "@/components/translation-result";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const DEFAULT_ID = "defaultId";
const INITIALBOARD = Array(9).fill("empty");

// const gameBoard = new Array(9);
// let gameStateArr = Array(9).fill("empty");

const COLORS = {
  primary: "#29527c",
  secondary: "#7e7272",
  history: "rgba(41,82,124,0.62)",
};

const GamesPage: NextPage = () => {
  const [currentSession, setCurrenSession] = React.useState({
    id: DEFAULT_ID,
  });
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [userMove, setUserMove] = useState("");
  const [botResponse, setBotresponse] = useState("");
  const [winner, setWinner] = useState("");
  const [gameState, setGameState] = useState(INITIALBOARD);
  const [gameHistory, setGameHistory] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [humanPlayer, setHumanPlayer] = useState("X");
  const [aiPlayer, setAiPlayer] = useState("O");

  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [turnNumber, setTurnNumber] = useState(0);

  const [isShowingPrevResults, setIsShowingPrevResults] = useState(false);
  const user = useUser();

  // function getWinner() {
  //   const winConditions = [
  //     [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal rows
  //     [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical columns
  //     [0, 4, 8], [2, 4, 6], // diagonals
  //   ];
  //   for (const condition of winConditions) {
  //     const [a, b, c] = condition;
  //     if (gameState[a] !== 'empty' && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
  //       return gameState[a];
  //     }
  //   }
  //   return null;
  const makePlay = api.games.playTicTacToe.useMutation({
    onSuccess(data) {
      console.log("play", data);
    },
  });
  const {
    data: sessionData,
    isLoading: sessionSectionLoading,
    refetch: sessionRefetch,
    isSuccess,
  } = api.translate.getAllTranslationsByAuthorId.useQuery({
    authorId: user.user?.id || DEFAULT_ID,
  });

  const handleRequestMove = () => {
    void makePlay.mutate({
      board: [
        ["X", "_", "_"],
        ["_", "O", "_"],
        ["_", "_", "X"],
      ],
    });
  };

  const deleteResult = api.translate.deleteResult.useMutation({
    async onSuccess() {
      toast({
        title: "Deleted 1 Result",
        // description: (
        //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //     <code className="text-white">
        //       Failed to summarize , please try again{" "}
        //     </code>
        //   </pre>
        // ),
      });
      await sessionRefetch();
    },
  });
  const handleNewGame = () => {
    setGameState(INITIALBOARD);
    setGameOver(false);
    setTurnNumber(0);
    setPlayerTurn(false);
  };
  return (
    <>
      <Head>
        <title>Translate</title>
        <meta name="description" content="GPTool kit" />
        <link rel="icon" href="/fav.png" />{" "}
      </Head>
      <DashboardShell>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader
            heading="Tic Tac Toe"
            text="Play Games with the GPTools."
          />

          <section className="flex w-full gap-2 space-y-2 p-0   px-0 pb-2 pt-2   sm:px-0 md:pb-2 md:pt-4 lg:px-3 lg:py-2">
            <div>Board</div>
            <Button onClick={handleNewGame}>New Game</Button>
            <Button onClick={handleRequestMove}>Play</Button>
          </section>
        </main>
      </DashboardShell>
    </>
  );
};

export default GamesPage;
