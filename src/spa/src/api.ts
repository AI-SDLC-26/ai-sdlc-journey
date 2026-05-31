const API_BASE = "http://localhost:5000";

export interface LoginResponse {
  token: string;
  name: string;
  role: string;
}

export interface DemoData {
  message: string;
  items: string[];
  generatedAt: string;
}

export interface UserSummary {
  name: string;
  role: string;
  status: string;
}

export interface FetchUsersOptions {
  empty?: boolean;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function fetchDemoData(token: string): Promise<DemoData> {
  const res = await fetch(`${API_BASE}/api/demo`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function fetchUsers(token: string, options?: FetchUsersOptions): Promise<UserSummary[]> {
  const query = new URLSearchParams();

  if (options?.empty) {
    query.set("empty", "true");
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";
  const res = await fetch(`${API_BASE}/api/users${suffix}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}
