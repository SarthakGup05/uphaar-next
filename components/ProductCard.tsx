import Image from "next/image";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductProps {
  title: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductCard({ title, category, price, image }: ProductProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg border border-border/50">
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Quick Add Button */}
        <Button 
            size="icon" 
            className="absolute bottom-4 right-4 translate-y-12 shadow-md transition-all duration-300 group-hover:translate-y-0 rounded-full"
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        {/* Category Badge */}
        <Badge variant="secondary" className="absolute left-3 top-3 bg-white/90 text-xs backdrop-blur-sm hover:bg-white/90">
          {category}
        </Badge>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-serif text-lg text-foreground truncate">{title}</h3>
        <p className="text-sm font-medium text-secondary">₹{price.toLocaleString()}</p>
      </div>
    </div>
  );
}