import { useState } from 'react';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConceptCard } from '@/components/concept-card';
import { dsaTopics, dsaCategories } from '@/data/dsaTopics';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTopics = dsaTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || topic.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const difficultyStats = {
    beginner: dsaTopics.filter(t => t.difficulty === 'beginner').length,
    intermediate: dsaTopics.filter(t => t.difficulty === 'intermediate').length,
    advanced: dsaTopics.filter(t => t.difficulty === 'advanced').length
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Learn Data Structures & Algorithms
          </h1>
          <p className="text-muted-foreground mb-4">
            Master CS fundamentals through interactive visualizations and step-by-step explanations
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🚀 Start Your Journey
            </h2>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              New to programming? Start with <strong>Array Basics</strong> and <strong>Linear Search</strong>. 
              Each topic includes real-world examples and interactive visualizations to make learning fun!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            {dsaTopics.length} Total Topics
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-success text-success">
            {difficultyStats.beginner} Beginner
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-warning text-warning">
            {difficultyStats.intermediate} Intermediate
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-destructive text-destructive">
            {difficultyStats.advanced} Advanced
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 shadow-subtle">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
            >
              <option value="All">All Categories</option>
              {dsaCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
            >
              <option value="All">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {filteredTopics.length} Topics Found
          </h2>
          {(searchTerm || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        <div className={`
          grid gap-4 animate-fade-in
          ${viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
          }
        `}>
          {filteredTopics.map(topic => (
            <ConceptCard key={topic.id} topic={topic} />
          ))}
        </div>
        
        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No topics found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}