import jwt from "jsonwebtoken";
import ErrorHandler from "./ErrorHandler.js";
import database from "./db.js";

export const isAuthenticated = async (req) => {
  const token = req.cookies?.get("token")?.value;
  if (!token) throw new ErrorHandler("Please login to access this resource.", 401);
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await database.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [decoded.id]);
  if (user.rows.length === 0) throw new ErrorHandler("User not found.", 404);
  return user.rows[0];
};

export const authorizeAdmin = (user) => {
  if (user.role !== "Admin") throw new ErrorHandler("Access denied. Admins only.", 403);
};
