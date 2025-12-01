const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

async function hashPassword(pass) {
  return bcrypt.hash(pass, 10);
}

async function comparePassword(pass, hashed) {
  return bcrypt.compare(pass, hashed);
}

module.exports = {
  signToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
