import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { User } from "@/models/UserModel";

const userService = new UserService();

const ALLOWED_STUDENT_FIELDS = ["name", "username", "email", "password", "bio"];

async function handleGetUserProfileRequest(
  request: Request,
  user: User | null
) {
  try {
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleUpdateUserProfileRequest(
  request: Request,
  user: User | null
) {
  try {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingUser = await userService.getUserById(user._id.toString());

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    const updateData: Partial<User> = Object.fromEntries(
      Object.entries(body).filter(([key]) =>
        ALLOWED_STUDENT_FIELDS.includes(key)
      )
    );

    const updatedUser = await userService.updateUser(
      user._id.toString(),
      updateData
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 400 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    (req, user) => handleGetUserProfileRequest(req, user),
    true
  )(request);

export const PUT = async (request: Request) =>
  withAuthMiddleware(
    (req, user) => handleUpdateUserProfileRequest(req, user),
    true
  )(request);
