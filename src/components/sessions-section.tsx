import type {
  Session,
  StoryResult,
  TranslationResultType,
  SummarizeResultType,
} from "@/types";
import { Fragment } from "react";
import { SelectElement } from "@/components/ui/select-with-action";

interface SessionsSectionProps {
  sessions:
    | StoryResult[]
    | TranslationResultType[]
    | SummarizeResultType[]
    | Session[];
  onClick?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onSelect: (sessionId: string) => void;

  // onSelect: (sessionId: string) => void;
  onNewSession: () => void;
  handleDeleteResult: (resultId: string) => void;
}

export const SessionsSection = ({
  sessions,
  onClick,
  onSelect,
  onNewSession,
  handleDeleteResult,
}: SessionsSectionProps) => {
  if (!sessions) return null;
  return (
    <div className=" z-150 top-59 left-1  h-full  px-2 pb-4">
      <SelectElement
        options={sessions}
        onSelect={onSelect}
        onNewSession={onNewSession}
        handleDeleteResult={handleDeleteResult}
      />
    </div>
  );
};
