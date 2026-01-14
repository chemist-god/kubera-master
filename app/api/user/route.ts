import { NextRequest } from "next/server";
import { getCurrentUser, updateUserProfile } from "@/lib/actions/user";
import { apiHandler, parseRequestBody, validateRequiredFields } from "@/lib/utils/api-handler";

export const GET = apiHandler(async () => {
  return await getCurrentUser();
});

export const PUT = apiHandler(async (request?: NextRequest) => {
  if (!request) {
    return { success: false, error: "Request is required" };
  }

  const body = await parseRequestBody<{ username: string; email: string }>(request);
  const validation = validateRequiredFields(body, ["username", "email"]);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  return await updateUserProfile({ username: body.username, email: body.email });
});
