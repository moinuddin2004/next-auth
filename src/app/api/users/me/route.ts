import { connectDB } from "@/db/db";
import User from "@/models/user.model.mjs";
import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/helper/getData";
connectDB();

export async function GET(req: NextRequest) { 
    try {
        const userId = await getData(req)
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json({ data: user, message: "user found" });
    } catch (error:any) {
        throw new Error(error.message);
    }
}