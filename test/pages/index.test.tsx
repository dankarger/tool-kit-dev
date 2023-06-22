import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/pages/index";
import { HomePageConfig } from "@/config/homepage";
import { TextInputForm } from "@/components/text-input-form";
import ChatPage from "@/pages/chat";

jest.mock("@clerk/nextjs", () => require("../__mocks__/clerk"));

// test("renders login and logout components", () => {
//   render(<ChatPage />);

//   // Check if login and logout components are rendered
//   expect(screen.getByText("Chat")).toBeInTheDocument();
//   // expect(screen.getByText("Signout")).toBeInTheDocument();
// // });

describe("TextInputForm", () => {
  it("should render properlly", () => {
    render(
      <TextInputForm
        inputType={"text"}
        handleSubmitButton={() => {
          console.log("test");
        }}
      />
    );
    const title = HomePageConfig.title;
    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(2);
  });
});
