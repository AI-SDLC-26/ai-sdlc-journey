import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthProvider } from "../auth/AuthContext";
import { useAuth } from "../auth/auth-context";
import DashboardPage from "../pages/DashboardPage";
import { routes } from "../routes";

const profile = { name: "Nikola Tesla", role: "Engineer", age: 86 };
const demoData = { message: "Hello Admin", items: ["Item A", "Item B"], generatedAt: "2026-01-01" };

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

function renderDashboard({ authenticated = true, switcher = false } = {}) {
  if (authenticated) {
    sessionStorage.setItem("auth", JSON.stringify({ token: "t", name: "Admin", role: "admin" }));
  }

  return render(
    <MemoryRouter initialEntries={[routes.dashboard]}>
      <AuthProvider>
        <Routes>
          <Route path={routes.home} element={<p>Home Route</p>} />
          <Route path={routes.dashboard} element={<DashboardPage />} />
        </Routes>
        {switcher && <SessionSwitcher />}
      </AuthProvider>
    </MemoryRouter>
  );
}

function SessionSwitcher() {
  const { setAuth } = useAuth();
  return (
    <button onClick={() => setAuth({ token: "new-token", name: "New User", role: "viewer" })}>
      Switch session
    </button>
  );
}

function mockSuccessfulRequests(profileResponse: Promise<Response> = Promise.resolve(jsonResponse(profile))) {
  return vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
    const url = String(input);
    if (url.endsWith("/api/demo")) return Promise.resolve(jsonResponse(demoData));
    if (url.endsWith("/profile")) return profileResponse;
    throw new Error(`Unexpected request: ${url}`);
  });
}

describe("DashboardPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("shows profile values and keeps them between the items and timestamp", async () => {
    mockSuccessfulRequests();
    const { container } = renderDashboard();

    expect(await screen.findByRole("heading", { name: "Profile" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Logged in Admin" })).toBeDefined();
    expect(screen.getByText("Nikola Tesla")).toBeDefined();
    expect(screen.getByText("Engineer")).toBeDefined();
    expect(screen.getByText("86")).toBeDefined();
    const usersLink = screen.getByRole("link", { name: "Go to Users" });
    expect(usersLink.getAttribute("href")).toBe(routes.users);

    const items = container.querySelector("ul");
    const profileCard = screen.getByRole("region", { name: "Profile" });
    const timestamp = screen.getByText("Generated at: 2026-01-01");
    if (!items) throw new Error("Expected demo items list");
    expect(items.compareDocumentPosition(profileCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(profileCard.compareDocumentPosition(timestamp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("shows the profile loading state while demo data remains available", async () => {
    let resolveProfile!: (response: Response) => void;
    const pendingProfile = new Promise<Response>((resolve) => {
      resolveProfile = resolve;
    });
    mockSuccessfulRequests(pendingProfile);
    renderDashboard();

    expect(screen.getByText("Loading profile...")).toBeDefined();
    expect(await screen.findByText("Item A")).toBeDefined();
    expect(screen.getByText("Generated at: 2026-01-01")).toBeDefined();

    await act(async () => {
      resolveProfile(jsonResponse(profile));
    });
    expect(await screen.findByRole("heading", { name: "Profile" })).toBeDefined();
  });

  it.each([
    ["HTTP 401", () => Promise.resolve(jsonResponse({}, 401))],
    ["HTTP 500", () => Promise.resolve(jsonResponse({}, 500))],
    ["network failure", () => Promise.reject(new Error("network unavailable"))],
    ["invalid JSON", () => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.reject(new SyntaxError("invalid JSON")),
    } as Response)],
  ])("keeps the dashboard usable after a profile %s", async (_label, createFailure) => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = String(input);
      if (url.endsWith("/api/demo")) return Promise.resolve(jsonResponse(demoData));
      if (url.endsWith("/profile")) return createFailure();
      throw new Error(`Unexpected request: ${url}`);
    });
    renderDashboard();

    expect((await screen.findByRole("alert")).textContent).toBe("Failed to load profile");
    expect(await screen.findByText("Item A")).toBeDefined();
    expect(screen.getByText("Generated at: 2026-01-01")).toBeDefined();
    expect(screen.getByRole("link", { name: "Go to Users" })).toBeDefined();
    expect(sessionStorage.getItem("auth")).not.toBeNull();
    expect(screen.queryByText("Home Route")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    expect(await screen.findByText("Home Route")).toBeDefined();
    expect(sessionStorage.getItem("auth")).toBeNull();
  });

  it("shows the profile when demo loading fails without inventing a timestamp", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = String(input);
      if (url.endsWith("/api/demo")) return Promise.reject(new Error("demo unavailable"));
      if (url.endsWith("/profile")) return Promise.resolve(jsonResponse(profile));
      throw new Error(`Unexpected request: ${url}`);
    });
    renderDashboard();

    expect(await screen.findByRole("heading", { name: "Profile" })).toBeDefined();
    expect(await screen.findByText("Failed to load demo data")).toBeDefined();
    expect(screen.queryByText(/Generated at:/)).toBeNull();
  });

  it("shows both errors when both requests fail", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = String(input);
      if (url.endsWith("/api/demo") || url.endsWith("/profile")) {
        return Promise.reject(new Error("request failed"));
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    renderDashboard();

    expect(await screen.findByText("Failed to load demo data")).toBeDefined();
    expect((await screen.findByRole("alert")).textContent).toBe("Failed to load profile");
  });

  it("redirects unauthenticated visits without making requests", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderDashboard({ authenticated: false });

    expect(await screen.findByText("Home Route")).toBeDefined();
    expect(screen.queryByRole("region", { name: "Profile" })).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("ignores an obsolete profile response after logout", async () => {
    let resolveProfile!: (response: Response) => void;
    const pendingProfile = new Promise<Response>((resolve) => {
      resolveProfile = resolve;
    });
    mockSuccessfulRequests(pendingProfile);
    renderDashboard();

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    expect(await screen.findByText("Home Route")).toBeDefined();

    await act(async () => {
      resolveProfile(jsonResponse(profile));
    });
    expect(screen.queryByRole("region", { name: "Profile" })).toBeNull();
  });

  it("does not let an old session replace the new session profile", async () => {
    let resolveOldProfile!: (response: Response) => void;
    const oldProfile = new Promise<Response>((resolve) => {
      resolveOldProfile = resolve;
    });
    vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      const url = String(input);
      const authorization = (init?.headers as Record<string, string> | undefined)?.Authorization;
      if (url.endsWith("/api/demo")) {
        return Promise.resolve(jsonResponse({ ...demoData, message: authorization }));
      }
      if (url.endsWith("/profile") && authorization === "Bearer t") return oldProfile;
      if (url.endsWith("/profile") && authorization === "Bearer new-token") {
        return Promise.resolve(jsonResponse({ name: "New Profile", role: "viewer", age: 20 }));
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    renderDashboard({ switcher: true });

    fireEvent.click(screen.getByRole("button", { name: "Switch session" }));
    expect(await screen.findByText("New Profile")).toBeDefined();

    await act(async () => {
      resolveOldProfile(jsonResponse(profile));
    });
    expect(screen.getByText("New Profile")).toBeDefined();
    expect(screen.queryByText("Nikola Tesla")).toBeNull();
    await waitFor(() => expect(screen.getByRole("heading", { name: "Logged in New User" })).toBeDefined());
  });
});
