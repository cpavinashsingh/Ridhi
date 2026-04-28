const requiredText = '^20.19.0 || >=22.12.0';

function parseVersion(v) {
  const [maj, min, pat] = String(v || '')
    .trim()
    .replace(/^v/i, '')
    .split('.')
    .map((x) => Number(x));
  return { maj: maj || 0, min: min || 0, pat: pat || 0 };
}

function satisfies({ maj, min }) {
  // Vite 7 requires: ^20.19.0 || >=22.12.0
  if (maj === 20) return min >= 19;
  if (maj === 22) return min >= 12;
  return maj > 22;
}

const current = parseVersion(process.versions.node);
if (!satisfies(current)) {
  // eslint-disable-next-line no-console
  console.error(
    [
      '',
      'Node.js version is too low for the client dev server.',
      `- Required: ${requiredText}`,
      `- Current:  v${current.maj}.${current.min}.${current.pat}`,
      '',
      'Fix (WSL recommended):',
      '  - Install nvm and run:',
      '      nvm install 22.22.0',
      '      nvm use 22.22.0',
      '  - Then reinstall deps inside the same OS you run dev in:',
      '      rm -rf node_modules package-lock.json',
      '      npm install',
      '',
    ].join('\n')
  );
  process.exit(1);
}

