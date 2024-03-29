import * as React from "react";
import { Calendar, MoreHorizontal, Tags, Trash, User } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { on } from "process";
import { SimpleModal } from "@/components/ui/simple-modal";

const labels = [
  "feature",
  "bug",
  "enhancement",
  "documentation",
  "design",
  "question",
  "maintenance",
];

type SessionsComboboxProps = {
  label: string;
  title: string;
  value: string;
  valueid: string;
  onSelect: (value: string) => void;
  handleDeleteResult: (value: string) => void;
};

export function SessionsCombobox({
  label,
  title,
  value,
  valueid,
  onSelect,
  handleDeleteResult,
}: SessionsComboboxProps) {
  // const [label, setLabel] = React.useState("feature");
  const [open, setOpen] = React.useState(false);
  const [isDialogueOpen, setDialogueOpen] = React.useState(false);

  const handleConfirmDeleteButton = (confirm: boolean) => {
    // setDialogueOpen(true);
    // const res = alert(value);
    setDialogueOpen(true);
    // const res = window.confirm("are you sure you want to delete this session");
    // if (res) {
    if (confirm) {
      //   // handleDeleteResult(value);
      console.log(`deleting - ${value}`);
    }
    // }
  };

  return (
    <div className="flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center">
      {/* <SimpleModal
        handleAction={handleDeleteResult}
        value={value}

        // setDialogueOpen={setDialogueOpen}
      /> */}
      <p className="text-sm ">
        {/* <span className="mr-2 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground">
          {label}
        </span> */}
        <span className="text-muted-foreground">{title || "Title"}</span>
      </p>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                size="sm"
                value={value}
                data-valuid={valueid}
                onClick={(e) => {
                  onSelect(value);
                }}
              >
                {" "}
                <Calendar className="mr-2 h-4 w-4" />
                Load Session
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              {/* <Button
                variant="ghost"
                size="sm"
                value={value}
                data-valuid={valueid}
                onClick={() => {
                  // handleDeleteResult(value);
                  setDialogueOpen(true);
                  // void handleConfirmDeleteButton(value);
                }}
              >
                {" "}
                <Trash className="mr-2 h-4 w-4" />
                Delete Session
              </Button> */}
              <div className="flex items-center px-3 py-2">
                <Trash className="mr-2 h-4 w-4" />
                <SimpleModal
                  handleAction={handleDeleteResult}
                  value={value}

                  // setDialogueOpen={setDialogueOpen}
                />
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
