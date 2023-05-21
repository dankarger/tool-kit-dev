import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function onPromise<T>(promise: (event: SyntheticEvent) => Promise<T>) {
//   return (event: SyntheticEvent) => {
//     if (promise) {
//       promise(event).catch((error) => {
//         console.log("Unexpected error", error);
//       });
//     }
//   };
// }
