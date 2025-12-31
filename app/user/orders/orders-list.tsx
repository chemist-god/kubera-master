import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, OrderItem } from "@/lib/api/types";

export function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <div className="w-full space-y-4">
      {orders.map((order: Order) => (
        <Card key={order.id} className="p-6">
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="secondary">{order.status}</Badge>
            </div>
            <div className="space-y-2">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary">
                ${order.total.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

