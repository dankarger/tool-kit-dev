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
import { on } from "process";

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

  return (
    <div className="flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center">
      <p className="text-sm font-medium leading-none">
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

          {/* <span className="mr-2 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground">
          {label}
        </span> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            {/* {/* <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Assign to...
            </DropdownMenuItem> */}
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
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tags className="mr-2 h-4 w-4" />
                Apply label
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Filter label..."
                    autoFocus={true}
                  />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {labels.map((label) => (
                        <CommandItem
                          key={label}
                          onSelect={(value) => {
                            setLabel(value);
                            setOpen(false);
                          }}
                        >
                          {label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Button
                variant="ghost"
                size="sm"
                value={value}
                data-valuid={valueid}
                onClick={(e) => {
                  handleDeleteResult(e.currentTarget.dataset.valuid);
                }}
              >
                {" "}
                <Trash className="mr-2 h-4 w-4" />
                Delete Session
              </Button>

              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
