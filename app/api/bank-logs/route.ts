import { getBankLogs } from "@/lib/data/bank-logs";
import { apiHandler } from "@/lib/utils/api-handler";
import { withErrorHandling } from "@/lib/utils/result";

/**
 * GET /api/bank-logs
 * Returns all available bank logs from the constant data
 * Supports optional query parameters for future server-side filtering
 */
export const GET = apiHandler(async (request) => {
  return await withErrorHandling(async () => {
    // Get all bank logs
    let bankLogs = getBankLogs();

    // Optional: Server-side filtering (for future use)
    // Currently, filtering is done client-side for better performance
    // But we can add server-side filtering here if needed

    // Extract query parameters if request is provided
    if (request) {
      const { searchParams } = new URL(request.url);

      const region = searchParams.get("region");
      const bank = searchParams.get("bank");
      const minPrice = searchParams.get("minPrice");
      const maxPrice = searchParams.get("maxPrice");
      const search = searchParams.get("search");

      if (region && region !== "All Regions") {
        bankLogs = bankLogs.filter((log) => log.region === region);
      }

      if (bank && bank !== "All Banks") {
        bankLogs = bankLogs.filter((log) => log.bank === bank);
      }

      if (minPrice) {
        const min = parseFloat(minPrice);
        bankLogs = bankLogs.filter((log) => log.price >= min);
      }

      if (maxPrice) {
        const max = parseFloat(maxPrice);
        bankLogs = bankLogs.filter((log) => log.price <= max);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        bankLogs = bankLogs.filter(
          (log) =>
            log.product.toLowerCase().includes(searchLower) ||
            log.description.toLowerCase().includes(searchLower) ||
            log.bank.toLowerCase().includes(searchLower)
        );
      }
    }

    return bankLogs;
  }, "Failed to fetch bank logs");
});

