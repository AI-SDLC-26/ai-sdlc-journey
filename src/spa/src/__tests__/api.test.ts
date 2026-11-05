import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, fetchDemoData, fetchProfile, fetchUsers } from "../api";

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

describe("fetchUsers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns users with a valid token", async () => {
    const mockUsers = [
      { name: "Admin", role: "admin", status: "active" },
      { name: "Ana", role: "member", status: "active" },
    ];

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    } as Response);

    const result = await fetchUsers("valid-token");

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Admin");
    expect(fetchSpy).toHaveBeenCalledWith("http://localhost:5000/api/users", {
      headers: { Authorization: "Bearer valid-token" },
    });
  });

  describe("fetchProfile", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("requests and returns the authenticated profile", async () => {
      const profile = { name: "Nikola Tesla", role: "Engineer", age: 86 };
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(profile),
      } as Response);

      await expect(fetchProfile("valid-token")).resolves.toEqual(profile);
      expect(fetchSpy).toHaveBeenCalledWith("http://localhost:5000/profile", {
        headers: { Authorization: "Bearer valid-token" },
      });
    });

    it.each([401, 500])("rejects an HTTP %i response", async (status) => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
        status,
      } as Response);

      await expect(fetchProfile("valid-token")).rejects.toThrow(`Failed to load profile (${status})`);
    });

    it("rejects network failures", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("network unavailable"));

      await expect(fetchProfile("valid-token")).rejects.toThrow("network unavailable");
    });

    it("rejects invalid JSON", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError("invalid JSON")),
      } as Response);

      await expect(fetchProfile("valid-token")).rejects.toThrow("invalid JSON");
    });
  });

  it("sends empty=true query parameter when empty mode is requested", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);

    const result = await fetchUsers("valid-token", { empty: true });

    expect(result).toHaveLength(0);
    expect(fetchSpy).toHaveBeenCalledWith("http://localhost:5000/api/users?empty=true", {
      headers: { Authorization: "Bearer valid-token" },
    });
  });
});
