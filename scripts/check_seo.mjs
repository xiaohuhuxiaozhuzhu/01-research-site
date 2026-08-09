import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'digest.html', 'methodology.html', 'tools.html', 'politics.html', 'agent.html', 'references.html', 'explorer.html', 'compare.html', 'case-studies.html', 'case-study-literature.html', 'case-study-evidence.html', 'case-study-governance.html', 'case-study-bilingual.html', 'case-study-human-review.html'];
const errors = [];
for (const page of pages) {
  const file = path.join(root, 'src', page);
  if (!fs.existsSync(file)) { errors.push(`${page}: missing`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const h1 = (html.match(/<h1\b/gi) || []).length;
  const canonical = /<link[^>]+rel=["']canonical["'][^>]+href=["'][^"']+/.test(html);
  const description = /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/.test(html);
  const jsonLd = html.includes('application/ld+json');
  if (h1 !== 1) errors.push(`${page}: expected exactly one h1, found ${h1}`);
  if (!canonical) errors.push(`${page}: missing canonical`);
  if (!description) errors.push(`${page}: missing meta description`);
  if (!jsonLd) errors.push(`${page}: missing JSON-LD`);
}
const sitemap = fs.readFileSync(path.join(root, 'src', 'sitemap.xml'), 'utf8');
for (const page of pages) if (!sitemap.includes(page === 'index.html' ? 'https://example.com/' : `https://example.com/${page}`)) errors.push(`sitemap: missing ${page}`);
const robots = fs.readFileSync(path.join(root, 'src', 'robots.txt'), 'utf8');
if (!/User-agent:\s*GPTBot/i.test(robots) || !/User-agent:\s*Google-Extended/i.test(robots)) errors.push('robots: missing explicit AI crawler policy');
if (errors.length) { console.error(errors.map((error) => `ERROR ${error}`).join('\n')); process.exit(1); }
console.log(`SEO checks passed for ${pages.length} pages, sitemap, and robots policy.`);
