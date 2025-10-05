#!/usr/bin/env node

// Audit DSA content completeness across dsaTopics.ts and quizData.ts
// - Verifies required content fields per topic: extendedDefinition, pseudocode,
//   voiceExplanation, keyConcepts, implementationCode
// - Verifies quiz coverage (>= 3 questions) either in quizData.ts or embedded in dsaTopics.ts
// - Emits a structured report to stdout and exits non-zero on failures

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const topicsPath = path.join(root, 'src', 'data', 'dsaTopics.ts');
const quizPath = path.join(root, 'src', 'data', 'quizData.ts');

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return '';
  }
}

const topicsSrc = readFileSafe(topicsPath);
const quizSrc = readFileSafe(quizPath);

if (!topicsSrc) {
  console.error(`ERROR: Could not read ${topicsPath}`);
  process.exit(2);
}
if (!quizSrc) {
  console.error(`WARN: Could not read ${quizPath}. Quiz coverage checks will only use embedded quizQuestions.`);
}

// --- Parse quizData.ts keys and question counts ---
function parseQuizData(src) {
  const map = new Map();
  if (!src) return map;

  // Helper: given index at '[' return substring of the full bracketed array block
  function extractBracketBlock(s, startIdx) {
    let i = startIdx;
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let inBacktick = false;
    while (i < s.length) {
      const ch = s[i];
      const prev = i > 0 ? s[i - 1] : '';
      if (!inDouble && !inBacktick && ch === "'" && prev !== '\\') inSingle = !inSingle;
      else if (!inSingle && !inBacktick && ch === '"' && prev !== '\\') inDouble = !inDouble;
      else if (!inSingle && !inDouble && ch === '`' && prev !== '\\') inBacktick = !inBacktick;
      else if (!inSingle && !inDouble && !inBacktick) {
        if (ch === '[') depth++;
        else if (ch === ']') {
          depth--;
          if (depth === 0) {
            // include closing bracket
            return s.slice(startIdx, i + 1);
          }
        }
      }
      i++;
    }
    return '';
  }

  // Walk through the file to find entries like 'topic-id': [ ... ]
  const keyRegex = /'([^']+)'\s*:\s*\[/g;
  let m;
  while ((m = keyRegex.exec(src)) !== null) {
    const key = m[1];
    const arrayStartIdx = m.index + m[0].lastIndexOf('[');
    const block = extractBracketBlock(src, arrayStartIdx);
    if (!block) {
      map.set(key, 0);
      continue;
    }
    const count = (block.match(/\bid\s*:\s*'[^']+'/g) || []).length;
    map.set(key, count);
  }
  return map;
}

const quizMap = parseQuizData(quizSrc);

// --- Parse topics blocks ---
// We will extract each topic object within dsaTopics array by finding id: '...'
function parseTopicBlocks(src) {
  const arrayStart = src.indexOf('export const dsaTopics');
  if (arrayStart === -1) return [];
  const arrSlice = src.slice(arrayStart);
  // Split on lines where id: '...'
  const parts = arrSlice.split(/\bid\s*:\s*'([^']+)'\s*,/);
  // parts => [pre, id1, rest1, id2, rest2, ...]
  const blocks = [];
  for (let i = 1; i < parts.length; i += 2) {
    const id = parts[i];
    const rest = parts[i + 1] || '';
    // Heuristic: end of this object occurs before the next "}," followed by a newline and "{" or the closing of array
    const endIdx = rest.search(/\n\s*}\s*,\s*\n\s*[{\[]|\n\s*}\s*\]\s*;/);
    const body = endIdx !== -1 ? rest.slice(0, endIdx) : rest;
    blocks.push({ id, body });
  }
  return blocks;
}

const topicBlocks = parseTopicBlocks(topicsSrc);

const requiredFields = [
  'extendedDefinition',
  'pseudocode',
  'voiceExplanation',
  'keyConcepts',
  'implementationCode',
];

function hasNonTrivialField(body, field) {
  // Match fieldName: `...` or '...'
  const re = new RegExp(`${field}\\s*:\\s*([\x60'\"])`); // ` or ' or "
  const m = body.match(re);
  if (!m) return false;
  // Rough length heuristic to ensure non-empty and meaningful content
  // Try to capture the content between quotes if possible
  let content = '';
  if (m[1] === '`') {
    const idx = body.indexOf('`', m.index);
    if (idx !== -1) {
      const idx2 = body.indexOf('`', idx + 1);
      if (idx2 !== -1) content = body.slice(idx + 1, idx2);
    }
  } else {
    // single or double quotes
    const quote = m[1];
    const idx = body.indexOf(quote, m.index);
    if (idx !== -1) {
      const idx2 = body.indexOf(quote, idx + 1);
      if (idx2 !== -1) content = body.slice(idx + 1, idx2);
    }
  }
  return content.trim().length >= 30; // len threshold
}

function embeddedQuizCount(body) {
  const blockMatch = body.match(/quizQuestions\s*:\s*\[(.*?)\]/s);
  if (!blockMatch) return 0;
  const block = blockMatch[1];
  return (block.match(/question\s*:\s*['\"]/g) || []).length;
}

const report = {
  totals: {
    topicsFound: topicBlocks.length,
    complete: 0,
    incomplete: 0,
  },
  issues: [],
};

for (const { id, body } of topicBlocks) {
  const missing = [];
  for (const f of requiredFields) {
    if (!hasNonTrivialField(body, f)) missing.push(f);
  }
  // Quiz coverage: prefer quizData map; if absent, fallback to embedded
  const quizCountFromMap = quizMap.get(id) || 0;
  const quizCountEmbedded = embeddedQuizCount(body);
  const totalQuizCount = Math.max(quizCountFromMap, quizCountEmbedded);
  if (totalQuizCount < 3) missing.push(`quiz(>=3) [have: ${totalQuizCount}]`);

  if (missing.length === 0) {
    report.totals.complete++;
  } else {
    report.totals.incomplete++;
    report.issues.push({ id, missing });
  }
}

function printSummary(rep) {
  const lines = [];
  lines.push('Content Audit Summary');
  lines.push(`- Topics scanned: ${rep.totals.topicsFound}`);
  lines.push(`- Complete topics: ${rep.totals.complete}`);
  lines.push(`- Incomplete topics: ${rep.totals.incomplete}`);
  if (rep.issues.length) {
    lines.push('\nDetails per topic:');
    for (const issue of rep.issues) {
      lines.push(`- ${issue.id}: missing ${issue.missing.join(', ')}`);
    }
  }
  return lines.join('\n');
}

const summary = printSummary(report);
console.log(summary);

// Also emit JSON if requested
if (process.argv.includes('--json')) {
  console.log('\n--- JSON REPORT ---');
  console.log(JSON.stringify(report, null, 2));
}

if (report.totals.incomplete > 0) {
  process.exit(1);
}
process.exit(0);