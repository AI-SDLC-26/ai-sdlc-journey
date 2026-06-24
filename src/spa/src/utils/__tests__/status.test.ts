import { describe, expect, it } from "vitest";
import { getStatusClassName } from "../status";

describe("getStatusClassName", () => {
  it("returns the active class for active statuses", () => {
    expect(getStatusClassName("Active")).toBe("app-shell__status--active");
  });

  it("returns the unknown class for unsupported statuses", () => {
    expect(getStatusClassName("On Hold")).toBe("app-shell__status--unknown");
  });

  it("returns the unknown class for blank statuses", () => {
    expect(getStatusClassName("")).toBe("app-shell__status--unknown");
  });
});
