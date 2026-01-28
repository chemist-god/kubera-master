import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, OrderItem } from "@/lib/api/types";
import { Eye, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <div className="w-full space-y-4">
      {orders.map((order: Order) => (
        <Link key={order.id} href={`/user/orders/${order.id}`}>
          <Card className={cn(
            "p-6 transition-all duration-200 cursor-pointer",
            "hover:shadow-lg hover:scale-[1.01] hover:border-primary/50",
            "active:scale-[0.99]"
          )}>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {order.receiptNumber && (
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {order.receiptNumber}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant="secondary"
                    className={cn(
                      order.status === 'Pending' && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                      order.status === 'Completed' && "bg-green-500/10 text-green-600 border-green-500/20",
                      order.status === 'Cancelled' && "bg-red-500/10 text-red-600 border-red-500/20",
                    )}
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                {order.items.slice(0, 3).map((item: OrderItem) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-xs text-muted-foreground italic">
                    +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary">
                  ${order.total.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>Click to view full receipt</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

