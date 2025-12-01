import { useState } from "react";
import { api } from "../api";

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");

    try {
      if (mode === "login") {
        const res = await api.login(form);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        onLogin(res.user);
      } else {
        await api.register(form);
        alert("Registered! Now login.");
        setMode("login");
      }
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="container">
      {/* Heading */}
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        {mode === "login" ? "Login" : "Register"}
      </h2>

      {/* Error message */}
      {err && <p style={{ color: "red", marginBottom: "10px" }}>{err}</p>}

      {/* Form */}
      <form onSubmit={submit}>
        {mode === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" style={{ width: "100%", marginTop: "5px" }}>
          {mode === "login" ? "Login" : "Create Account"}
        </button>
      </form>

      {/* Switch mode */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <button
          className="link-btn"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "New user? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
