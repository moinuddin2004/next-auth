import { connectDB } from "@/db/db";
import User from "@/models/user.model.mjs";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
connectDB();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!existingUser.isVerified) {
      return NextResponse.json({ error: "User not verified" }, { status: 401 });
    }
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
        {
            id: existingUser._id,
            email: existingUser.email,
            username: existingUser.username,
        },
      process.env.TOKEN_SECRET!,
      {
        expiresIn: "1d",
      }
    );
    const response = NextResponse.json({
      message: "log in successful",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    return NextResponse.json(error.message);
  }
}
