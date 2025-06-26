/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as bookmarks from "../bookmarks.js";
import type * as certificates from "../certificates.js";
import type * as courses from "../courses.js";
import type * as crons from "../crons.js";
import type * as follows from "../follows.js";
import type * as forum from "../forum.js";
import type * as marketplace from "../marketplace.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as points from "../points.js";
import type * as progress from "../progress.js";
import type * as rewards from "../rewards.js";
import type * as search from "../search.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  bookmarks: typeof bookmarks;
  certificates: typeof certificates;
  courses: typeof courses;
  crons: typeof crons;
  follows: typeof follows;
  forum: typeof forum;
  marketplace: typeof marketplace;
  messages: typeof messages;
  notifications: typeof notifications;
  points: typeof points;
  progress: typeof progress;
  rewards: typeof rewards;
  search: typeof search;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
