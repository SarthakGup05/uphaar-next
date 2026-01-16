"use client";

import { ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store"; // Import the store

export function CartSheet() {
  // Access state and actions from the store
  const { items, removeItem, total } = useCartStore();
  
  const cartTotal = total(); // Calculate total price

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const phoneNumber = "919876543210"; // REPLACE with actual number
    let message = "Hello! I would like to order:\n\n";
    
    items.forEach(item => {
      // Create a nice list: "2x Ocean Tray - ₹2400"
      message += `▪️ ${item.quantity}x ${item.title} - ₹${item.price * item.quantity}\n`;
    });
    
    message += `\n*Total Estimate: ₹${cartTotal.toLocaleString()}*`;
    message += `\n\nPlease confirm availability and shipping details.`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:text-primary">
          <ShoppingBag className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white animate-in zoom-in">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-md">
        <SheetHeader className="px-1">
          <SheetTitle className="font-serif text-2xl text-primary">Your Cart</SheetTitle>
        </SheetHeader>
        
        <Separator className="my-4" />

        {items.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-1 flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <ShoppingBag className="h-12 w-12 opacity-20 mb-4" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm">Looks like you haven't added any unique handcrafted items yet.</p>
          </div>
        ) : (
          // FILLED STATE
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border border-stone-100 bg-stone-50">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <h4 className="font-serif text-sm font-medium line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          ₹{item.price.toLocaleString()} x {item.quantity}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
                <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                <span className="font-serif text-2xl font-bold text-foreground">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>
              <Button 
                onClick={handleWhatsAppCheckout} 
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12 text-base shadow-lg shadow-green-500/20"
              >
                Order via WhatsApp
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-3">
                Checkout will open WhatsApp with your pre-filled order details.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}