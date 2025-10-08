import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const RabinKarpVisualizer: React.FC = () => {
  const [text] = useState('ABCABDABCABC');
  const [pattern] = useState('ABC');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentHash, setCurrentHash] = useState<number | null>(null);
  const [patternHash, setPatternHash] = useState<number | null>(null);
  const [matches, setMatches] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const BASE = 256;
  const PRIME = 101;

  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * BASE + str.charCodeAt(i)) % PRIME;
    }
    return h;
  };

  const reset = () => {
    setCurrentIndex(0);
    setCurrentHash(null);
    setPatternHash(null);
    setMatches([]);
    setIsPlaying(false);
  };

  const search = async () => {
    setIsPlaying(true);
    const patHash = hash(pattern);
    setPatternHash(patHash);
    await new Promise(resolve => setTimeout(resolve, 500));

    const found: number[] = [];
    let txtHash = hash(text.substring(0, pattern.length));
    setCurrentHash(txtHash);

    for (let i = 0; i <= text.length - pattern.length; i++) {
      setCurrentIndex(i);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (txtHash === patHash) {
        let match = true;
        for (let j = 0; j < pattern.length; j++) {
          if (text[i + j] !== pattern[j]) {
            match = false;
            break;
          }
        }
        if (match) {
          found.push(i);
          setMatches([...found]);
          await new Promise(resolve => setTimeout(resolve, 400));
        }
      }

      if (i < text.length - pattern.length) {
        txtHash = (BASE * (txtHash - text.charCodeAt(i) * Math.pow(BASE, pattern.length - 1)) + text.charCodeAt(i + pattern.length)) % PRIME;
        if (txtHash < 0) txtHash += PRIME;
        setCurrentHash(txtHash);
      }
    }

    setCurrentIndex(-1);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Rabin-Karp Algorithm</h3>
      
      <div className="flex gap-2 mb-4">
        <button onClick={search} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Search
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded">
        <p className="text-sm"><strong>Pattern Hash:</strong> {patternHash ?? 'Not computed'}</p>
        <p className="text-sm"><strong>Current Window Hash:</strong> {currentHash ?? 'Not computed'}</p>
        <p className="text-sm"><strong>Matches:</strong> {matches.length}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Text:</p>
        <div className="flex gap-1">
          {text.split('').map((char, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 flex items-center justify-center border font-mono ${
                matches.includes(idx) || matches.some(m => idx > m && idx < m + pattern.length) ? 'bg-green-200 border-green-400' :
                idx >= currentIndex && idx < currentIndex + pattern.length && currentIndex >= 0 ? 'bg-blue-200 border-blue-400' :
                'bg-gray-100 border-gray-300'
              }`}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Pattern:</p>
        <div className="flex gap-1">
          {pattern.split('').map((char, idx) => (
            <div key={idx} className="w-8 h-8 flex items-center justify-center border font-mono bg-yellow-100 border-yellow-300">
              {char}
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded text-sm">
        <p><strong>Rolling Hash:</strong> Efficiently compute hash for sliding window</p>
        <p><strong>Time:</strong> O(n + m) average | <strong>Space:</strong> O(1)</p>
      </div>
    </div>
  );
};
