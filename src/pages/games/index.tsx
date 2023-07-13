import React, { useState, useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { SessionsSection } from "@/components/sessions-section";
import { api } from "@/utils/api";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { useUser } from "@clerk/nextjs";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { TicTacToeBoard } from "@/components/TicTacToeBoard";

const DEFAULT_ID = "defaultId";
// const INITIALBOARD = Array(3).fill(Array(3).fill("_"));
type cellOption = "_" | "X" | "O";
type Board = cellOption[][];
const INITIALBOARD: Board = [
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
  const [currentSession, setCurrenSession] = useState({
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

  function getWinner(gameState: Board) {
    const winConditions: [number, number][][] = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ], // first row
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ], // second row
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ], // third row
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ], // first column
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ], // second column
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ], // third column
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ], // left to right diagonal
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ], // right to left diagonal
    ];
    // if (!gameState == undefined || typeof gameState !== "object") return null;
    for (const condition of winConditions) {
      if (!condition[0] || !condition[1] || !condition[3]) return null;
      const [[x1, y1], [x2, y2], [x3, y3]] = condition;
      // if (!x1 || !x2 || !x3 || !y1 || !y2 || !y3) return null;

      if (
        gameState[x1]?.[y1] !== undefined &&
        gameState[x1]?.[y1] !== "_" &&
        gameState[x1]?.[y1] === gameState[x2]?.[y2] &&
        gameState[x1]?.[y1] === gameState[x3]?.[y3]
      ) {
        console.log("wiin");
        return gameState[x1]?.[y1] === "X" ? "You are the Winner" : "You lost";
      }
    }
    console.log("no   -- - -  -wiin");
    return null;
  }
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
  useEffect(() => {
    console.log(getWinner(gameState));
  }, [turnNumber, gameState]);

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
  // console.log(getWinner(gameState));
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
              <TicTacToeBoard
                board={gameState}
                turnNumber={turnNumber}
                handleNewGame={handleNewGame}
                handleSelectCell={handleSelectCell}
              />
              {/* <h1>Comming soon...</h1> */}
            </div>
          </section>
        </main>
      </DashboardShell>
    </>
  );
};

export default GamesPage;
