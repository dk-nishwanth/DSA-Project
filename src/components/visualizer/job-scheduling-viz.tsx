import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface Job {
  id: string;
  deadline: number;
  profit: number;
  scheduled: boolean;
  slot: number;
}

export const JobSchedulingViz: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([
    { id: 'A', deadline: 2, profit: 100, scheduled: false, slot: -1 },
    { id: 'B', deadline: 1, profit: 19, scheduled: false, slot: -1 },
    { id: 'C', deadline: 2, profit: 27, scheduled: false, slot: -1 },
    { id: 'D', deadline: 1, profit: 25, scheduled: false, slot: -1 },
    { id: 'E', deadline: 3, profit: 15, scheduled: false, slot: -1 }
  ]);
  const [slots, setSlots] = useState<string[]>(['', '', '']);
  const [totalProfit, setTotalProfit] = useState(0);
  const [current, setCurrent] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setJobs(jobs.map(j => ({ ...j, scheduled: false, slot: -1 })));
    setSlots(['', '', '']);
    setTotalProfit(0);
    setCurrent(-1);
    setIsPlaying(false);
  };

  const solve = async () => {
    setIsPlaying(true);
    const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
    setJobs(sorted);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newSlots = ['', '', ''];
    let profit = 0;

    for (let i = 0; i < sorted.length; i++) {
      setCurrent(i);
      await new Promise(resolve => setTimeout(resolve, 800));

      for (let j = Math.min(2, sorted[i].deadline - 1); j >= 0; j--) {
        if (newSlots[j] === '') {
          newSlots[j] = sorted[i].id;
          sorted[i].scheduled = true;
          sorted[i].slot = j;
          profit += sorted[i].profit;
          setSlots([...newSlots]);
          setTotalProfit(profit);
          setJobs([...sorted]);
          await new Promise(resolve => setTimeout(resolve, 600));
          break;
        }
      }
    }

    setCurrent(-1);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Job Scheduling (Greedy)</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={solve} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Schedule Jobs
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Time Slots:</p>
        <div className="flex gap-2">
          {slots.map((slot, idx) => (
            <div key={idx} className="w-20 h-20 flex flex-col items-center justify-center border-2 rounded bg-blue-100 border-blue-300">
              <div className="text-xs text-gray-600">Slot {idx + 1}</div>
              <div className="text-2xl font-bold">{slot || '-'}</div>
            </div>
          ))}
        </div>
        <p className="text-sm mt-2"><strong>Total Profit:</strong> {totalProfit}</p>
      </div>
      <div className="space-y-2">
        {jobs.map((job, idx) => (
          <div key={job.id} className={`p-3 border-2 rounded flex items-center justify-between ${
            job.scheduled ? 'bg-green-100 border-green-400' :
            current === idx ? 'bg-blue-100 border-blue-400' :
            'bg-gray-50 border-gray-300'
          }`}>
            <span className="font-semibold">Job {job.id}</span>
            <span className="text-sm">Deadline: {job.deadline}, Profit: {job.profit}</span>
            {job.scheduled && <span className="text-green-600 font-bold">✓ Slot {job.slot + 1}</span>}
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Greedy Strategy:</strong> Sort by profit, schedule in latest available slot before deadline</p>
        <p><strong>Time:</strong> O(n²) | <strong>Space:</strong> O(n)</p>
      </div>
    </div>
  );
};
