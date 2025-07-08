import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/connectDB';
const User = require('@/models/User');
const jwt = require("jsonwebtoken");
export async function POST(req) {
  try {
    await connectDB(); // Ensure MongoDB connection

    const { name, email, password, role } = await req.json(); 

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    // Create JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, "secret", {
      expiresIn: "1h",
    });

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}

// export async function POST(req) {
//   try {
//     await connectDB();

//     const { name, email, password, role } = await req.json(); // Parse directly
//     if (!name || !email || !password || !role) {
//       return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ message: 'User already exists' }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const user = new User({ name, email, password: hashedPassword, role });
//     await user.save();

//     // Create JWT token
//         const token = jwt.sign({ id: user._id, email: user.email }, "secret", {
//           expiresIn: "1h",
//         });
    
//         return NextResponse.json({ user, token },{status: 200});
//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
//   }
// }
