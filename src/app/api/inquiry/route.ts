import { NextResponse } from "next/server";
import InquiryService from "@/services/InquiryService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { User } from "@/models/UserModel";
import PusherService from "@/ThirdPartyServices/PusherService";


const inquiryService = new InquiryService();

async function handleGetAllInquiriesRequest(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const { inquiries, total } = await inquiryService.getAllInquiries(
      searchQuery,
      page,
      limit
    );

    return NextResponse.json({ inquiries, total });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleCreateInquiryRequest(request: Request, user: User) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Missing required field (text)" },
        { status: 400 }
      );
    }

    const newInquiry = await inquiryService.createInquiry({
      text,
      user_id: user._id,
    });

    const pusherService = PusherService.getInstance();
    await pusherService.trigger("inquiries", "new-inquiry", {
      inquiry: newInquiry,
    });

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    () => handleGetAllInquiriesRequest(request),
    false
  )(request);

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (req, user) => handleCreateInquiryRequest(req, user),
    true
  )(request);
