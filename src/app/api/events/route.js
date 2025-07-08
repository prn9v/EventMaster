import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Event from "@/models/Event"; // Use ES6 import

export async function GET(req) {
  try {
    // Establish a connection to the database
    await connectDB();

    // Fetch all events from the database
    const events = await Event.find();

    if (!events || events.length === 0) {
      return NextResponse.json(
        { events: [], message: "No events found" },
        { status: 200 }
      );
    }

    // Respond with the fetched events
    return NextResponse.json(
      { events, message: "Events fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Log the error for debugging purposes (avoid exposing sensitive details in production)
    console.error("Error fetching events:", error);

    return NextResponse.json(
      { message: "Failed to fetch events", error: error.message }, // Include error message optionally
      { status: 500 }
    );
  }
}
