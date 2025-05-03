import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Event from "@/models/Event";
import User from "@/models/User";

export async function POST(req, context) {
  try {
    // Connect to the database
    await connectDB();

    // Get the event ID from the URL params
    const eventId = context.params.id;

    // Parse the request body
    const { userId } = await req.json();

    // Fetch the event and user
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    // Log for debugging
    console.log("event is: ", event);
    console.log("user is: ", user);

    // Check if event or user exists
    if (!event || !user) {
      return NextResponse.json(
        { message: "Event or User not found" },
        { status: 404 }
      );
    }

    // Check if tickets are available
    if (event.ticketsSold >= event.ticketsAvailable) {
      return NextResponse.json(
        { message: "No tickets available" },
        { status: 400 }
      );
    }

    // Check if the user has already booked the event
    if (user.eventsBooked.includes(event._id.toString())) {
      return NextResponse.json(
        { message: "Event already booked by the user" },
        { status: 400 }
      );
    }

    // Update the user's eventsBooked and the event's bookedBy
    user.eventsBooked.push(event._id);
    event.bookedBy.push(user._id);
    event.ticketsSold += 1;

    // Save the changes
    await user.save();
    await event.save();

    // Return success response
    return NextResponse.json({
      message: "Event booked successfully",
      event,
      user,
    });
  } catch (error) {
    console.error("Error booking event:", error);
    return NextResponse.json(
      { message: "Failed to book event", error: error.message },
      { status: 500 }
    );
  }
}
