import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const KMPVisualizer: React.FC = () => {
  const [text] = useState('ABABDABACDABABCABAB');
  const [pattern] = useState('ABABCABAB');
  const [textIndex, setTextIndex] = useState(0);
  const [patternIndex, setPatternIndex] = useState(0);
  const [lps, setLps] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const computeLPS = (pat: string) => {
    const lpsArr = new Array(pat.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pat.length) {
      if (pat[i] === pat[len]) {
        len++;
        lpsArr[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lpsArr[len - 1];
        } else {
          lpsArr[i] = 0;
          i++;
        }
      }
    }
    return lpsArr;
  };

  const reset = () => {
    setTextIndex(0);
    setPatternIndex(0);
    setMatches([]);
    setLps([]);
    setIsPlaying(false);
  };

  const search = async () => {
    setIsPlaying(true);
    const lpsArr = computeLPS(pattern);
    setLps(lpsArr);
    await new Promise(resolve => setTimeout(resolve, 500));

    const found: number[] = [];
    let i = 0, j = 0;

    while (i < text.length) {
      setTextIndex(i);
      setPatternIndex(j);
      await new Promise(resolve => setTimeout(resolve, 400));

      if (text[i] === pattern[j]) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        found.push(i - j);
        setMatches([...found]);
        j = lpsArr[j - 1];
        await new Promise(resolve => setTimeout(resolve, 600));
      } else if (i < text.length && text[i] !== pattern[j]) {
        if (j !== 0) {
          j = lpsArr[j - 1];
        } else {
          i++;
        }
      }
    }

    setTextIndex(-1);
    setPatternIndex(-1);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">KMP Algorithm</h3>
      
      <div className="flex gap-2 mb-4">
        <button onClick={search} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Search
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Text:</p>
        <div className="flex gap-1">
          {text.split('').map((char, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 flex items-center justify-center border font-mono ${
                matches.some(m => idx >= m && idx < m + pattern.length) ? 'bg-green-200 border-green-400' :
                textIndex === idx ? 'bg-blue-200 border-blue-400' :
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
            <div
              key={idx}
              className={`w-8 h-8 flex items-center justify-center border font-mono ${
                patternIndex === idx ? 'bg-blue-500 text-white border-blue-600' :
                'bg-gray-100 border-gray-300'
              }`}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {lps.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm font-semibold mb-1">LPS Array:</p>
          <div className="flex gap-1">
            {lps.map((val, idx) => (
              <div key={idx} className="w-8 h-8 flex items-center justify-center border bg-yellow-100 border-yellow-300 font-mono text-sm">
                {val}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 bg-blue-50 rounded text-sm">
        <p><strong>Matches found:</strong> {matches.length} at positions: {matches.join(', ') || 'None'}</p>
        <p><strong>Time:</strong> O(n + m) | <strong>Space:</strong> O(m)</p>
      </div>
    </div>
  );
};
