import { connectDB } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function GET(req: NextRequest) { 
    try {
        
        const response = NextResponse
        .json(
            {
                message: "log out successful",
                success: true,
            }
        )
        response.cookies.set("token", "", {
          httpOnly: true,
          expires: new Date(0),
        });
return response
    } catch (error:any) {
        return NextResponse.json(error.message)
    }
}
