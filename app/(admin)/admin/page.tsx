export default function AdminDashboard() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
                    <div className="text-2xl font-bold">₹12,450</div>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Active Orders</div>
                    <div className="text-2xl font-bold">12</div>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Products in Stock</div>
                    <div className="text-2xl font-bold">24</div>
                </div>
            </div>
        </div>
    );
}
