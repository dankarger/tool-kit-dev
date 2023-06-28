// import React from "react";
// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import ChatPage from "@/pages/chat";
// import { withTRPC } from "@trpc/next";
// import { AppType } from "next/dist/shared/lib/utils";
// import { type inferProcedureInput } from "@trpc/server";
// import { appRouter, type AppRouter } from "@/server/api/root";
// import { createInnerTRPCContext } from "@/server/api/trpc";

// jest.mock("@clerk/nextjs", () => require("../__mocks__/clerk"));

// test("protected example router", async () => {
//   const ctx = await createInnerTRPCContext({ session: "test" });
//   const caller = appRouter.createCaller(ctx);
// });

// const WrappedChatPage: AppType = withTRPC({
//   config(info: { ctx?: NextPageContext | undefined }) {
//     return {
//       // your TRPC config here
//     };
//   },
//   ssr: false,
// })(ChatPage);

// test("renders login and logout components", () => {
//   render(
//       <ChatPage />

//   );
//   expect(screen.getByText("Chat")).toBeInTheDocument();
// });
