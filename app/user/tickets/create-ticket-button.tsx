"use client";

import { ActionButton } from "@/components/common/action-button";
import { MessageCircle } from "lucide-react";
import { createTicket } from "@/lib/actions/tickets";

export function CreateTicketButton() {
  return (
    <ActionButton
      action={async () =>
        await createTicket({
          subject: "Support Request",
          message: "I need help with my account.",
        })
      }
      loadingText="Creating..."
      refreshOnSuccess={true}
      className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow transition-transform duration-150 active:scale-95"
      icon={<MessageCircle className="w-4 h-4" />}
    >
      Open Chat
    </ActionButton>
  );
}

