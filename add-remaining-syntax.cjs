const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Define the topics and their syntax
const additions = [
  {
    id: 'prime-algorithms',
    searchAfter: 'filter(i => isPrime[i]);\\n}`,',
    syntax: `// Sieve of Eratosthenes
function sieve(n) {
  const isPrime = Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  
  return Array.from({length: n+1}, (_, i) => i)
    .filter(i => isPrime[i]);
}`
  },
  {
    id: 'fast-exponentiation',
    searchAfter: 'base \\* halfSquared\\) % mod : base \\* halfSquared\\);\\n}\\n`,',
    syntax: `function fastPower(base, exp, mod) {
  let result = 1;
  base = base % mod;
  
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  
  return result;
}`
  },
  {
    id: 'modular-arithmetic',
    searchAfter: 'return fastPower\\(a, mod - 2, mod\\);\\n}\\n`,',
    syntax: `function modAdd(a, b, mod) {
  return ((a % mod) + (b % mod)) % mod;
}

function modMul(a, b, mod) {
  return ((a % mod) * (b % mod)) % mod;
}

function modInverse(a, mod) {
  // Using Fermat's little theorem
  return fastPower(a, mod - 2, mod);
}`
  },
  {
    id: 'fibonacci-algorithms',
    searchAfter: 'a\\[1\\]\\[0\\]\\*b\\[0\\]\\[1\\] \\+ a\\[1\\]\\[1\\]\\*b\\[1\\]\\[1\\]\\]\\n  \\];\\n}`,',
    syntax: `// DP approach - O(n)
function fibDP(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

// Fast doubling - O(log n)
function fibFast(n) {
  function fd(k) {
    if (k === 0) return [0, 1];
    const [a, b] = fd(Math.floor(k / 2));
    const c = a * (2 * b - a);
    const d = a * a + b * b;
    return (k % 2 === 0) ? [c, d] : [d, c + d];
  }
  return fd(n)[0];
}`
  }
];

// Process each addition
for (const {id, searchAfter, syntax} of additions) {
  const pattern = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?${searchAfter})\\s*(voiceExplanation:)`);
  
  if (pattern.test(content)) {
    content = content.replace(pattern, `$1\n        syntax: \`${syntax}\`,\n        $2`);
    console.log(`✅ Added syntax to ${id}`);
  } else {
    console.log(`❌ Could not find pattern for ${id}`);
  }
}

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('\n✅ Done!');
