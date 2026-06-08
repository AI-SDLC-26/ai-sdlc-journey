import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthProvider } from "../auth/AuthContext";
import DashboardPage from "../pages/DashboardPage";

describe("DashboardPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("shows users navigation link for authenticated users", async () => {
    sessionStorage.setItem("auth", JSON.stringify({ token: "t", name: "Admin", role: "admin" }));

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Hello", items: ["A"], generatedAt: "2026-01-01" }),
    } as Response);

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    const usersLink = await screen.findByRole("link", { name: "Go to Users" });
    expect(usersLink.getAttribute("href")).toBe("/users");
  });
});
