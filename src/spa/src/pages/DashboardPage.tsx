import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../auth/auth-context";
import { fetchDemoData, fetchProfile, type DemoData, type Profile } from "../api";
import ProfileCard from "../components/ProfileCard";
import { routes } from "../routes";

type DemoState = {
  token: string;
  data: DemoData;
};

type DemoErrorState = {
  token: string;
  message: string;
};

type ProfileState =
  | { token: string; status: "loaded"; profile: Profile }
  | { token: string; status: "error" };

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const token = user?.token;
  const [demo, setDemo] = useState<DemoState | null>(null);
  const [demoError, setDemoError] = useState<DemoErrorState | null>(null);
  const [profileState, setProfileState] = useState<ProfileState | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;

    void fetchDemoData(token)
      .then((data) => {
        if (active) setDemo({ token, data });
      })
      .catch(() => {
        if (active) setDemoError({ token, message: "Failed to load demo data" });
      });

    void fetchProfile(token)
      .then((profile) => {
        if (active) setProfileState({ token, status: "loaded", profile });
      })
      .catch(() => {
        if (active) setProfileState({ token, status: "error" });
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (!user) return <Navigate to={routes.home} replace />;

  const currentDemo = demo?.token === user.token ? demo.data : null;
  const currentDemoError = demoError?.token === user.token ? demoError.message : "";
  const currentProfileState: ProfileState | { token: string; status: "loading" } = profileState?.token === user.token
    ? profileState
    : { token: user.token, status: "loading" };

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Logged in {user.name}</h1>
      <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <a href={routes.users}>Go to Users</a>
        <button onClick={logout}>Logout</button>
      </div>
      {currentDemoError && <p style={{ color: "red" }}>{currentDemoError}</p>}
      {currentDemo && (
        <div>
          <p>{currentDemo.message}</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {currentDemo.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      <div aria-live="polite">
        {currentProfileState.status === "loading" && <p>Loading profile...</p>}
        {currentProfileState.status === "error" && <p role="alert">Failed to load profile</p>}
        {currentProfileState.status === "loaded" && <ProfileCard profile={currentProfileState.profile} />}
      </div>
      {currentDemo && <small>Generated at: {currentDemo.generatedAt}</small>}
    </div>
  );
}
