import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import { routes } from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.home} element={<HomePage />} />
        <Route path={routes.dashboard} element={<DashboardPage />} />
        <Route path={routes.users} element={<UsersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

