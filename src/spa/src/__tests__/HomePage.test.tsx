import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthProvider } from "../auth/AuthContext";
import HomePage from "../pages/HomePage";

describe("HomePage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("shows hello message when not authenticated", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Hello!")).toBeDefined();
    expect(screen.getByText(/Please log in/)).toBeDefined();
  });

  it("shows login form inputs", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Username")).toBeDefined();
    expect(screen.getByPlaceholderText("Password")).toBeDefined();
    expect(screen.getByRole("button", { name: "Login" })).toBeDefined();
  });

  it("shows welcome message when authenticated", () => {
    sessionStorage.setItem("auth", JSON.stringify({ token: "t", name: "Admin", role: "admin" }));

    render(
      <MemoryRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome back, Admin/)).toBeDefined();
  });
});
