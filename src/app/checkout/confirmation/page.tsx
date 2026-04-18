import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <CheckCircle className="h-20 w-20 text-green-500" />
      <div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        {orderId && (
          <p className="text-muted-foreground mt-1">Order #{orderId}</p>
        )}
        <p className="text-muted-foreground mt-2">
          Thank you for your purchase. Your order is being processed.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/orders"><Button variant="outline">View My Orders</Button></Link>
        <Link href="/"><Button>Continue Shopping</Button></Link>
      </div>
    </div>
  );
}
