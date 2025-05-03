import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
const User = require("@/models/User");
const Event = require("@/models/Event");
const jwt = require("jsonwebtoken");

export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // Verify token and decode it
    const decodedToken = jwt.verify(token, "secret");
    const email = decodedToken.email;

    // Fetch user from the database
    const fetchedUser = await User.findOne({ email });
    if (!fetchedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch events using the IDs in fetchedUser.eventsUploaded
    const events = await Event.find({ _id: { $in: fetchedUser.eventsUploaded } });

    return NextResponse.json(
      { message: "Events Fetched Successfully", events },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);

    // Return a detailed error response for debugging
    return NextResponse.json(
      { message: "Error while fetching events", error: error.message },
      { status: 500 }
    );
  }
}
