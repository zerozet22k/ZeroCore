import { NextResponse } from "next/server";
import InquiryService from "@/services/InquiryService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS, checkPermission } from "@/config/permissions";
import { User } from "@/models/UserModel";
import PusherService from "@/ThirdPartyServices/PusherService";

const inquiryService = new InquiryService();

async function handleAddReplyRequest(
  request: Request,
  user: User,
  params: { id: string }
) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Missing required field (text)" },
        { status: 400 }
      );
    }

    const existingInquiry = await inquiryService.getInquiryById(params.id);
    console.log('u smoking',params.id)
    if (!existingInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const isOwner = existingInquiry.user_id.toString() === user._id.toString();
    if (
      !isOwner &&
      !checkPermission(user, [APP_PERMISSIONS.REPLY_TO_ANY_INQUIRY])
    ) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not have permission to reply to this inquiry.",
        },
        { status: 403 }
      );
    }

    const updatedInquiry = await inquiryService.addReply(params.id, {
      text,
      user_id: user._id,
    });
    const pusherService = PusherService.getInstance();
    await pusherService.trigger("inquiries", "new-reply", {
      inquiry: updatedInquiry,
    });

    return NextResponse.json(updatedInquiry, { status: 201 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleAddReplyRequest(req, user, context.params),
    true,
    [],
    false
  )(request);
