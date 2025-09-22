import { useState, useRef, useEffect } from 'react';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DSATopic, dsaTopics } from '@/data/dsaTopics';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TopicSearchProps {
  placeholder?: string;
  className?: string;
}

export function TopicSearch({ placeholder = "Search topics...", className }: TopicSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState<DSATopic[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSelectedIndex(-1);
    
    if (!term.trim()) {
      setFilteredTopics([]);
      setIsOpen(false);
      return;
    }

    // Topic-focused search - prioritizes topic titles and categories
    const filtered = dsaTopics.filter(topic => {
      const searchLower = term.toLowerCase();
      return (
        topic.title.toLowerCase().includes(searchLower) ||
        topic.category.toLowerCase().includes(searchLower) ||
        topic.description.toLowerCase().includes(searchLower)
      );
    }).slice(0, 8); // Limit to 8 results for better UX

    setFilteredTopics(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleTopicSelect = (topic: DSATopic) => {
    navigate(`/topic/${topic.id}`);
    setSearchTerm('');
    setIsOpen(false);
    setFilteredTopics([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredTopics.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredTopics.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredTopics.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredTopics.length) {
          handleTopicSelect(filteredTopics[selectedIndex]);
        } else if (filteredTopics.length > 0) {
          handleTopicSelect(filteredTopics[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredTopics([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredTopics.length > 0) {
              setIsOpen(true);
            }
          }}
          className="pl-10 pr-10"
          title="Search for specific DSA topics to learn"
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

      {/* Search Results Dropdown */}
      {isOpen && filteredTopics.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">
              Found {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''}
            </div>
            {filteredTopics.map((topic, index) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic)}
                className={cn(
                  "w-full text-left p-3 rounded-md hover:bg-accent transition-colors",
                  "flex items-center justify-between group",
                  selectedIndex === index && "bg-accent"
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {topic.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {topic.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getDifficultyColor(topic.difficulty))}
                  >
                    {topic.difficulty}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </button>
            ))}
          </div>
          
          {/* Search Tips */}
          <div className="border-t border-border p-2 bg-muted/50">
            <div className="text-xs text-muted-foreground px-2">
              💡 Tip: Use ↑↓ arrows to navigate, Enter to select, Esc to close
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && searchTerm && filteredTopics.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 text-center">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">
              No topics found for "{searchTerm}"
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Try searching for "array", "sorting", "tree", etc.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
