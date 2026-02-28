import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const sendToken = (user, statusCode, message) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const res = NextResponse.json({ success: true, user, message, token }, { status: statusCode });
  res.cookies.set("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    path: "/",
    sameSite: "lax",
  });
  return res;
};
