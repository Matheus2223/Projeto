"use server";

import { createCompetitor } from "@/lib/api/fetchers";
import type { Platform } from "@/lib/data/constants";

export async function createCompetitorAction(input: {
  name: string;
  handle: string;
  platforms: Platform[];
  segment: string;
}) {
  return createCompetitor(input);
}
