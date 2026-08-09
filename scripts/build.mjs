import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(repoRoot, 'src');
const publicDir = path.join(repoRoot, 'public');
const dist = path.join(repoRoot, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(src, dist, { recursive: true });
if (fs.existsSync(publicDir)) fs.cpSync(publicDir, dist, { recursive: true });

const required = ['index.html', 'digest.html', 'methodology.html', 'tools.html', 'politics.html', 'agent.html', 'references.html', 'explorer.html', 'compare.html', 'case-studies.html', 'case-study-literature.html', 'case-study-evidence.html', 'case-study-governance.html', 'case-study-bilingual.html', 'case-study-human-review.html', 'styles.css', 'data/digests.json', 'robots.txt', 'sitemap.xml', 'llms.txt'];
const missing = required.filter((file) => !fs.existsSync(path.join(dist, file)));
if (missing.length) throw new Error(`Missing build files: ${missing.join(', ')}`);

const forbidden = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.env($|\.)|token|secret|password/i.test(entry.name)) forbidden.push(path.relative(dist, full));
  }
}
walk(dist);
if (forbidden.length) throw new Error(`Potential secret-like files in build: ${forbidden.join(', ')}`);

console.log(`Built ${required.length} required site files into ${dist}`);
