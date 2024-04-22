import { connectDB } from "@/db/db";
import User from "@/models/user.model.mjs";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
connectDB();


export async function getData(req: NextRequest) { 
    try {
        const token = req.cookies.get('token')?.value || ""
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as any;
        return decoded.id
    } catch (error:any) {
        throw new Error(error.message)
    }
}