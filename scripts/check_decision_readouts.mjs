import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'src', 'decision-readouts.html');
const distPath = path.join(root, 'dist', 'decision-readouts.html');
const appPath = path.join(root, 'src', 'app.js');
const outputPath = path.join(root, 'output', 'decision_readouts_check.md');
const errors = [];

const read = (file) => {
  try { return fs.readFileSync(file, 'utf8'); }
  catch (error) { errors.push(`${path.relative(root, file)}: ${error.message}`); return ''; }
};

const source = read(sourcePath);
const dist = read(distPath);
const app = read(appPath);
const cards = [...source.matchAll(/<article\b[^>]*data-readout-card[^>]*>/g)];
const lanes = cards.map((match) => match[0].match(/data-lane="([^"]+)"/)?.[1] || '');
const ids = cards.map((match) => match[0].match(/\bid="([^"]+)"/)?.[1] || '');
const options = [...source.matchAll(/<option\s+value="([^"]+)"/g)].map((match) => match[1]);
const requiredLanes = ['measure', 'operate', 'govern'];

if (cards.length !== 7) errors.push(`expected 7 readout cards, found ${cards.length}`);
if (new Set(ids).size !== ids.length || ids.some((id) => !id)) errors.push('readout card ids must be present and unique');
for (const lane of requiredLanes) if (!lanes.includes(lane)) errors.push(`missing card lane: ${lane}`);
if (!requiredLanes.every((lane) => options.includes(lane)) || !options.includes('all')) errors.push('filter options must include all, measure, operate, and govern');
if ((source.match(/data-readout-summary/g) || []).length !== 2) errors.push('expected bilingual summary spans');
if (!app.includes('function setupDecisionReadouts()')) errors.push('missing setupDecisionReadouts function');
if (!app.includes("get('lane')") || !app.includes('history.replaceState')) errors.push('missing lane deep-link handling');
if (!dist.includes('data-readout-filter') || (dist.match(/data-readout-card/g) || []).length !== 7) errors.push('dist route does not contain the seven-card filter surface');

const lines = [
  '# Decision Readouts Smoke Check',
  '',
  '> OFFLINE STRUCTURE CHECK. This verifies the local filter contract and build correspondence; it does not prove user outcomes or interview performance.',
  '',
  `- Source cards: ${cards.length}`,
  `- Card lanes: ${[...new Set(lanes.filter(Boolean))].join(', ') || 'none'}`,
  `- Filter options: ${options.join(', ') || 'none'}`,
  `- Validation errors: ${errors.length}`,
  '- Data boundary: PUBLIC SAMPLE DATA / SYNTHETIC DEMO DATA / VERIFY BEFORE CLAIM',
  '',
  '| Check | Status |',
  '| --- | --- |',
  `| Seven cards with unique ids | ${cards.length === 7 && new Set(ids).size === ids.length && ids.every(Boolean) ? 'PASS' : 'FAIL'} |`,
  `| Three capability lanes | ${requiredLanes.every((lane) => lanes.includes(lane)) ? 'PASS' : 'FAIL'} |`,
  `| Filter options | ${requiredLanes.every((lane) => options.includes(lane)) && options.includes('all') ? 'PASS' : 'FAIL'} |`,
  `| Bilingual summary | ${(source.match(/data-readout-summary/g) || []).length === 2 ? 'PASS' : 'FAIL'} |`,
  `| Deep-link implementation | ${app.includes("get('lane')") && app.includes('history.replaceState') ? 'PASS' : 'FAIL'} |`,
  `| Dist correspondence | ${dist.includes('data-readout-filter') && (dist.match(/data-readout-card/g) || []).length === 7 ? 'PASS' : 'FAIL'} |`,
  `| Overall | ${errors.length ? 'FAIL' : 'PASS'} |`,
];
if (errors.length) lines.push('', '## Errors', '', ...errors.map((error) => `- ${error}`));
else lines.push('', 'The source and built Decision Readouts routes preserve the seven-card, three-lane filter contract.');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, lines.join('\n') + '\n', 'utf8');
console.log(`wrote ${path.relative(process.cwd(), outputPath)}: cards=${cards.length} errors=${errors.length}`);
if (errors.length) process.exitCode = 1;
