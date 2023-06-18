import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/pages/index";
import { HomePageConfig } from "@/config/homepage";
import { TextInputForm } from "@/components/text-input-form";

describe("Home page", () => {
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