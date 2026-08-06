import { Rng } from "../rng";
import { PLATFORMS, SEGMENTS, CONTENT_FORMATS } from "../constants";
import { TOPICS, HASHTAG_POOL, HOOK_TEMPLATES, CTA_TEMPLATES } from "../vocab";
import type { PostItem } from "../types";

const GRADIENTS = [
  "from-violet-500 to-indigo-500",
  "from-cyan-400 to-blue-500",
  "from-fuchsia-500 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-red-500",
  "from-sky-400 to-indigo-500",
  "from-purple-500 to-fuchsia-500",
];

const STATUSES: PostItem["status"][] = ["rascunho", "agendado", "publicado"];

export function generatePosts(count: number, seed: string | number = "posts-v1"): PostItem[] {
  const rng = new Rng(seed);
  const now = Date.now();
  const posts: PostItem[] = [];

  for (let i = 0; i < count; i++) {
    const topic = rng.pick(TOPICS);
    const hook = rng.pick(HOOK_TEMPLATES).replace("{topic}", topic);
    const cta = rng.pick(CTA_TEMPLATES).replace("{topic}", topic);
    const status = rng.pick(STATUSES);
    const offsetDays = status === "publicado" ? -rng.int(0, 20) : rng.int(0, 20);

    posts.push({
      id: `post-${i}`,
      title: hook,
      format: rng.pick(CONTENT_FORMATS),
      platform: rng.pick(PLATFORMS),
      segment: rng.pick(SEGMENTS),
      caption: `${hook} ${cta}`,
      hashtags: rng.pickMany(HASHTAG_POOL, rng.int(3, 6)),
      status,
      scheduledAt: new Date(now + offsetDays * 86400000).toISOString(),
      gradient: rng.pick(GRADIENTS),
      metrics: {
        views: rng.int(300, 420000),
        likes: rng.int(20, 38000),
        comments: rng.int(0, 1800),
        shares: rng.int(0, 3200),
      },
    });
  }

  return posts;
}

export const POSTS = generatePosts(160);
