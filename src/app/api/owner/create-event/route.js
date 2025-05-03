import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
const Event = require("@/models/Event");
const jwt = require("jsonwebtoken");
const User = require("@/models/User");

export async function POST(req) {
  try {
    await connectDB();

    // Extract token from the Authorization header
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

    // Parse request body
    const body = await req.json();
    const {
      eventName,
      eventLocation,
      eventTimeFrom,
      eventTimeTo,
      eventDateFrom,
      eventDateTo,
      eventDescription,
      eventPrice,
      ticketAvailable,
      organizerName,
      eventCategory,
      eventPhoto,
    } = body;

    // Validate required fields
    if (
      !eventName ||
      !eventLocation ||
      !eventTimeFrom ||
      !eventTimeTo ||
      !eventDateFrom ||
      !eventDateTo ||
      !eventDescription ||
      !eventPrice ||
      !ticketAvailable ||
      !organizerName ||
      !eventCategory
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Handle eventPhoto - ensure it's a string
    let photoUrl = "";
    
    // If eventPhoto is an object (likely from file upload)
    if (eventPhoto && typeof eventPhoto === 'object') {
      // If it has a URL property (common in file upload results)
      if (eventPhoto.url) {
        photoUrl = eventPhoto.url;
      } else if (eventPhoto.secure_url) {
        // For Cloudinary and similar services
        photoUrl = eventPhoto.secure_url;
      } else if (eventPhoto.path) {
        // Some upload handlers return path
        photoUrl = eventPhoto.path;
      } else {
        // Fallback to a placeholder if no URL found
        photoUrl = "https://placeholder.com/events/default-event.jpg";
      }
    } else if (typeof eventPhoto === 'string') {
      // If it's already a string, use it directly
      photoUrl = eventPhoto;
    } else {
      // If eventPhoto is missing or invalid
      return NextResponse.json(
        { message: "Invalid event photo" },
        { status: 400 }
      );
    }

    // Create a new event
    const newEvent = new Event({
      eventName,
      eventLocation,
      eventTimeFrom,
      eventTimeTo,
      eventDateFrom,
      eventDateTo,
      eventDescription,
      eventPrice: Number(eventPrice), // Ensure it's a number
      ticketAvailable: Number(ticketAvailable), // Ensure it's a number
      organizerName,
      eventCategory,
      eventPhoto: photoUrl, // Use the extracted string URL
      uploadedBy: fetchedUser._id, // Use just the ID, not the whole user object
    });

    // Save the event to the database
    const savedEvent = await newEvent.save();
    
    // Update the user's eventsUploaded array
    fetchedUser.eventsUploaded.push(savedEvent._id);
    await fetchedUser.save();

    return NextResponse.json(
      { message: "Event created successfully", newEvent: savedEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);

    // Return a detailed error response for debugging
    return NextResponse.json(
      { 
        message: "Event creation failed", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}