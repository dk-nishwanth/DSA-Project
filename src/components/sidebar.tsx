import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight,
  Home,
  BookOpen,
  Database,
  GitBranch,
  Layers,
  Network,
  BarChart3,
  Search,
  Hash,
  Repeat,
  TrendingUp,
  Zap,
  Brain,
  Shuffle,
  User,
  ClipboardList,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { dsaCategories, dsaTopics } from '@/data/dsaTopics';
import { SearchBar } from '@/components/search-bar';
import { ProgressTracker } from '@/components/progress-tracker';
import { cn } from '@/lib/utils';
// Removed SAMPLE_PROFILE import; completion state now reflected only at category level

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Arrays': Database,
  'Strings': BookOpen,
  'Linked Lists': GitBranch,
  'Stacks & Queues': Layers,
  'Trees': Network,
  'Graphs': Network,
  'Sorting': BarChart3,
  'Searching': Search,
  'Hashing': Hash,
  'Recursion': Repeat,
  'Dynamic Programming': TrendingUp,
  'Greedy Algorithms': Zap,
  'Backtracking': Brain,
  'Advanced Data Structures': Shuffle
};

export function Sidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Arrays']);
  const [filteredTopics, setFilteredTopics] = useState(dsaTopics);
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const progressTracker = ProgressTracker({ topics: dsaTopics });

  const refreshCompletedFromStorage = () => {
    try {
      const saved = localStorage.getItem('dsa-learning-progress');
      if (!saved) {
        setCompletedTopicIds(new Set());
        return;
      }
      const items = JSON.parse(saved) as Array<{ topicId: string; completed: boolean }>;
      const completed = new Set(items.filter(i => i.completed).map(i => i.topicId));
      setCompletedTopicIds(completed);
    } catch {
      setCompletedTopicIds(new Set());
    }
  };

  useEffect(() => {
    refreshCompletedFromStorage();
    const onProgressUpdate = () => refreshCompletedFromStorage();
    window.addEventListener('dsa-progress-updated', onProgressUpdate as EventListener);
    window.addEventListener('storage', onProgressUpdate as EventListener);
    return () => {
      window.removeEventListener('dsa-progress-updated', onProgressUpdate as EventListener);
      window.removeEventListener('storage', onProgressUpdate as EventListener);
    };
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <aside className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border overflow-hidden flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-80"
    )}>
      <div className={cn("border-b border-sidebar-border", isCollapsed ? "p-3" : "p-6")}>
        <div className="flex items-center justify-between">
          <NavLink to="/" className={cn("flex items-center gap-3 group", isCollapsed && "justify-center")}>
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                  DSA Learn
                </h1>
                <p className="text-sm text-sidebar-foreground/60">
                  Interactive Learning
                </p>
              </div>
            )}
          </NavLink>
          {/* Sidebar collapse disabled to keep sidebar fixed */}
          {/* <div className="p-2 opacity-40 cursor-not-allowed" title="Sidebar is fixed" aria-hidden>
            <Menu className="h-4 w-4" />
          </div> */}
        </div>
        
        {!isCollapsed && (
          <div className="mt-4 space-y-3">
            <progressTracker.ProgressBadge />
            <SearchBar 
              topics={dsaTopics} 
              onFilter={setFilteredTopics}
            />
          </div>
        )}
      </div>

      <nav className={cn("flex-1 overflow-y-auto space-y-2", isCollapsed ? "p-2" : "p-4")}>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => cn(
            "nav-link flex items-center w-full",
            isCollapsed ? "justify-center p-3" : "gap-3",
            isActive && "nav-link-active"
          )}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <Home className="h-4 w-4" />
          {!isCollapsed && "Dashboard"}
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => cn(
            "nav-link flex items-center w-full",
            isCollapsed ? "justify-center p-3" : "gap-3",
            isActive && "nav-link-active"
          )}
          title={isCollapsed ? "Profile" : ""}
        >
          <User className="h-4 w-4" />
          {!isCollapsed && "Profile"}
        </NavLink>

        <NavLink 
          to="/assignments" 
          className={({ isActive }) => cn(
            "nav-link flex items-center w-full",
            isCollapsed ? "justify-center p-3" : "gap-3",
            isActive && "nav-link-active"
          )}
          title={isCollapsed ? "Assignments" : ""}
        >
          <ClipboardList className="h-4 w-4" />
          {!isCollapsed && "Assignments"}
        </NavLink>

        {!isCollapsed && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              Topics
            </h3>
            
            {dsaCategories.map(category => {
              const categoryTopics = filteredTopics.filter(topic => topic.category === category);
              const isExpanded = expandedCategories.includes(category);
              const IconComponent = categoryIcons[category] || BookOpen;
              const hasAllCompleted = categoryTopics.length > 0 && categoryTopics.every(t => completedTopicIds.has(t.id));
              
              return (
                <div key={category} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="nav-link flex items-center gap-3 w-full group"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform" />
                    )}
                    <IconComponent className="h-4 w-4" />
                    <span className="flex-1 text-left">{category}</span>
                    {hasAllCompleted && (
                      <CheckCircle
                        className="h-4 w-4 text-success"
                        aria-label="All topics complete"
                      />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-6 space-y-1 animate-fade-in">
                      {categoryTopics.map(topic => {
                        return (
                          <NavLink
                            key={topic.id}
                            to={`/topic/${topic.id}`}
                            className={({ isActive }) => cn(
                              "block px-3 py-2 text-sm rounded-lg transition-colors duration-200",
                              "hover:bg-sidebar-accent hover:text-sidebar-primary",
                              isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-subtle"
                            )}
                            
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex-1">{topic.title}</span>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                topic.difficulty === 'beginner' && "bg-success/20 text-success",
                                topic.difficulty === 'intermediate' && "bg-warning/20 text-warning",
                                topic.difficulty === 'advanced' && "bg-destructive/20 text-destructive"
                              )}>
                                {topic.difficulty[0].toUpperCase()}
                              </span>
                            </div>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isCollapsed && (
          <div className="mt-6 space-y-2">
            {dsaCategories.map(category => {
              const categoryTopics = filteredTopics.filter(topic => topic.category === category);
              const IconComponent = categoryIcons[category] || BookOpen;
              const hasAllCompleted = categoryTopics.length > 0 && categoryTopics.every(t => completedTopicIds.has(t.id));
              
              if (categoryTopics.length === 0) return null;
              
              return (
                <div key={category} className="relative group">
                  <button
                    className="nav-link flex items-center justify-center w-full p-3 relative"
                    title={category}
                  >
                    <IconComponent className="h-4 w-4" />
                    {hasAllCompleted && (
                      <CheckCircle
                        className="h-3 w-3 text-success absolute -top-1 -right-1"
                        aria-label="All topics complete"
                      />
                    )}
                  </button>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-2 top-0 bg-popover border rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 min-w-48">
                    <div className="font-semibold text-sm mb-1">{category}</div>
                    <div className="space-y-1">
                      {categoryTopics.slice(0, 5).map(topic => (
                        <NavLink
                          key={topic.id}
                          to={`/topic/${topic.id}`}
                          className="block text-xs hover:text-primary transition-colors"
                        >
                          {topic.title}
                        </NavLink>
                      ))}
                      {categoryTopics.length > 5 && (
                        <div className="text-xs text-muted-foreground">
                          +{categoryTopics.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}