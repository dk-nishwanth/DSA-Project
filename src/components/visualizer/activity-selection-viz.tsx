import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface Activity {
  id: number;
  start: number;
  finish: number;
  selected: boolean;
}

export const ActivitySelectionViz: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, start: 1, finish: 4, selected: false },
    { id: 2, start: 3, finish: 5, selected: false },
    { id: 3, start: 0, finish: 6, selected: false },
    { id: 4, start: 5, finish: 7, selected: false },
    { id: 5, start: 8, finish: 9, selected: false },
    { id: 6, start: 5, finish: 9, selected: false }
  ]);
  const [current, setCurrent] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setActivities(activities.map(a => ({ ...a, selected: false })));
    setCurrent(-1);
    setIsPlaying(false);
  };

  const solve = async () => {
    setIsPlaying(true);
    const sorted = [...activities].sort((a, b) => a.finish - b.finish);
    setActivities(sorted);
    await new Promise(resolve => setTimeout(resolve, 500));

    let lastFinish = 0;
    for (let i = 0; i < sorted.length; i++) {
      setCurrent(i);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (sorted[i].start >= lastFinish) {
        sorted[i].selected = true;
        lastFinish = sorted[i].finish;
        setActivities([...sorted]);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }

    setCurrent(-1);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Activity Selection (Greedy)</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={solve} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Select Activities
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="space-y-2">
        {activities.map((activity, idx) => (
          <div key={activity.id} className={`p-3 border-2 rounded flex items-center justify-between ${
            activity.selected ? 'bg-green-100 border-green-400' :
            current === idx ? 'bg-blue-100 border-blue-400' :
            'bg-gray-50 border-gray-300'
          }`}>
            <span className="font-semibold">Activity {activity.id}</span>
            <span className="text-sm">Start: {activity.start}, Finish: {activity.finish}</span>
            {activity.selected && <span className="text-green-600 font-bold">✓ Selected</span>}
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Greedy Strategy:</strong> Always pick activity with earliest finish time</p>
        <p><strong>Time:</strong> O(n log n) | <strong>Space:</strong> O(1)</p>
      </div>
    </div>
  );
};
