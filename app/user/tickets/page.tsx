import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { getTickets } from "@/lib/actions/tickets";
import { TicketsList } from "./tickets-list";
import { CreateTicketButton } from "./create-ticket-button";

export default async function TicketsPage() {
  const result = await getTickets();
  const tickets = result.success && result.data ? result.data : [];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-2xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2">Support Chat</h1>
        <p className="mb-8 text-muted-foreground">Get help from our support team</p>
        {tickets.length === 0 ? (
          <>
            <Card className="p-12 flex flex-col items-center w-full mb-6">
              <CardContent className="flex flex-col items-center">
                <svg width="48" height="48" fill="none" className="mb-4 text-primary"><rect width="48" height="48" rx="12" fill="var(--card)"/><circle cx="24" cy="24" r="12" stroke="#0ea5e9" strokeWidth="2"/></svg>
                <span className="text-xl font-semibold mb-2">No Active Chat</span>
                <span className="mb-4 text-muted-foreground">Support chat available</span>
                <CreateTicketButton />
              </CardContent>
            </Card>
            <Card className="p-8 flex flex-col items-center w-full">
              <CardContent className="flex flex-col items-center">
                <span className="text-lg font-semibold mb-2">Need Help?</span>
                <span className="mb-4 text-muted-foreground">Click "Open Chat" to start a conversation with our support team.</span>
                <CreateTicketButton />
              </CardContent>
            </Card>
          </>
        ) : (
          <TicketsList tickets={tickets} />
        )}
      </div>
    </main>
  );
}
