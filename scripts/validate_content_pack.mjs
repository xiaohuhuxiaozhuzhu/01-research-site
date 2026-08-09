import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const records = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'digests.json'), 'utf8'));
const required = ['author', 'datePublished', 'dateModified', 'evidenceLevel', 'audience', 'nextAction', 'sourceStatus'];
const errors = [];
if (records.length < 24) errors.push(`expected at least 24 records, found ${records.length}`);
for (const record of records) {
  for (const field of required) if (!String(record[field] || '').trim()) errors.push(`${record.id}: missing ${field}`);
  if (!/^https?:\/\//.test(record.source || '')) errors.push(`${record.id}: source must be an http(s) URL`);
  if (!String(record.contentStatus || '').includes('HUMAN REVIEW')) errors.push(`${record.id}: missing human review status`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`content pack valid: ${records.length} records with required editorial metadata`);
