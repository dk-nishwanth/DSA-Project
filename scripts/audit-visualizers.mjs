#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const visDir = path.join(root, 'src', 'components', 'visualizer');

function scanFile(fp) {
  const content = fs.readFileSync(fp, 'utf8');
  const hasControlsImport = /VisualizerControls/.test(content);
  const hasControlsUsage = /<VisualizerControls[\s>]/.test(content);
  const hasControls = hasControlsImport && hasControlsUsage;

  const hasVoice = /useVisualizerVoice|useVoiceExplain/.test(content);
  const hasMemoryImport = /MemoryLayout/.test(content);
  const hasMemoryUsage = /<MemoryLayout[\s>]/.test(content);
  const hasMemory = hasMemoryImport && hasMemoryUsage;

  const hasStepState = /(stepDesc|currentStep|currentStepText|currentStepDescription|message)\b/.test(content);
  const hasStepDisplay = /(\{\s*stepDesc\s*\}|\{\s*currentStep\s*\}|\{\s*currentStepText\s*\}|\{\s*currentStepDescription\s*\}|\{[^}]*message[^}]*\})/.test(content);
  const hasStepPanel = hasStepState && hasStepDisplay;

  return { hasControls, hasVoice, hasMemory, hasStepPanel };
}

function main() {
  const files = fs.readdirSync(visDir).filter(f => f.endsWith('.tsx'));
  const result = [];
  for (const f of files) {
    const fp = path.join(visDir, f);
    const flags = scanFile(fp);
    const missing = Object.entries(flags).filter(([k, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      result.push({ file: f, missing, flags });
    }
  }
  console.log(JSON.stringify({ total: files.length, issues: result }, null, 2));
}

main();
