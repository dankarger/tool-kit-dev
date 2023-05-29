import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
// import type { Response } from "@/types";

type Response = {
  message?: string;
  response?: string;
  authorId?: string;
};

export const ResponseDiv = ({ message, response }: Response) => {
  // if (!text) return null;
  const user = useUser();

  return (
    <div className="lg:dark:hover: flex h-full w-full  flex-col items-start justify-start rounded-md p-2 align-middle lg:flex-row  lg:flex-wrap lg:items-center  lg:justify-between  lg:gap-x-4  lg:gap-y-0 lg:rounded-md  lg:border lg:border-gray-200  lg:bg-white   lg:p-4  lg:align-middle  lg:shadow-lg  lg:dark:border-gray-700    lg:dark:bg-gray-900  lg:dark:text-white  lg:dark:shadow-none  lg:dark:hover:border-gray-700  lg:dark:hover:bg-gray-800  lg:dark:hover:text-white     lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-900">
      {/* <div className="lg:dark:hover: lg:dark:hover:  flex  h-full  w-full  flex-col  justify-start  rounded-md  border-2 border-gray-300   p-4 align-middle lg:dark:hover:border-gray-700 lg:dark:hover:bg-gray-800 lg:dark:hover:text-white lg:dark:hover:shadow-sm lg:dark:hover:shadow-xl lg:dark:hover:shadow-gray-900"> */}
      {/* <div className="w-full bg-green-100">
        <p className="leading-7 [&:not(:first-child)]:mt-6 ">{author}</p>
      </div>
      <Separator /> */}
      <p className="gap-2 text-left text-base leading-7 text-muted-foreground [&:not(:first-child)]:mt-4">
        {" "}
        <span className="px-2 font-semibold">
          @{user.user?.username ?? "User"}:
        </span>{" "}
        {message}
      </p>
      <Separator className="mt-6" />
      <p className="gap-2 text-left text-base leading-7 text-muted-foreground [&:not(:first-child)]:mt-6">
        {" "}
        <span className="px-2 font-semibold">Assistant:</span> {response}
      </p>
    </div>
  );
};
