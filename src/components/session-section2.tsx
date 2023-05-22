import { Separator } from "@/components/ui/separator";
import type { Session } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment } from "react";
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
      <div className=" z-150 top-59 left-1  h-full  px-2 pb-4">
        <div className="w-50  h-full   ">
          <Separator />
          <ScrollArea className="h-[450px] w-[400px] rounded-md border p-4">
            <Fragment>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Previous Results
              </h3>
              <Separator />
              <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader> */}
                <TableBody>
                  {sessions.map((session: SummarizeResult) => (
                    <ResultPopover result={session}>
                      <TableRow className="hover:font-muted hover:cursor-pointer hover:bg-muted">
                        <TableCell className="font-medium">
                          {`${session.text.substring(0, 25)}...`}
                        </TableCell>
                        {/* // <TableCell>Paid</TableCell> */}
                        {/* <TableCell>Credit Card</TableCell> } */}
                        <TableCell className="text-right text-xs">
                          {/* {JSON.stringify(session.createdAt).split("-")[0]} */}
                          {session.createdAt.getDay()} -
                          {session.createdAt.getMonth()} -
                          {session.createdAt.getUTCFullYear()}
                        </TableCell>
                      </TableRow>
                    </ResultPopover>
                  ))}
                </TableBody>
              </Table>
            </Fragment>
            {/* ))} */}
            {/* </ul> */}
          </ScrollArea>
        </div>
      </div>
    </Fragment>
  );
};
