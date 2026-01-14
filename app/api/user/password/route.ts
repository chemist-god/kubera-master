import { NextRequest } from "next/server";
import { updateUserPassword } from "@/lib/actions/user";
import { apiHandler, parseRequestBody, validateRequiredFields } from "@/lib/utils/api-handler";

export const POST = apiHandler(async (request?: NextRequest) => {
  if (!request) {
    return { success: false, error: "Request is required" };
  }

  const body = await parseRequestBody<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>(request);
  const validation = validateRequiredFields(body, [
    "currentPassword",
    "newPassword",
    "confirmPassword",
  ]);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  return await updateUserPassword({
    currentPassword: body.currentPassword,
    newPassword: body.newPassword,
    confirmPassword: body.confirmPassword,
  });
});
