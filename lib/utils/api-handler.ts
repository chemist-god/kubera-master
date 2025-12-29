import { NextRequest, NextResponse } from "next/server";
import { ActionResult } from "./result";

/**
 * Handles API route responses with consistent error handling
 */
export function handleApiResponse<T>(
  result: ActionResult<T>,
  options?: {
    successStatus?: number;
    errorStatus?: number;
  }
): NextResponse {
  const { successStatus = 200, errorStatus = 500 } = options || {};

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "An error occurred" },
      { status: errorStatus }
    );
  }

  return NextResponse.json({ data: result.data }, { status: successStatus });
}

/**
 * Wraps API route handler with error handling
 * Supports handlers with or without request parameter
 */
export function apiHandler<
  TReturn extends ActionResult<unknown>,
  TParams extends Record<string, string> = Record<string, string>
>(
  handler: (request?: NextRequest, context?: { params?: Promise<TParams> }) => Promise<TReturn>,
  options?: {
    successStatus?: number;
    errorStatus?: number;
  }
) {
  return async (
    request?: NextRequest,
    context?: { params?: Promise<TParams> }
  ): Promise<NextResponse> => {
    try {
      const result = await handler(request, context);
      return handleApiResponse(result, options);
    } catch (error) {
      console.error("API handler error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Parses request body with error handling
 */
export async function parseRequestBody<T = unknown>(
  request: NextRequest
): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error("Invalid request body");
  }
}

/**
 * Validates required fields in request body
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  body: T,
  fields: (keyof T)[]
): { valid: boolean; error?: string } {
  for (const field of fields) {
    if (!body[field] || (typeof body[field] === "string" && body[field].trim() === "")) {
      return { valid: false, error: `${String(field)} is required` };
    }
  }
  return { valid: true };
}

