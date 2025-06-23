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
    const result = await client.mutation(
      api.marketplace.initializeSampleData,
      {},
    );
    console.log(result);
  } catch (err: any) {
    console.error("Failed to seed sample data:", err.message);
    process.exit(1);
  }
}

main();
