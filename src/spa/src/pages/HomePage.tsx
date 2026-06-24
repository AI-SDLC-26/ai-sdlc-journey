import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/auth-context";
import { login } from "../api";

export default function HomePage() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <main className="app-shell">
        <section className="app-shell__card app-shell__card--narrow">
          <div className="app-shell__card-inner">
            <p className="app-shell__eyebrow">AI-SDLC Journey</p>
            <h1 className="app-shell__title">Welcome back, {user.name}.</h1>
            <p className="app-shell__copy">Your workspace is already unlocked. Continue into the dashboard or review the users table.</p>
            <div className="app-shell__actions">
              <Link className="app-link-button app-button--primary" to="/dashboard">Go to Dashboard</Link>
              <Link className="app-link-button" to="/users">Go to Users</Link>
              <button className="app-button" type="button" onClick={logout}>Logout</button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="app-shell__card app-shell__card--narrow">
        <div className="app-shell__card-inner">
          <p className="app-shell__eyebrow">AI-SDLC Journey</p>
          <h1 className="app-shell__title">Hello!</h1>
          <p className="app-shell__copy">A dark, high-contrast control surface for the demo app. Sign in to continue.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(username, password);
      setAuth(data);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <form className="app-shell__form" onSubmit={handleSubmit}>
      <div className="app-shell__field">
        <label className="app-shell__label" htmlFor="username">Username</label>
        <input
          className="app-shell__input"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="app-shell__field">
        <label className="app-shell__label" htmlFor="password">Password</label>
        <input
          className="app-shell__input"
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="app-shell__banner">{error}</p>}
      <button className="app-button app-button--primary" type="submit">Login</button>
    </form>
  );
}
