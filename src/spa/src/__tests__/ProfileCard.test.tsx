import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileCard from "../components/ProfileCard";

describe("ProfileCard", () => {
  it("renders all labelled profile values from its props", () => {
    const { rerender } = render(
      <ProfileCard profile={{ name: "Nikola Tesla", role: "Engineer", age: 86 }} />
    );

    expect(screen.getByRole("heading", { name: "Profile" })).toBeDefined();
    expect(screen.getByText("Name").parentElement?.textContent).toContain("Nikola Tesla");
    expect(screen.getByText("Role").parentElement?.textContent).toContain("Engineer");
    expect(screen.getByText("Age").parentElement?.textContent).toContain("86");

    rerender(<ProfileCard profile={{ name: "Ada Lovelace", role: "Analyst", age: 36 }} />);

    expect(screen.getByText("Ada Lovelace")).toBeDefined();
    expect(screen.getByText("Analyst")).toBeDefined();
    expect(screen.getByText("36")).toBeDefined();
    expect(screen.queryByText("Nikola Tesla")).toBeNull();
  });
});
