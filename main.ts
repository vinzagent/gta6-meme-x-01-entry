// gta6-meme-x-01 entry — "WANTED: Grand Theft Patience".
// The entry is the X post itself (POST.json names it); this program's only job
// is to hand POST.json to the gate at /output/POST.json. Before copying, it
// validates that POST.json parses and names a real X status address, so a
// placeholder or a typo fails loudly here instead of at the gate.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const postPath = join(BOT_DIR, 'POST.json');
let post: { url?: unknown };
try {
  post = JSON.parse(readFileSync(postPath, 'utf8')) as { url?: unknown };
} catch (err) {
  console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post.url !== 'string' || !/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(post.url)) {
  console.error(`POST.json must name an X post, like https://x.com/<handle>/status/<id>; got: ${String(post.url)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
console.log(`handed in the post: ${post.url}`);
