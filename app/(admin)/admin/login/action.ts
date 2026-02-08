"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { login } from "@/lib/auth"; // We just created this
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  // 1. Find user in DB
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return { error: "Invalid credentials." };
  }

  // 2. Verify Password
  const passwordsMatch = await compare(password, user.password);
  if (!passwordsMatch) {
    return { error: "Invalid credentials." };
  }

  // 3. Create Session & Redirect
  await login({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect("/admin");
}
