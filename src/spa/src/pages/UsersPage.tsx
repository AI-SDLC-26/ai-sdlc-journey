import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { fetchUsers, type UserSummary } from "../api";
import { useAuth } from "../auth/auth-context";
import { getStatusClassName } from "../utils/status";

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
    <main className="app-shell">
      <section className="app-shell__card">
        <div className="app-shell__card-inner">
          <p className="app-shell__eyebrow">Protected directory</p>
          <h1 className="app-shell__title">Community Users</h1>
          <p className="app-shell__copy">A native table with a restrained midnight palette and soft contrast for easier scanning.</p>
          <div className="app-shell__toolbar">
            <Link className="app-link-button" to="/dashboard">Go to Dashboard</Link>
            <Link className="app-link-button" to="/">Home</Link>
            <button className="app-button" type="button" onClick={logout}>Logout</button>
          </div>

          {isLoading && <p className="app-shell__copy">Loading users...</p>}
          {!isLoading && error && <p className="app-shell__banner">{error}</p>}
          {!isLoading && !error && users.length === 0 && <p className="app-shell__empty-state">No available users</p>}

          {!isLoading && !error && users.length > 0 && (
            <div className="app-shell__table-wrap">
              <table className="app-shell__table">
                <thead className="app-shell__table-head">
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="app-shell__table-body">
                  {users.map((entry) => (
                    <tr key={`${entry.name}-${entry.role}-${entry.status}`}>
                      <td>{entry.name}</td>
                      <td>{entry.role}</td>
                      <td>
                        <span className={`app-shell__status ${getStatusClassName(entry.status)}`}>{entry.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
