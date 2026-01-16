export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-muted/40 px-6 py-3">
                <h1 className="text-xl font-bold">Uphaar Admin</h1>
            </header>
            <div className="flex flex-1">
                <aside className="w-64 border-r bg-muted/20 p-4 hidden md:block">
                    <nav className="space-y-2">
                        <a href="/admin" className="block px-4 py-2 hover:bg-muted rounded-md">Dashboard</a>
                        <a href="/admin/products" className="block px-4 py-2 hover:bg-muted rounded-md">Products</a>
                        <a href="/admin/orders" className="block px-4 py-2 hover:bg-muted rounded-md">Orders</a>
                    </nav>
                </aside>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
