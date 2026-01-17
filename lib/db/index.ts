import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);

// This 'db' variable is what you will use to run queries
export const db = drizzle(sql, { schema });