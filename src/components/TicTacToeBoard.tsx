import React from "react";
import { Button } from "./ui/button";

interface CellProps {
  value: string;
  player: string;
  cellNumber: number;
  disabled: boolean;
  onClick: () => void;
}

const Cell = (props: CellProps) => {
  const { value, player, onClick, cellNumber, disabled } = props;

  return (
    // <Card sx={{border:"1px solid black"}} >
    <Button onClick={onClick} value={cellNumber} disabled={disabled}>
      {value !== "empty" ? value : ""}
    </Button>
    // </Card>
  );
};

interface BoardProps {
  board: string[];
  turnNumber: number;
}

export function TicTacToeBoard({ board, turnNumber }: BoardProps) {
  return <h1>board</h1>;
}
