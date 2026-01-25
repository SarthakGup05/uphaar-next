import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import { FloatingSocials } from "@/components/layout/FloatingSocials";


export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
          
            <Navbar />
            <FloatingSocials />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
