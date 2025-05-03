import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Message from "@/models/Message"; // Use ES6 import

export async function POST(req) {
  try {
    // Establish a connection to the database
    await connectDB();

    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    return NextResponse.json(
      { message: "Message Created Successfully", data: newMessage },
      { status: 201 } // 201 for resource creation
    );
  } catch (error) {
    console.error("Error creating message:", error);

    return NextResponse.json(
      { message: "Failed to create message", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Establish a connection to the database
    await connectDB();

    const messages = await Message.find();

    return NextResponse.json(
      { message: "Messages Fetched Successfully", data: messages },
      { status: 200 } // 200 for a successful GET request
    );
  } catch (error) {
    console.error("Error fetching messages:", error);

    return NextResponse.json(
      { message: "Failed to fetch messages", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    
    // Extract messageId from request body
    const { messageId } = await req.json();
    if (!messageId) {
      return NextResponse.json({ message: "Message ID is required" }, { status: 400 });
    }

    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    const updatedMessages = await Message.find(); // Fetch updated list after deletion

    return NextResponse.json({ message: "Message deleted successfully", data: updatedMessages }, { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ message: "Failed to delete message", error: error.message }, { status: 500 });
  }
}

