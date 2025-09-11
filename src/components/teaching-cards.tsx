import { Lightbulb, PlusCircle, Search, AlertTriangle } from 'lucide-react';

interface TeachingCardsProps {
  items: Array<{
    icon: 'fast' | 'insert' | 'search';
    title: string;
    text: string;
  }>;
  mistakes?: string[];
}

const Icon = ({ type }: { type: 'fast' | 'insert' | 'search' }) => {
  if (type === 'fast') return <Lightbulb className="h-4 w-4" />;
  if (type === 'insert') return <PlusCircle className="h-4 w-4" />;
  return <Search className="h-4 w-4" />;
};

export function TeachingCards({ items, mistakes = [] }: TeachingCardsProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((it, idx) => (
          <div
            key={idx}
            className={
              idx === 0
                ? 'rounded-xl border p-4 bg-emerald-50/50 border-emerald-200'
                : idx === 1
                ? 'rounded-xl border p-4 bg-blue-50/50 border-blue-200'
                : 'rounded-xl border p-4 bg-purple-50/50 border-purple-200'
            }
          >
            <div className="flex items-center gap-2 font-semibold">
              <Icon type={it.icon} />
              <span>{it.title}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
          </div>
        ))}
      </div>

      {mistakes.length > 0 && (
        <div className="rounded-xl border p-4 bg-red-50/50 border-red-200">
          <div className="flex items-center gap-2 font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span>Common Beginner Mistakes</span>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-red-800">
            {mistakes.map((m, i) => (
              <li key={i}>• {m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


