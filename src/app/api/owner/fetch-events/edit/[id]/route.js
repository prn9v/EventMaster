import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
const Event = require("@/models/Event");

export async function GET(req, context) {
  try {
    await connectDB();
    const eventid = context.params.id;

    const fetchedEvent = await Event.findOne({ _id: eventid });

    if (!fetchedEvent) {
      return NextResponse.json({ message: `Event not found` }, { status: 404 });
    }

    return NextResponse.json(
      { fetchedEvent, message: `Event fetched successfully` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to fetch event` },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = context.params; // Access `id` from context

    const {
      eventName,
      eventDateFrom,
      eventDateTo,
      eventTimeFrom,
      eventTimeTo,
      eventLocation,
      eventCategory,
      eventDescription,
      eventPrice,
      ticketAvailable,
      eventPhoto,
    } = body;

    const fetchedEvent = await Event.findOne({ _id: id });

    if (!fetchedEvent) {
      return NextResponse.json({ message: `Event not found` }, { status: 404 });
    }

    // Update only fields that are provided
    fetchedEvent.eventName = eventName || fetchedEvent.eventName;
    fetchedEvent.eventDateFrom = eventDateFrom || fetchedEvent.eventDateFrom;
    fetchedEvent.eventDateTo = eventDateTo || fetchedEvent.eventDateTo;
    fetchedEvent.eventLocation = eventLocation || fetchedEvent.eventLocation;
    fetchedEvent.eventCategory = eventCategory || fetchedEvent.eventCategory;
    fetchedEvent.eventDescription =
      eventDescription || fetchedEvent.eventDescription;
    fetchedEvent.eventPrice = eventPrice || fetchedEvent.eventPrice;
    fetchedEvent.ticketAvailable =
      ticketAvailable || fetchedEvent.ticketAvailable;
    fetchedEvent.eventPhoto = eventPhoto || fetchedEvent.eventPhoto;

    await fetchedEvent.save();

    return NextResponse.json(
      { message: "Event updated successfully", fetchedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Failed to update event" },
      { status: 500 }
    );
  }
}
