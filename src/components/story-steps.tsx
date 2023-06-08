import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { List } from "lucide-react";

interface ListItemProps {
  title: string;
  subTitle: string;
  checked: boolean;
}

const listItemStep2 = ({ title, subTitle, checked }: ListItemProps) => {
  return (
    <li className="mb-10 ml-6">
      <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white dark:bg-gray-700 dark:ring-gray-900">
        {/* <svg
        aria-hidden="true"
        class="h-5 w-5 text-gray-500 dark:text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
          clip-rule="evenodd"
        ></path>
      </svg> */}

        {checked ? <Icons.checkCircle /> : <Icons.disc />}
      </span>
      <h3 className="font-medium leading-tight">Generating Title</h3>
      <p clclassNameass="text-sm">Step details here</p>
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
            {completedStep1 ? <Icons.checkCircle /> : <Icons.disc />}
          </span>
          <h3 className="font-medium leading-tight">Generating Story</h3>
          <p className="text-sm">Step details here</p>
        </li>
        <li className="mb-10 ml-6">
          <span
            className={cn(
              "absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100  ring-4 ring-white dark:bg-green-900 dark:ring-gray-900",
              completedStep2 ? "bg-green-200" : ""
            )}
          >
            {completedStep2 ? <Icons.checkCircle /> : <Icons.disc />}
          </span>
          <h3 className="font-medium leading-tight">Generating Title</h3>
          <p className="text-sm">Step details here</p>
        </li>
        <li className="mb-10 ml-6">
          <span
            className={cn(
              "absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100  ring-4 ring-white dark:bg-green-900 dark:ring-gray-900",
              completedStep3 ? "bg-green-200" : ""
            )}
          >
            {completedStep3 ? <Icons.checkCircle /> : <Icons.disc />}
          </span>
          <h3 className="font-medium leading-tight">Generating Image</h3>
          <p className="text-sm">Step details here</p>
        </li>
        {/* <listItemStep2
          title="Generating Title"
          subTitle="Step details here"
          checked={completed3}
        /> */}
        {/* <li className="mb-10 ml-6">
          <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white dark:bg-gray-700 dark:ring-gray-900">
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path
                fill-rule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
          <h3 className="font-medium leading-tight">Generating Image</h3>
          <p className="text-sm">Step details here</p>
        </li> */}
      </ol>
    </div>
  );
};
