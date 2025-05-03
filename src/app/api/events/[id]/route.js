'use server'
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
    const eventid = context.params.id;
    const { status } = await req.json();

    const updatedEvent = await Event.findByIdAndUpdate(eventid, {
      status: status,
    });

    if (!updatedEvent) {
      return NextResponse.json({ message: `Event not found` }, { status: 404 });
    }

    return NextResponse.json(
      { fetchedEvent, message: `Event updated successfully` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to update event` },
      { status: 500 }
    );
  }
}
