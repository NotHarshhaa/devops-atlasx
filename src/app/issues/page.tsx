'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getAllTags } from '@/lib/issues';
import { Grid02Icon, ListXIcon } from '@hugeicons/core-free-icons';
import { searchIssues, filterIssues, getTools, getCategories } from '@/lib/issues';
import type { Issue, IssueFilters } from '@/lib/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { SearchIcon } from '@hugeicons/core-free-icons';

function IssuesContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedTool, setSelectedTool] = useState(searchParams.get('tool') || 'all');
  const [selectedSeverity, setSelectedSeverity] = useState(searchParams.get('severity') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'all');
  const [sortBy, setSortBy] = useState<'popularity' | 'severity' | 'title'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const tools = getTools().map(t => t.name);
  const categories = getCategories().map(c => c.name);
  const severities = ['P1', 'P2', 'P3'];
  const tags = getAllTags();

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'P1':
        return 'bg-red-500/20 text-red-400';
      case 'P2':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'P3':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'P1':
        return 'CRITICAL';
      case 'P2':
        return 'WARNING';
      case 'P3':
        return 'LOW';
      default:
        return severity;
    }
  };

  useEffect(() => {
    const filters: IssueFilters = {
      tool: selectedTool && selectedTool !== 'all' ? selectedTool : undefined,
      severity: selectedSeverity && selectedSeverity !== 'all' ? selectedSeverity as any : undefined,
      category: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
      tag: selectedTag && selectedTag !== 'all' ? selectedTag : undefined,
      query: searchQuery || undefined,
    };
    let results = filterIssues(filters);
    
    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'severity':
          const severityOrder = { 'P1': 0, 'P2': 1, 'P3': 2 };
          return severityOrder[a.severity] - severityOrder[b.severity];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    setFilteredIssues(results);
    setCurrentPage(1);
  }, [searchQuery, selectedTool, selectedSeverity, selectedCategory, selectedTag, sortBy]);

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIssues = filteredIssues.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTool('all');
    setSelectedSeverity('all');
    setSelectedCategory('all');
    setSelectedTag('all');
  };

  const removeFilter = (filterType: 'tool' | 'severity' | 'category' | 'tag') => {
    switch (filterType) {
      case 'tool': setSelectedTool('all'); break;
      case 'severity': setSelectedSeverity('all'); break;
      case 'category': setSelectedCategory('all'); break;
      case 'tag': setSelectedTag('all'); break;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Page Header */}
      <div className="bg-card border-b border-border/50">
        <div className="container mx-auto px-3 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
            Issues
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <HugeiconsIcon icon={SearchIcon} size={18} className="sm:size-5" />
              </div>
              <Input
                type="text"
                placeholder="Search issues, symptoms, or tags..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-10 sm:h-12"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center items-center">
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-[140px] sm:w-[180px]">
                <SelectValue placeholder="All Tools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tools</SelectItem>
                {tools.map((tool) => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-[100px] sm:w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {severities.map((severity) => (
                  <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px] sm:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-[140px] sm:w-[180px]">
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {tags.slice(0, 20).map((tag) => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px] sm:w-[160px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="severity">Severity</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            {(selectedTool !== 'all' || selectedSeverity !== 'all' || selectedCategory !== 'all' || selectedTag !== 'all') && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters */}
      <div className="container mx-auto px-3 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
          </p>
          
          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {selectedTool !== 'all' && (
              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80" onClick={() => removeFilter('tool')}>
                Tool: {selectedTool}
                <span className="ml-1">×</span>
              </Badge>
            )}
            {selectedSeverity !== 'all' && (
              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80" onClick={() => removeFilter('severity')}>
                Severity: {selectedSeverity}
                <span className="ml-1">×</span>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80" onClick={() => removeFilter('category')}>
                Category: {selectedCategory}
                <span className="ml-1">×</span>
              </Badge>
            )}
            {selectedTag !== 'all' && (
              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80" onClick={() => removeFilter('tag')}>
                Tag: {selectedTag}
                <span className="ml-1">×</span>
              </Badge>
            )}
          </div>

          {/* View Toggle */}
          <ToggleGroup type="single" value={viewMode} onValueChange={(value: any) => value && setViewMode(value)}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <HugeiconsIcon icon={Grid02Icon} size={18} />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <HugeiconsIcon icon={ListXIcon} size={18} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="container mx-auto px-3 pb-6 sm:pb-8">
        {currentIssues.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-lg sm:text-xl text-muted-foreground mb-4">
              No issues found matching your criteria
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' 
            : 'flex flex-col gap-3'
          }>
            {currentIssues.map((issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`}>
                <Card className={`bg-card border-border/50 shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${viewMode === 'list' ? 'flex flex-row' : 'h-full'}`}>
                  {viewMode === 'grid' ? (
                    <>
                      <CardHeader className="pb-2 sm:pb-3">
                        <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 uppercase tracking-wide">{issue.category}</div>
                        <CardTitle className="text-base sm:text-lg line-clamp-2">{issue.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4">
                          {issue.symptoms[0]}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                              issue.severity === 'P1' ? 'bg-red-500/20 text-red-400' :
                              issue.severity === 'P2' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {getSeverityLabel(issue.severity)}
                            </span>
                            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase">{issue.tool}</span>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex-1 flex flex-row items-center gap-4 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 uppercase tracking-wide">{issue.category}</div>
                        <CardTitle className="text-sm sm:text-base line-clamp-1">{issue.title}</CardTitle>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {issue.symptoms[0]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                          issue.severity === 'P1' ? 'bg-red-500/20 text-red-400' :
                          issue.severity === 'P2' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {getSeverityLabel(issue.severity)}
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground uppercase">{issue.tool}</span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IssuesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <IssuesContent />
    </Suspense>
  );
}
