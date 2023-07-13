import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HomePageConfig } from "@/config/homepage";
import { TextInputForm } from "@/components/text-input-form";

jest.mock("@clerk/nextjs", () => require("../__mocks__/clerk"));

describe("TextInputForm", () => {
  it("should render properlly", () => {
    render(
      <TextInputForm
        inputType={"text"}
        handleSubmitButton={() => {
          console.log("submit - test");
        }}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });
  it("should render correct title ", () => {
    render(
      <TextInputForm
        inputType={"text"}
        handleSubmitButton={() => {
          console.log("submit - test");
        }}
      />
    );
  });
});
