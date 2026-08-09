import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const geoRows = fs.readFileSync(path.join(root, 'output', 'geo_tracking.csv'), 'utf8').trim().split(/\r?\n/).slice(1).filter(Boolean);
if (geoRows.length < 20) errors.push(`expected at least 20 GEO query rows, found ${geoRows.length}`);
const keywords = fs.readFileSync(path.join(root, 'src', 'data', 'keywords.csv'), 'utf8').trim().split(/\r?\n/).slice(1).filter(Boolean);
if (keywords.length < 8) errors.push(`expected keyword seed rows, found ${keywords.length}`);
const clusterDoc = fs.readFileSync(path.join(root, 'docs', 'content-cluster-map.md'), 'utf8');
if (!clusterDoc.includes('pillar') || !clusterDoc.includes('satellite')) errors.push('content cluster map must describe pillar/satellite navigation');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`SEO asset contract valid: geo_rows=${geoRows.length}, keyword_rows=${keywords.length}`);
