import connectDB from "@/lib/connectDB";
const User = require("@/models/User");
import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");

export async function GET(req) {
  try {
    // Get token from request headers (more typical for API routes)
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (token) {
      const decodedToken = jwt.verify(token, "secret");
      const email = decodedToken.email;
      const fetchedUser = await User.findOne({ email });

      if (fetchedUser) {
        return NextResponse.json({ fetchedUser, isLoggedIn: true }, { status: 200 });
      } else {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ message: "No token provided" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error decoding token or fetching user:", error);
    return NextResponse.json({ message: "User cannot be fetched" }, { status: 500 });
  }
}
