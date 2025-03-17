import { NextResponse } from "next/server";
import InquiryService from "@/services/InquiryService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS, checkPermission } from "@/config/permissions";
import { User } from "@/models/UserModel";
import PusherService from "@/ThirdPartyServices/PusherService";

const inquiryService = new InquiryService();

async function handleGetInquiryByIdRequest(params: { id: string }) {
  try {
    const inquiry = await inquiryService.getInquiryById(params.id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleUpdateInquiryRequest(
  request: Request,
  user: User,
  params: { id: string }
) {
  try {
    const existingInquiry = await inquiryService.getInquiryById(params.id);
    if (!existingInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const isOwner = existingInquiry.user_id.toString() === user._id.toString();
    if (
      !isOwner &&
      !checkPermission(user, [APP_PERMISSIONS.EDIT_ANY_INQUIRY])
    ) {
      return NextResponse.json(
        { error: "Forbidden: You cannot edit this inquiry." },
        { status: 403 }
      );
    }

    const data = await request.json();
    const updatedInquiry = await inquiryService.updateInquiry(params.id, data);

    // Trigger Pusher event for inquiry update
    const pusherService = PusherService.getInstance();
    await pusherService.trigger("inquiries", "updated-inquiry", {
      inquiry: updatedInquiry,
    });

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleDeleteInquiryRequest(user: User, params: { id: string }) {
  try {
    const existingInquiry = await inquiryService.getInquiryById(params.id);
    if (!existingInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const isOwner = existingInquiry.user_id.toString() === user._id.toString();
    if (
      !isOwner &&
      !checkPermission(user, [APP_PERMISSIONS.DELETE_ANY_INQUIRY])
    ) {
      return NextResponse.json(
        { error: "Forbidden: You cannot delete this inquiry." },
        { status: 403 }
      );
    }

    await inquiryService.deleteInquiry(params.id);

    // Trigger Pusher event for inquiry deletion
    const pusherService = PusherService.getInstance();
    await pusherService.trigger("inquiries", "deleted-inquiry", {
      inquiryId: params.id,
    });

    return NextResponse.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleCloseInquiryRequest(user: User, params: { id: string }) {
  try {
    const closedInquiry = await inquiryService.closeInquiry(params.id);
    if (!closedInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Trigger Pusher event for inquiry closure
    const pusherService = PusherService.getInstance();
    await pusherService.trigger("inquiries", "closed-inquiry", {
      inquiry: closedInquiry,
    });

    return NextResponse.json(closedInquiry);
  } catch (error) {
    console.error("Error closing inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    () => handleGetInquiryByIdRequest(context.params),
    false
  )(request);

export const PUT = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleUpdateInquiryRequest(req, user, context.params),
    true,
    [APP_PERMISSIONS.EDIT_OWN_INQUIRY, APP_PERMISSIONS.EDIT_ANY_INQUIRY],
    false
  )(request);

export const DELETE = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleDeleteInquiryRequest(user, context.params),
    true,
    [APP_PERMISSIONS.DELETE_OWN_INQUIRY, APP_PERMISSIONS.DELETE_ANY_INQUIRY],
    false
  )(request);

export const PATCH = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleCloseInquiryRequest(user, context.params),
    true,
    [APP_PERMISSIONS.CLOSE_INQUIRY]
  )(request);
