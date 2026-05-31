import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { fetchUsers, type UserSummary } from "../api";
import { useAuth } from "../auth/auth-context";

export default function UsersPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const query = new URLSearchParams(location.search);
    const useEmptyMode = query.get("empty") === "true";

    fetchUsers(user.token, { empty: useEmptyMode })
      .then((data) => {
        setUsers(data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load users");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location.search, user]);

  if (!user) return <Navigate to="/" replace />;

  return (
    <div style={{ maxWidth: "760px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Community Users</h1>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <a href="/dashboard">Go to Dashboard</a>
        <a href="/">Home</a>
        <button onClick={logout}>Logout</button>
      </div>

      {isLoading && <p>Loading users...</p>}
      {!isLoading && error && <p style={{ color: "red" }}>{error}</p>}
      {!isLoading && !error && users.length === 0 && <p>No available users</p>}

      {!isLoading && !error && users.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "0.5rem" }}>Name</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "0.5rem" }}>Role</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "0.5rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((entry) => (
              <tr key={`${entry.name}-${entry.role}-${entry.status}`}>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: "0.5rem" }}>{entry.name}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: "0.5rem" }}>{entry.role}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: "0.5rem" }}>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
