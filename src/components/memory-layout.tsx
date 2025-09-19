import React from 'react';

interface MemoryLayoutProps {
  data: Array<number | string>;
  baseAddress?: number; // default 1000
  wordSize?: number;    // default 4 bytes
  title?: string;
}

export function MemoryLayout({ data, baseAddress = 1000, wordSize = 4, title = 'Memory Layout' }: MemoryLayoutProps) {
  return (
    <div className="bg-card border rounded-xl p-4">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="overflow-x-auto">
        <table className="text-xs font-mono min-w-full">
          <thead>
            <tr className="text-muted-foreground">
              <th className="text-left pr-4 py-1">Index</th>
              <th className="text-left pr-4 py-1">Address</th>
              <th className="text-left pr-4 py-1">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((v, i) => (
              <tr key={i} className="border-t">
                <td className="pr-4 py-1">{i}</td>
                <td className="pr-4 py-1">{baseAddress + i * wordSize}</td>
                <td className="pr-4 py-1">{typeof v === 'number' ? v : v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-[11px] text-muted-foreground mt-2">Base: {baseAddress}, Word size: {wordSize} bytes</div>
    </div>
  );
}
