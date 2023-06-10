import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { List } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/spinner";
interface ListItemProps {
  title: string;
  subTitle: string;
  checked: boolean;
}

const listItemStep2 = ({ title, subTitle, checked }: ListItemProps) => {
  return (
    <li className="mb-10 ml-6">
      <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white dark:bg-gray-700 dark:ring-gray-900">
        {checked ? <Icons.checkCircle /> : <Icons.disc />}
      </span>
      <h3 className="font-medium leading-tight">Generating Title</h3>
      <p className="text-sm">Step details here</p>
    </li>
  );
};

interface StoryStepProps {
  completedStep1: boolean;
  completedStep2: boolean;
  completedStep3: boolean;
}

export const StorySteps = ({
  completedStep1,
  completedStep2,
  completedStep3,
}: StoryStepProps) => {
  // const completedStep1 = true;
  // const completedStep2 = false;
  // const completedStep3 = false;

  return (
    <div className="p-6">
      <ol className="relative border-l border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <li className="mb-10 ml-6">
          <span
            className={cn(
              "absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100  ring-4 ring-white dark:bg-green-900 dark:ring-gray-900",
              completedStep1 ? "bg-green-200" : ""
            )}
          >
            {completedStep1 ? (
              <Icons.checkCircle />
            ) : (
              <LoadingSpinner size={8} />
            )}
          </span>
          <h3 className="font-medium leading-tight">Generating Story</h3>
          <p className="text-sm">
            Your story is being generated based on text.
          </p>
        </li>
        <li className="mb-10 ml-6">
          <span
            className={cn(
              "absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100  ring-4 ring-white dark:bg-green-900 dark:ring-gray-900",
              completedStep2 ? "bg-green-200" : ""
            )}
          >
            {completedStep2 ? (
              <Icons.checkCircle />
            ) : (
              <LoadingSpinner size={8} />
            )}
          </span>
          <h3 className="font-medium leading-tight">Generating Title</h3>
          <p className="text-sm">A Title based on the generated story.</p>
        </li>
        <li className="mb-10 ml-6">
          <span
            className={cn(
              "absolute -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100  ring-4 ring-white dark:bg-green-900 dark:ring-gray-900",
              completedStep3 ? "bg-green-200" : ""
            )}
          >
            {completedStep3 ? (
              <Icons.checkCircle />
            ) : (
              <LoadingSpinner size={8} />
            )}
          </span>
          <h3 className="font-medium leading-tight">Generating Image</h3>
          <p className="text-sm">
            Based on the story and title, making an illustration for the story
          </p>
        </li>
      </ol>
    </div>
  );
};
