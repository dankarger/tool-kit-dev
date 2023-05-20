import { Separator } from "@/components/ui/separator";
import type { Session } from "@/types";

interface SessionsSectionProps {
  sessions: Session[];
  onClick: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const SessionsSection = ({
  sessions,
  onClick,
}: SessionsSectionProps) => {
  if (!sessions) return null;
  return (
    // <div className="lg:dark:hover: flex h-full w-full  flex-col-reverse items-start justify-start rounded-md p-4 align-middle lg:flex-row  lg:flex-wrap lg:items-center  lg:justify-between  lg:gap-x-4  lg:gap-y-0 lg:rounded-md  lg:border lg:border-gray-200  lg:bg-white   lg:p-4  lg:align-middle  lg:shadow-lg  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none  lg:dark:hover:border-gray-700  lg:dark:hover:bg-gray-800  lg:dark:hover:text-white   lg:dark:hover:shadow-sm  lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-900">
    <div className="w-60">
      <ul className=" flex flex-col-reverse">
        {sessions.map((session) => (
          <li
            key={session.id}
            value={session.id}
            className="lg:dark:hover: lg:dark:hover: lg:light:hover: lg:light:hover: flex  flex-col     justify-start  rounded-md  border-gray-300   align-middle  hover:cursor-pointer lg:dark:hover:border-gray-700 lg:dark:hover:bg-gray-800 lg:dark:hover:text-white lg:dark:hover:shadow-sm lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-900"
            onClick={onClick}
            data-valueid={session.id}
          >
            {/* <div key={session.id}> */}
            <span className="[&:not(:first-child)]: leading-7 ">
              {session.name}
            </span>
          </li>
          // <Separator />
        ))}
      </ul>
      {/* </div> */}
    </div>
  );
};
