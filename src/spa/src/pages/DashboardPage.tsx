import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../auth/auth-context";
import { fetchDemoData, type DemoData } from "../api";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<DemoData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchDemoData(user.token)
      .then(setData)
      .catch(() => setError("Failed to load demo data"));
  }, [user]);

  if (!user) return <Navigate to="/" replace />;

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Logged in {user.name}</h1>
      <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <a href="/users">Go to Users</a>
        <button onClick={logout}>Logout</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <div>
          <p>{data.message}</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {data.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <small>Generated at: {data.generatedAt}</small>
        </div>
      )}
    </div>
  );
}
