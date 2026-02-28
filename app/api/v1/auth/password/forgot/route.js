import { NextResponse } from "next/server";
import database from "@/lib/db";
import { generateResetPasswordToken } from "@/lib/generateResetPasswordToken";
import { generateEmailTemplate } from "@/lib/generateEmailTemplate";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    const { email, frontendUrl } = await req.json();
    const userResult = await database.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0)
      return NextResponse.json({ success: false, message: "User not found with this email." }, { status: 404 });
    const user = userResult.rows[0];
    const { hashedToken, resetPasswordExpireTime, resetToken } = generateResetPasswordToken();
    await database.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expire = to_timestamp($2) WHERE email = $3",
      [hashedToken, resetPasswordExpireTime / 1000, email]
    );
    const resetPasswordUrl = `${frontendUrl || process.env.NEXT_PUBLIC_APP_URL}/password/reset/${resetToken}`;
    const message = generateEmailTemplate(resetPasswordUrl);
    try {
      await sendEmail({ email: user.email, subject: "Ecommerce Password Recovery", message });
      return NextResponse.json({ success: true, message: `Email sent to ${user.email} successfully.` });
    } catch (err) {
      await database.query("UPDATE users SET reset_password_token = NULL, reset_password_expire = NULL WHERE email = $1", [email]);
      return NextResponse.json({ success: false, message: "Email could not be sent." }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
