const { getPool } = require('./db');
const {
  signToken,
  verifyToken,
  hashPassword,
  comparePassword,
} = require('./auth');

exports.handler = async (event) => {
  const isHttpAPI = !!event.requestContext?.http;
  const path = isHttpAPI ? event.requestContext.http.path : event.path;
  const method = isHttpAPI ? event.requestContext.http.method : event.httpMethod;
  const headers = event.headers || {};
  const body = event.body ? JSON.parse(event.body) : {};

  try {
    if (path === "/auth/register" && method === "POST") {
      return await register(body);
    }
    if (path === "/auth/login" && method === "POST") {
      return await login(body);
    }

    const user = getAuthUser(headers);
    if (!user) return response(401, { message: "Unauthorized" });

    if (path === "/resumes" && method === "GET") {
      return await listResumes(user);
    }
    if (path === "/resumes" && method === "POST") {
      return await createResume(user, body);
    }

    const resumeId = getResumeId(path);
    if (resumeId && method === "PUT") {
      return await updateResume(user, resumeId, body);
    }
    if (resumeId && method === "DELETE") {
      return await deleteResume(user, resumeId);
    }

    return response(404, { message: "Not found" });

  } catch (e) {
    console.log(e);
    return response(500, { message: "Server error" });
  }
};

function getAuthUser(headers) {
  const auth = headers.Authorization || headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.split(" ")[1];
  return verifyToken(token);
}

async function register({ name, email, password }) {
  if (!name || !email || !password) return response(400, { message: "Missing data" });

  const hashed = await hashPassword(password);
  const pool = getPool();

  try {
    await pool.execute(
      "INSERT INTO users (name,email,password_hash) VALUES (?,?,?)",
      [name, email, hashed]
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return response(400, { message: "Email already exists" });
    throw err;
  }

  return response(201, { message: "Registered" });
}

async function login({ email, password }) {
  const pool = getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email=?",
    [email]
  );
  if (!rows.length) return response(401, { message: "Invalid credentials" });

  const user = rows[0];
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) return response(401, { message: "Invalid password" });

  return response(200, {
    token: signToken(user),
    user: { id: user.id, email: user.email, name: user.name }
  });
}

async function listResumes(user) {
  const pool = getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM resumes WHERE user_id=? ORDER BY updated_at DESC",
    [user.id]
  );
  return response(200, rows);
}

async function createResume(user, { title, template, data }) {
  if (!title || !data) return response(400, { message: "Missing fields" });

  const pool = getPool();
  await pool.execute(
    "INSERT INTO resumes (user_id,title,template,data_json,created_at,updated_at) VALUES (?,?,?,?,NOW(),NOW())",
    [user.id, title, template || "modern", JSON.stringify(data)]
  );
  return response(201, { message: "Resume created" });
}

async function updateResume(user, id, { title, template, data }) {
  const pool = getPool();
  const [res] = await pool.execute(
    "UPDATE resumes SET title=?,template=?,data_json=?,updated_at=NOW() WHERE id=? AND user_id=?",
    [title, template, JSON.stringify(data), id, user.id]
  );

  if (res.affectedRows === 0) return response(404, { message: "Not found" });

  return response(200, { message: "Updated" });
}

async function deleteResume(user, id) {
  const pool = getPool();
  const [res] = await pool.execute(
    "DELETE FROM resumes WHERE id=? AND user_id=?",
    [id, user.id]
  );
  if (res.affectedRows === 0) return response(404, { message: "Not found" });

  return response(200, { message: "Deleted" });
}

function getResumeId(path) {
  const parts = path.split("/");
  if (parts.length === 3 && parts[1] === "resumes") {
    return parseInt(parts[2], 10);
  }
  return null;
}

function response(code, body) {
  return {
    statusCode: code,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*"
    },
    body: JSON.stringify(body)
  };
}

