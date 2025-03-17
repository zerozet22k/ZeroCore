import { NextResponse } from "next/server";

const handleError = (error: any, message = "Internal Server Error") => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status: 500 });
};
