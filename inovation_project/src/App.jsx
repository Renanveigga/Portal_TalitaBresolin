import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./styles/global.css";

import { useTheme } from "./hooks/useTheme";
import Sidebar   from "./components/Sidebar/Sidebar";
import SearchBar from "./components/SearchBar/SearchBar";
import Home      from "./pages/Home/Home";
import Library   from "./pages/Library/Library";
import Lost      from "./pages/Lost/Lost";
import Courses   from "./pages/Courses/Courses";
import History   from "./pages/History/History";
import Login     from "./pages/Admin/Login";
import Admin     from "./pages/Admin/Admin";
import Talentos from "./pages/Talentos/Talentos";

const ROUTE_MAP = {
  home:    "/",
  library: "/biblioteca",
  lost:    "/achados",
  courses: "/cursos",
  history: "/historia",
  admin:   "/admin",
  talentos: "/talentos",
};

export default function App() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem("admin") === "true"
  );

  const handleLogin = () => {
    sessionStorage.setItem("admin", "true");
    setIsAdmin(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    setIsAdmin(false);
    navigate("/");
  };

  if (isAdmin) {
    return <Admin onLogout={handleLogout} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        onNavigate={(id) => navigate(ROUTE_MAP[id] ?? "/")}
        dark={dark}
        toggleTheme={toggleTheme}
      />
      <div className="app-content">
        <div className="app-topbar">
          <SearchBar />
        </div>
        <main className="app-main">
          <Routes>
            <Route path="/"           element={<Home />}    />
            <Route path="/biblioteca" element={<Library />} />
            <Route path="/achados"    element={<Lost />}    />
            <Route path="/cursos"     element={<Courses />} />
            <Route path="/historia"   element={<History />} />
            <Route path="/admin"      element={<Login onLogin={handleLogin} />} />
            <Route path="*"           element={<Navigate to="/" />} />
            <Route path="/talentos"   element={<Talentos />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}