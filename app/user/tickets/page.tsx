import { getTickets } from "@/lib/actions/tickets";
import { TicketsList } from "./tickets-list";
import { SupportChatPanel } from "./support-chat-panel";

export default async function TicketsPage() {
  const result = await getTickets();
  const tickets = result.success && result.data ? result.data : [];

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Support Chat</h1>
          <p className="text-muted-foreground text-lg font-light">Get help from our support team</p>
        </div>

        <div className="space-y-8">
          <SupportChatPanel />
          {tickets.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Previous Conversations</h2>
                <span className="text-xs text-muted-foreground">
                  {tickets.length} ticket{tickets.length === 1 ? "" : "s"}
                </span>
              </div>
              <TicketsList tickets={tickets} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
