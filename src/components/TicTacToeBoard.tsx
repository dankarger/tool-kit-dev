import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CellProps {
  value: string;
  // player: string;
  // cellNumber: number;
  // disabled: boolean;
  onClick: () => void;
}

const Cell = (props: CellProps) => {
  const {
    value,
    // player,
    onClick,
    //  cellNumber, disabled
  } = props;
  return (
    // <Card sx={{border:"1px solid black"}} >
    <Button
      variant="outline"
      onClick={onClick}
      value={value}
      disabled={value != "_"}
    >
      {value !== "_" ? value : ""}
    </Button>
    // </Card>
  );
};

interface BoardProps {
  board: string[][];
  turnNumber: number;
  handleNewGame: () => void;
  handleSelectCell: ([]) => void;
}

export function TicTacToeBoard({
  board,
  turnNumber,
  handleNewGame,
  handleSelectCell,
}: BoardProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{turnNumber % 2 == 0 ? "Your turn" : "AI turn"}</CardTitle>
        <CardDescription>
          {turnNumber != 0 ? "Turn number" + { turnNumber } : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* {board.map((cell,index)=>(
          <Cell value={cell} key={index}/>
        )} */}
        <div className=" grid grid-cols-3 ">
          {board.map((row, rowIndex) =>
            row.map((cell, index) => (
              <Cell
                value={cell}
                key={`${index}-${rowIndex}`}
                onClick={() => handleSelectCell([index, rowIndex])}
              />
            ))
          )}
        </div>
        <Separator />
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* <Button variant="ghost">Cancel</Button> */}
        <Button onClick={handleNewGame}>New Game</Button>
      </CardFooter>
    </Card>
  );
}
