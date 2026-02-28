export const generateEmailTemplate = (resetPasswordUrl) => {
  return 
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#000;color:#fff;border-radius:8px;">
  <h2 style="text-align:center;">Reset Your Password</h2>
  <p style="color:#ccc;">Click the button below to reset your password:</p>
  <div style="text-align:center;margin:20px 0;">
  <a href="${resetPasswordUrl}" style="background:#fff;color:#000;padding:12px 20px;border-radius:5px;font-weight:bold;text-decoration:none;">Reset Password</a>
  </div>
  <p style="color:#ccc;">Link expires in 15 minutes.</p>
  <p style="color:#fff;word-wrap:break-word;">${resetPasswordUrl}</p>
  </div>;
};
