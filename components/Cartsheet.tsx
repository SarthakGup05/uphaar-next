import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export function CartSheet() {
  // MOCK DATA - Later you will replace this with Zustand/Context state
  const cartItems = [
    {
      id: 1,
      name: "Ocean Blue Resin Tray",
      price: 1200,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 3,
      name: "Lavender Soy Candle",
      price: 850,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=200",
    }
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "919999999999"; // Replace with client number
    let message = "Hello! I would like to order:\n\n";
    cartItems.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.name} - ₹${item.price}\n`;
    });
    message += `\n*Total: ₹${total}*`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:text-primary">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
            {cartItems.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-md">
        <SheetHeader className="px-1">
          <SheetTitle className="font-serif text-2xl text-primary">Your Cart</SheetTitle>
        </SheetHeader>
        
        <Separator className="my-4" />

        {/* Scrollable Cart Items */}
        <ScrollArea className="flex-1 pr-4">
          <div className="flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-md border border-stone-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">₹{item.price * item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer with Total & Checkout */}
        <div className="mt-auto pr-6 pt-6 mb-6">
          <Separator className="mb-4" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Subtotal</span>
            <span className="font-serif text-xl font-bold">₹{total}</span>
          </div>
          <Button 
            onClick={handleWhatsAppCheckout} 
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold"
          >
            Order via WhatsApp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}