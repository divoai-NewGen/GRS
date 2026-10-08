import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const acceptHeader = request.headers.get("accept") || "";
  const isJson = acceptHeader.includes("application/json") && !acceptHeader.includes("text/html");

  const response = isJson
    ? NextResponse.json({ success: true, message: "Logged out" })
    : NextResponse.redirect(new URL("/", request.url), 303);

  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return response;
}
