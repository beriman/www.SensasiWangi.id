import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const convexUrl = process.env.CONVEX_URL;
if (!convexUrl) {
  console.error("CONVEX_URL environment variable not set");
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

async function main() {
  try {
    const marketplace = await client.mutation(
      api.marketplace.initializeSampleData,
      {},
    );
    const courses = await client.mutation(
      api.courses.initializeAdvancedModules,
      {},
    );
    console.log({ marketplace, courses });
  } catch (err: any) {
    console.error("Failed to seed sample data:", err.message);
    process.exit(1);
  }
}

main();
