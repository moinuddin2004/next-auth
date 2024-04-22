import { connectDB } from "@/db/db";
import User from "@/models/user.model.mjs";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function POST(req: NextRequest) { 
    try {
        const {token}= await req.json();
      const user = await User.findOne({
        verifyToken: token,
        verifyTokenExpiry: { $gt: Date.now() },
      });

       console.log(user+"iiiiiiii");
        if (!user) {
            return NextResponse.json({error:"Invalid token!!!"}, {status:400})
        }
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({message:"User verified successfully"}, {status:200})
        
    } catch (error:any) {
        throw new Error(error.message);
    }
}