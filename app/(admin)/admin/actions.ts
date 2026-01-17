"use server";

import { db } from "@/lib/db";
import { orders, products, users } from "@/lib/db/schema";
import { count, desc, eq, sql, sum } from "drizzle-orm";

export async function getDashboardStats() {
  const [revenueResult] = await db
    .select({ total: sum(orders.totalAmount) })
    .from(orders);
  
  const [ordersResult] = await db
    .select({ count: count() })
    .from(orders);

  const [productsResult] = await db
    .select({ count: count() })
    .from(products);

  const [usersResult] = await db
    .select({ count: count() })
    .from(users);

  const totalRevenue = Number(revenueResult?.total) || 0;
  const totalOrders = ordersResult?.count || 0;
  const totalProducts = productsResult?.count || 0;
  const totalUsers = usersResult?.count || 0;

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
  };
}

export async function getRecentSales() {
  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  return recentOrders;
}

export async function getRevenueChartData() {
  // Calculate date 6 months ago
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const result = await db
    .select({
      month: sql<string>`TO_CHAR(${orders.createdAt}, 'Mon')`,
      revenue: sum(orders.totalAmount),
    })
    .from(orders)
    .where(sql`${orders.createdAt} >= ${sixMonthsAgo}`)
    .groupBy(sql`TO_CHAR(${orders.createdAt}, 'Mon'), DATE_TRUNC('month', ${orders.createdAt})`)
    .orderBy(sql`DATE_TRUNC('month', ${orders.createdAt}) ASC`);

  return result.map((row) => ({
    month: row.month,
    revenue: Number(row.revenue),
  }));
}

