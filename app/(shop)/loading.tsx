import Image from "next/image";

export default function Loading() {
    return (
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-6 bg-background">
            <div className="relative h-24 w-48 animate-pulse opacity-90">
                <Image
                    src="/logo.png"
                    alt="Uphaar Loading..."
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
            </div>
        </div>
    );
}
