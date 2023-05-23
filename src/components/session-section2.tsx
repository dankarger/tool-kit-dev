import { Separator } from "@/components/ui/separator";
import type { Session } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment, use } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Result } from "@/types";
import { TranslationResult, SummarizeResult } from "prisma/prisma-client";
import { ResultPopover } from "@/components/result-popover";

interface SessionsSectionProps {
  sessions: SummarizeResult[] & TranslationResult[];
  onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}

export const SessionsSection2 = ({
  sessions,
  onClick,
}: SessionsSectionProps) => {
  if (!sessions) return null;
  return (
    <Fragment>
      <div className=" z-150 top-59 left-1    h-full px-2 pb-4">
        <div className="w-50  h-full   ">
          <Separator />
          <ScrollArea className="h-[450px] rounded-md border p-4 sm:w-[200px] lg:w-[350px]">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Previous Results
            </h3>
            <Separator />
            <div className="  caption-bottom text-sm">
              {/* <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader> */}
              <div className="flex w-full flex-col-reverse sm:w-[2-px] lg:w-[300px] [&_tr:last-child]:border-0">
                {sessions.map((session: SummarizeResult) => (
                  <Fragment key={session.id}>
                    <ResultPopover result={session}>
                      <div className=" hover:font-muted hover:font-muted border-b transition-colors hover:cursor-pointer hover:bg-muted   data-[state=selected]:bg-muted sm:w-[2-px] lg:w-[400px]">
                        <div className="justify-left flex items-center p-2 text-left text-sm font-medium [&:has([role=checkbox])]:pr-0">
                          {`${session.text.substring(0, 25)}...`}
                          {/* // <TableCell>Paid</TableCell> */}
                          {/* <TableCell>Credit Card</TableCell> } */}
                          <div className="text-right text-xs text-slate-400 ">
                            {/* {JSON.stringify(session.createdAt).split("-")[0]} */}
                            {session.createdAt.getDay()} -
                            {session.createdAt.getMonth()} -
                            {session.createdAt.getUTCFullYear()}
                          </div>
                        </div>
                      </div>
                    </ResultPopover>
                  </Fragment>
                ))}
              </div>
            </div>
            {/* ))} */}
            {/* </ul> */}
          </ScrollArea>
        </div>
      </div>
    </Fragment>
  );
};
