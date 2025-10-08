const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Define syntax for each math topic
const syntaxMap = {
  'number-theory-basics': `function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function isPrime(n) {
  if (n <= 1) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}`,
  
  'prime-algorithms': `// Sieve of Eratosthenes
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
}`,
  
  'fast-exponentiation': `function fastPower(base, exp, mod) {
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
}`,
  
  'modular-arithmetic': `function modAdd(a, b, mod) {
  return ((a % mod) + (b % mod)) % mod;
}

function modMul(a, b, mod) {
  return ((a % mod) * (b % mod)) % mod;
}

function modInverse(a, mod) {
  // Using Fermat's little theorem
  return fastPower(a, mod - 2, mod);
}`,
  
  'combinatorics': `function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function nCr(n, r) {
  if (r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function nPr(n, r) {
  if (r > n) return 0;
  return factorial(n) / factorial(n - r);
}`,
  
  'fibonacci-algorithms': `// Matrix exponentiation for Fibonacci
function fibMatrix(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  const matrix = [[1, 1], [1, 0]];
  const result = matrixPower(matrix, n - 1);
  return result[0][0];
}

function matrixMul(a, b) {
  return [
    [a[0][0]*b[0][0] + a[0][1]*b[1][0], 
     a[0][0]*b[0][1] + a[0][1]*b[1][1]],
    [a[1][0]*b[0][0] + a[1][1]*b[1][0], 
     a[1][0]*b[0][1] + a[1][1]*b[1][1]]
  ];
}`
};

// For each topic, find and add syntax
for (const [topicId, syntaxCode] of Object.entries(syntaxMap)) {
  // Find the topic and add syntax before voiceExplanation
  const topicPattern = new RegExp(
    `(id:\\s*['"]${topicId}['"][\\s\\S]*?implementationCode:[\\s\\S]*?\`,)\\s*(voiceExplanation:)`,
    'g'
  );
  
  content = content.replace(topicPattern, (match, before, voice) => {
    return `${before}\n        syntax: \`${syntaxCode}\`,\n        ${voice}`;
  });
}

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('✅ Added syntax fields to all Mathematical Algorithms topics!');
