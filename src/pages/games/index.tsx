import React, { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { SessionsSection } from "@/components/sessions-section";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { DashboardNav } from "@/components/nav";
import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";
import { toast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TicTacToeBoard } from "@/components/TicTacToeBoard";
import { object } from "zod";

const DEFAULT_ID = "defaultId";
// const INITIALBOARD = Array(3).fill(Array(3).fill("_"));
const INITIALBOARD = [
  ["_", "_", "_"],
  ["_", "_", "_"],
  ["_", "_", "_"],
];
console.log("111", INITIALBOARD);
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
      const updatedGameState = data?.split(",");
      const formatedUpdatedGameState = [] as typeof INITIALBOARD;
      for (let i = 0; i < 9; i += 3) {
        const chunk = updatedGameState?.slice(i, i + 3);
        if (chunk) formatedUpdatedGameState.push(chunk);
      }

      setGameState(formatedUpdatedGameState);
      console.log("updatedGameState", formatedUpdatedGameState);
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
    // void makePlay.mutate({
    //   board: [
    //     ["X", "_", "_"],
    //     ["_", "O", "_"],
    //     ["_", "_", "X"],
    //   ],
    // });
    void makePlay.mutate({
      board: gameState,
    });
  };

  // const deleteResult = api.translate.deleteResult.useMutation({
  //   async onSuccess() {
  //     toast({
  //       title: "Deleted 1 Result",
  //       // description: (
  //       //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //       //     <code className="text-white">
  //       //       Failed to summarize , please try again{" "}
  //       //     </code>
  //       //   </pre>
  //       // ),
  //     });
  //     await sessionRefetch();
  //   },
  // });
  const handleNewGame = () => {
    console.log("ffffff");
    setGameState(INITIALBOARD);
    setGameOver(false);
    setTurnNumber(0);
    setPlayerTurn(false);
  };
  React.useEffect(() => {
    console.log("refresh");
  }, [turnNumber]);

  const handleSelectCell = (cellNumber: [arg0: number, arg1: number]) => {
    console.log("ccc", cellNumber);
    // if(typeof cellNumber===undefined) return
    const currentGameBoard: string[][] = [...gameState] || INITIALBOARD;
    const [cell, row] = cellNumber;
    // const cell = cellNumber[0]
    console.log(currentGameBoard[row]);
    console.log(typeof currentGameBoard, "cell");
    if (!currentGameBoard) return;
    // if (typeof currentGameBoard === typeof INITIALBOARD)
    const currentRow = currentGameBoard[row] || [["_"], ["_"], ["_"]];
    const currentcell = (currentRow[cell] = "X");
    // const currentGameBoard
    console.log("2222222", currentGameBoard);
    // currentGameBoard[row][cell] = "X";
    console.log("currentGameBoard", typeof INITIALBOARD);
    setGameState(currentGameBoard);
    handleRequestMove();
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

          <section className="flex w-full flex-col gap-2 space-y-2 p-0  px-0 pb-2 pt-2   sm:px-0 md:pb-2 md:pt-4 lg:px-3 lg:py-2">
            <div className="p-4">
              {/* <TicTacToeBoard
                board={gameState}
                turnNumber={turnNumber}
                handleNewGame={handleNewGame}
                handleSelectCell={handleSelectCell}
              /> */}
              <h1>Comming soon...</h1>
            </div>
          </section>
        </main>
      </DashboardShell>
    </>
  );
};

export default GamesPage;
