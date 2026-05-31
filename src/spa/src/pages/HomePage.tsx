import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/auth-context";
import { login } from "../api";

export default function HomePage() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h1>Welcome back, {user.name}!</h1>
        <p>You are already logged in.</p>
        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
          <a href="/dashboard" style={{ padding: "0.5rem 1rem" }}>Go to Dashboard</a>
          <a href="/users" style={{ padding: "0.5rem 1rem" }}>Go to Users</a>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Hello!</h1>
      <p>Welcome to the Demo App. Please log in to continue.</p>
      <LoginForm />
    </div>
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
    <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
      <div style={{ marginBottom: "0.5rem" }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
