import { connectDB } from "@/db/db";
import User from "@/models/user.model.mjs";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helper/mailer";
connectDB();

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const user = await User.create({ username, email, password: hashedPassword });
      console.log(user);
      
    if (!user) {
      return NextResponse.json(
        { error: "Error creating user" },
        { status: 500 }
      );
      }
      
      await sendEmail({email,emailType:"VERIFY",userId:user._id});

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
