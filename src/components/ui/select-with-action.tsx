import * as React from "react";
import type { Session, Response, ChatMessage } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectElementProps = {
  options: Session[];
  onSelect: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

export function SelectElement({ options, onSelect }: SelectElementProps) {
  if (!options) return null;
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Previous Chats" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
