import { Rng } from "../rng";
import { PLATFORMS, SEGMENTS } from "../constants";
import {
  TOPICS,
  HOOK_TEMPLATES,
  CTA_TEMPLATES,
  HEADLINE_TEMPLATES,
  QUESTION_TEMPLATES,
  OBJECTION_TEMPLATES,
  IDEA_SHORT_TEMPLATES,
} from "../vocab";
import type { BankCategory, BankItem } from "../types";

const NUMBERS = ["3", "5", "7", "10"];

function fill(template: string, rng: Rng): string {
  return template
    .replace("{topic}", rng.pick(TOPICS))
    .replace("{n}", rng.pick(NUMBERS));
}

function buildCategory(
  category: BankCategory,
  templates: readonly string[],
  minCount: number,
  rng: Rng,
): BankItem[] {
  const items: BankItem[] = [];
  let idx = 0;

  while (items.length < minCount) {
    const template = templates[idx % templates.length];
    idx++;
    const text = fill(template, rng);
    items.push({
      id: `${category}-${items.length}`,
      category,
      text,
      platform: rng.pick(PLATFORMS),
      segment: rng.pick(SEGMENTS),
      performanceScore: rng.int(38, 99),
      usageCount: rng.int(0, 420),
      tags: rng.pickMany(SEGMENTS, rng.int(1, 2)).map((s) => s.toLowerCase()),
    });
  }

  return items;
}

export function generateBanks(seed: string | number = "banks-v1") {
  const rng = new Rng(seed);
  return {
    hooks: buildCategory("hook", HOOK_TEMPLATES, 520, rng),
    ctas: buildCategory("cta", CTA_TEMPLATES, 520, rng),
    headlines: buildCategory("headline", HEADLINE_TEMPLATES, 520, rng),
    questions: buildCategory("question", QUESTION_TEMPLATES, 520, rng),
    objections: buildCategory("objection", OBJECTION_TEMPLATES, 520, rng),
    ideas: buildCategory("idea", IDEA_SHORT_TEMPLATES, 520, rng),
  };
}

export const BANKS = generateBanks();
export const ALL_BANK_ITEMS: BankItem[] = [
  ...BANKS.hooks,
  ...BANKS.ctas,
  ...BANKS.headlines,
  ...BANKS.questions,
  ...BANKS.objections,
  ...BANKS.ideas,
];
