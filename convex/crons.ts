import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "expire-unpaid-orders",
  { hourUTC: 0, minuteUTC: 0 },
  internal.marketplace.expireUnpaidOrders,
);

crons.daily(
  "refresh-all-shipments",
  { hourUTC: 0, minuteUTC: 10 },
  internal.marketplace.refreshAllShipments,
);

crons.weekly(
  "update-weekly-leaderboard",
  { dayOfWeek: "monday", hourUTC: 0, minuteUTC: 5 },
  internal.rewards.updateWeeklyLeaderboard,
);

export default crons;
