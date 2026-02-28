import { NextResponse } from "next/server";
export const errorResponse = (message, statusCode = 500) => {
  return NextResponse.json({ success: false, message }, { status: statusCode });
};
