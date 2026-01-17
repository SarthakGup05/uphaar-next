import { config } from "dotenv";
import { users } from "@/lib/db/schema";
import { hash } from "bcryptjs";

// 1. Load environment variables BEFORE importing the DB connection
config({ path: ".env" });
async function main() {
  console.log("🌱 Seeding database...");

  const { db } = await import("@/lib/db");

  // 1. Define your admin credentials
  const password = await hash("Niharika@123", 12); // Change "admin123" to your desired password

  // 2. Insert into the DB
  try {
    await db.insert(users).values({
      name: "Niharika",
      email: "uphaarbyniharika@gmail.com", // Your email
      password: password,
      role: "admin",
    });
    console.log("✅ Admin user created successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }

  process.exit(0);
}

main();