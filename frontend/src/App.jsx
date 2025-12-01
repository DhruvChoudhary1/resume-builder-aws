import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import EditorPage from "./pages/EditorPage";

export default function App() {
  const [view, setView] = useState("login");
  const [editing, setEditing] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      setUser(JSON.parse(u));
      setView("dashboard");
    }
  }, []);

  return (
    <>
      {view === "login" && (
        <LoginPage
          onLogin={(u) => {
            setUser(u);
            setView("dashboard");
          }}
        />
      )}

      {view === "dashboard" && (
        <Dashboard
          user={user}
          onLogout={() => {
            localStorage.clear();
            setUser(null);
            setView("login");
          }}
          onCreate={() => {
            setEditing(null);
            setView("editor");
          }}
          onEdit={(resume) => {
            setEditing(resume);
            setView("editor");
          }}
        />
      )}

      {view === "editor" && (
        <EditorPage
          resume={editing}
          onBack={() => setView("dashboard")}
        />
      )}
    </>
  );
}
