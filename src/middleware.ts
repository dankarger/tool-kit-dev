import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();
console.log("miidd");
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
