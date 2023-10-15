const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const secretKey = "YourSecretKey"; // Replace with a strong secret key

const hashPassword = async (password) => bcrypt.hash(password, saltRounds);
const comparePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

const createToken = (email, role) => jwt.sign({ email, role }, secretKey, { expiresIn: "1h" });
const jwtDecode = (token) => jwt.decode(token);

const validate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid Token or no token" });
  
  const data = jwtDecode(token);
  if (Math.round(new Date() / 1000) <= data.exp) return next();
  return res.status(401).json({ message: "Token Expired" });
};

const roleAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid Token or no token" });

  const data = jwtDecode(token);
  if (data.role === "Admin") return next();
  return res.status(401).json({ message: "Unauthorized! Only Admin can access" });
};

const authenticate = (token) => {
  const decode = jwtDecode(token);
  return Math.round(new Date() / 1000) <= decode.exp ? decode.email : "";
};

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  validate,
  roleAdmin,
  authenticate,
};
