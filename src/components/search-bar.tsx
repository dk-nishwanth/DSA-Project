import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DSATopic } from '@/data/dsaTopics';

interface SearchBarProps {
  topics: DSATopic[];
  onFilter: (filtered: DSATopic[]) => void;
}

export function SearchBar({ topics, onFilter }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      onFilter(topics);
      return;
    }

    const filtered = topics.filter(topic =>
      topic.title.toLowerCase().includes(term.toLowerCase()) ||
      topic.description.toLowerCase().includes(term.toLowerCase()) ||
      topic.category.toLowerCase().includes(term.toLowerCase())
    );
    onFilter(filtered);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onFilter(topics);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search concepts..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}