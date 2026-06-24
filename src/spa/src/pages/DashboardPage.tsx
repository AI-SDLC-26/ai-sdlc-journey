import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
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
    <main className="app-shell">
      <section className="app-shell__card">
        <div className="app-shell__card-inner">
          <p className="app-shell__eyebrow">Live demo feed</p>
          <h1 className="app-shell__title">Logged in as {user.name}.</h1>
          <p className="app-shell__copy">The dashboard stays intentionally focused: a few signals, clear contrast, and no visual clutter.</p>
          <div className="app-shell__toolbar">
            <Link className="app-link-button" to="/users">Go to Users</Link>
            <button className="app-button" type="button" onClick={logout}>Logout</button>
          </div>
          {error && <p className="app-shell__banner">{error}</p>}
          {data && (
            <div className="app-shell__grid">
              <div className="app-shell__metric-list">
                <div className="app-shell__metric">
                  <p className="app-shell__metric-label">Message</p>
                  <p className="app-shell__metric-value">{data.message}</p>
                </div>
                <div className="app-shell__metric">
                  <p className="app-shell__metric-label">Items</p>
                  <p className="app-shell__metric-value">{data.items.length} entries</p>
                </div>
                <div className="app-shell__metric">
                  <p className="app-shell__metric-label">Generated</p>
                  <p className="app-shell__metric-value">{data.generatedAt}</p>
                </div>
              </div>
              <div className="app-shell__metric">
                <p className="app-shell__metric-label">Items</p>
                <ul className="app-shell__list">
                  {data.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
