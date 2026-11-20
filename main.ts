// SUNSET BAY — hand-in program for the gta6-01 "Make GTA 6" bounty.
//
// The game itself is a single static page (game/index.html: an original
// open-world crime caper drawn with software 3D on a 2D canvas, no library,
// no network). This program is only the courier: it copies game/ and
// screenshots/ from this repository into the output directory and writes
// the dossier the judge reads, using the kit's vendored buildDossier.
//
// Run it the way the grader does (Node 22), or locally with:
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fresh output tree with the two payload folders in place.
mkdirSync(outDir, { recursive: true });
cpSync(join(repoDir, 'game'), join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
const shotsDir = join(repoDir, 'screenshots');
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
}

// Build the dossier with the scorer's own caps, so anything the sealed
// gate would refuse is refused here first instead: dossier text budget,
// at most 4 screenshots of 256 KiB, game/ under 993 entries / 48 MiB and
// no path longer than 1000 bytes.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
