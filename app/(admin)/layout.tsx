import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
            <AdminSidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 md:pl-0 w-full">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
                    {/* The mobile trigger is inside AdminSidebar, but we need a placeholder here or we relying on fixed position? 
                        Actually, my AdminSidebar has a FIXED trigger. Let's see if that works well. 
                        Ideally, we want the trigger HERE in the header flow for mobile.
                    */}
                </header>
                <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-6 mb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
