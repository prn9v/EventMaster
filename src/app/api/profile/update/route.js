import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
const User = require("@/models/User");

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json(); // Parse the JSON body
    const { userId, name, description, profilePhoto } = body;

    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

    user.name = name || user.name;
    user.description = description || user.description;
    user.photo = profilePhoto || user.photo;

    await user.save();

    return NextResponse.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}
