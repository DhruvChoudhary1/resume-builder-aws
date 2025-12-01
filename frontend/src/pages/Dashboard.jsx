import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard({ user, onLogout, onCreate, onEdit }) {
  const [resumes, setResumes] = useState([]);

  async function load() {
    const data = await api.list();
    setResumes(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container" style={{ maxWidth: "700px" }}>
      {/* Top Section */}
      <h2 style={{ marginBottom: "20px" }}>Welcome, {user?.name}</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={onCreate}>Create New Resume</button>
        <button
          onClick={onLogout}
          style={{ background: "#777", marginLeft: "10px" }}
        >
          Logout
        </button>
      </div>

      {/* Resume List */}
      <h3 style={{ marginBottom: "15px" }}>Your Resumes</h3>

      <div className="resume-list">
        {resumes.length === 0 && (
          <p style={{ color: "#555" }}>You have not created any resumes yet.</p>
        )}

        {resumes.map((r) => (
          <div className="resume-item" key={r.id}>
            <strong>{r.title}</strong>

            <button onClick={() => onEdit(r)}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
