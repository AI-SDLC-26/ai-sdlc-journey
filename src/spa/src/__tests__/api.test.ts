import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, fetchDemoData } from "../api";

describe("login", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns token on successful login", async () => {
    const mockResponse = { token: "jwt-token", name: "Admin", role: "admin" };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await login("admin", "admin");
    expect(result.token).toBe("jwt-token");
    expect(result.name).toBe("Admin");
  });

  it("throws on invalid credentials", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as Response);

    await expect(login("admin", "wrong")).rejects.toThrow("Invalid credentials");
  });
});

describe("fetchDemoData", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns demo data with valid token", async () => {
    const mockData = { message: "Hello", items: ["A"], generatedAt: "2026-01-01" };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const result = await fetchDemoData("valid-token");
    expect(result.items).toHaveLength(1);
  });

  it("throws on unauthorized request", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as Response);

    await expect(fetchDemoData("bad-token")).rejects.toThrow("Unauthorized");
  });
});
