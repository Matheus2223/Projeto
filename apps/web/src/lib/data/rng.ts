// Deterministic seeded PRNG so mock data is stable across server render and
// client hydration (avoids Next.js hydration mismatches from Math.random()).
export function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function stringSeed(input: string): number {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

export class Rng {
  private next: () => number;

  constructor(seed: number | string) {
    this.next = mulberry32(typeof seed === "string" ? stringSeed(seed) : seed);
  }

  float(min = 0, max = 1) {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number) {
    return Math.floor(this.float(min, max + 1));
  }

  bool(probability = 0.5) {
    return this.next() < probability;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  pickMany<T>(arr: readonly T[], count: number): T[] {
    const pool = [...arr];
    const out: T[] = [];
    const n = Math.min(count, pool.length);
    for (let i = 0; i < n; i++) {
      const idx = this.int(0, pool.length - 1);
      out.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return out;
  }

  shuffle<T>(arr: readonly T[]): T[] {
    return this.pickMany(arr, arr.length);
  }
}
