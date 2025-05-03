const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('@/models/User')
import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";

export async function POST(req) {
     await connectDB();
     const { email, password } = await req.json(); // Parse directly
    if ( !email || !password ) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" },{status: 400}) ;
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Invalid credentials" },{status: 400});
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, "secret", {
      expiresIn: "1h",
    });

    return NextResponse.json({ user, token },{status: 200});
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong", error },{status:500});
  }

}