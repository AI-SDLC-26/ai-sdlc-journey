import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthProvider } from "../auth/AuthContext";
import UsersPage from "../pages/UsersPage";
import { getStatusSlug } from "../utils/status";

describe("UsersPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders Name, Role and Status columns after loading users", async () => {
    sessionStorage.setItem("auth", JSON.stringify({ token: "t", name: "Admin", role: "admin" }));

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { name: "Admin", role: "admin", status: "active" },
          { name: "Ana", role: "member", status: "active" },
        ]),
    } as Response);

    render(
      <MemoryRouter initialEntries={["/users"]}>
        <AuthProvider>
          <Routes>
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading users...")).toBeDefined();
    expect(await screen.findByText("Name")).toBeDefined();
    expect(screen.getByText("Role")).toBeDefined();
    expect(screen.getByText("Status")).toBeDefined();
    expect(screen.getByText("Admin")).toBeDefined();
  });

  it("shows exact empty-state message when no users are returned", async () => {
    sessionStorage.setItem("auth", JSON.stringify({ token: "t", name: "Admin", role: "admin" }));

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);

    render(
      <MemoryRouter initialEntries={["/users?empty=true"]}>
        <AuthProvider>
          <Routes>
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText("No available users")).toBeDefined();
    expect(fetchSpy).toHaveBeenCalledWith("http://localhost:5000/api/users?empty=true", {
      headers: { Authorization: "Bearer t" },
    });
  });

  it("redirects unauthenticated users from /users to /", async () => {
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<div>Home Route</div>} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Home Route")).toBeDefined();
  });

  it("normalizes status text into a status slug", () => {
    expect(getStatusSlug("On Hold")).toBe("on-hold");
    expect(getStatusSlug("MIXED Case Value")).toBe("mixed-case-value");
    expect(getStatusSlug("")).toBe("");
  });
});
