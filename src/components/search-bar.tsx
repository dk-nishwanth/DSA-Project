import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DSATopic } from '@/data/dsaTopics';

interface SearchBarProps {
  topics: DSATopic[];
  onFilter: (filtered: DSATopic[]) => void;
  placeholder?: string;
}

export function SearchBar({ topics, onFilter, placeholder = "Search concepts..." }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      onFilter(topics);
      return;
    }

    // Enhanced search for concepts - searches through more fields for better concept discovery
    const filtered = topics.filter(topic => {
      const searchLower = term.toLowerCase();
      return (
        // Basic fields
        topic.title.toLowerCase().includes(searchLower) ||
        topic.description.toLowerCase().includes(searchLower) ||
        topic.category.toLowerCase().includes(searchLower) ||
        // Extended concept search
        topic.extendedDefinition?.toLowerCase().includes(searchLower) ||
        topic.keyConcepts?.toLowerCase().includes(searchLower) ||
        topic.realWorldApplications?.toLowerCase().includes(searchLower) ||
        topic.voiceExplanation?.toLowerCase().includes(searchLower) ||
        // Search in complexity information
        topic.timeComplexity?.toLowerCase().includes(searchLower) ||
        topic.spaceComplexity?.toLowerCase().includes(searchLower) ||
        // Search in quiz questions for concept understanding
        topic.quizQuestions?.some(q => 
          q.question.toLowerCase().includes(searchLower) ||
          q.explanation.toLowerCase().includes(searchLower)
        )
      );
    });
    onFilter(filtered);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onFilter(topics);
  };

  // Clear search when topics change (e.g., when switching between different topic sets)
  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, [topics]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-10"
        title="Search through concepts, definitions, applications, and key principles"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          title="Clear search"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}