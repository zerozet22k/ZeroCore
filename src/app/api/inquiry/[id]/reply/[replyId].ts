import { NextResponse } from "next/server";
import InquiryService from "@/services/InquiryService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { User } from "@/models/UserModel";
import { APP_PERMISSIONS, checkPermission } from "@/config/permissions";
import PusherService from "@/ThirdPartyServices/PusherService";

const inquiryService = new InquiryService();

async function handleDeleteReplyRequest(
  request: Request,
  user: User,
  params: { id: string; replyId: string }
) {
  try {
    const existingInquiry = await inquiryService.getInquiryById(params.id);
    if (!existingInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const reply = existingInquiry.replies.find(
      (r) => r._id.toString() === params.replyId
    );

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    const isOwner = reply.user_id.toString() === user._id.toString();

    if (
      !isOwner &&
      !checkPermission(user, [APP_PERMISSIONS.DELETE_ANY_INQUIRY])
    ) {
      return NextResponse.json(
        {
          error: "Forbidden: You do not have permission to delete this reply.",
        },
        { status: 403 }
      );
    }

    const updatedInquiry = await inquiryService.deleteReply(
      params.id,
      params.replyId
    );

    const pusherService = PusherService.getInstance();
    await pusherService.trigger("inquiries", "deleted-reply", {
      inquiry: updatedInquiry,
    });

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error("Error deleting reply:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const DELETE = async (
  request: Request,
  context: { params: { id: string; replyId: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleDeleteReplyRequest(req, user, context.params),
    true,
    [],
    false
  )(request);
