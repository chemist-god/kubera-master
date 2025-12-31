import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/lib/api/types";

export function TicketsList({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="w-full space-y-4">
      {tickets.map((ticket: Ticket) => (
        <Card key={ticket.id} className="p-6">
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{ticket.subject}</h3>
              <Badge variant="secondary">{ticket.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{ticket.message}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

