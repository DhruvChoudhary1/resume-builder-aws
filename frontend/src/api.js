const API = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("token");
}

async function call(path, method = "GET", body = null) {
  const res = await fetch(API + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const msg = await res.json();
    throw new Error(msg.message || "API error");
  }

  return res.json();
}

export const api = {
  login: (data) => call("/auth/login", "POST", data),
  register: (data) => call("/auth/register", "POST", data),
  list: () => call("/resumes"),
  create: (data) => call("/resumes", "POST", data),
  update: (id, data) => call(`/resumes/${id}`, "PUT", data),
  remove: (id) => call(`/resumes/${id}`, "DELETE"),
};
