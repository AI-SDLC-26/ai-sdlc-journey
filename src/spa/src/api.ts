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
