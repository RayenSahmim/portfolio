import {  NextResponse , NextRequest } from "next/server";
import connectDB from "@/lib/ConnectMongo";
import { MessageModel } from "@/models/message";
export async function POST(req : NextRequest) {
  try {

    await connectDB();
    const body = await req.json();
    const { username , email , message } = body;
    // Create a new ChatSession with a reference to the AiConversation message
    const messageType = new MessageModel({
      username,
      email,
      message
    });
    // Save the session
    await messageType.save();
    console.log('Message saved:', { username, email, message: message.substring(0, 50) + '...' });
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Message sent successfully!" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

