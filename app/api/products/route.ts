import { NextRequest } from "next/server";
import { getProducts, createProduct } from "@/lib/actions/products";
import { apiHandler, parseRequestBody, validateRequiredFields } from "@/lib/utils/api-handler";

export const GET = apiHandler(async () => {
  return await getProducts();
});

export const POST = apiHandler(async (request?: NextRequest) => {
  if (!request) {
    return { success: false, error: "Request is required" };
  }
  const body = await parseRequestBody<{
    name: string;
    price: number;
    balance: number;
    region: string;
    bank: string;
    type: string;
    status?: string;
    description?: string;
  }>(request);

  const validation = validateRequiredFields(body, ["name", "price", "balance", "region", "bank", "type"]);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  return await createProduct(body);
}, { successStatus: 201 });
