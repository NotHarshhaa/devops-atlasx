'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchIssues, filterIssues, getTools, getCategories } from '@/lib/issues';
import type { Issue, IssueFilters } from '@/lib/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { SearchIcon } from '@hugeicons/core-free-icons';

function IssuesContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedTool, setSelectedTool] = useState(searchParams.get('tool') || '');
  const [selectedSeverity, setSelectedSeverity] = useState(searchParams.get('severity') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const tools = getTools().map(t => t.name);
  const categories = getCategories().map(c => c.name);
  const severities = ['P1', 'P2', 'P3'];

  const severityColors: Record<string, string> = {
    'P1': 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
    'P2': 'bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400',
    'P3': 'bg-gray-400 text-white hover:bg-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500',
  };

  useEffect(() => {
    const filters: IssueFilters = {
      tool: selectedTool || undefined,
      severity: selectedSeverity as any || undefined,
      category: selectedCategory || undefined,
      query: searchQuery || undefined,
    };
    const results = filterIssues(filters);
    setFilteredIssues(results);
    setCurrentPage(1);
  }, [searchQuery, selectedTool, selectedSeverity, selectedCategory]);

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIssues = filteredIssues.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTool('');
    setSelectedSeverity('');
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-6 text-center">
            Issues
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <HugeiconsIcon icon={SearchIcon} size={20} />
              </div>
              <Input
                type="text"
                placeholder="Search issues, symptoms, or tags..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="All Tools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tools</SelectItem>
                {tools.map((tool) => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-[140px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {severities.map((severity) => (
                  <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedTool || selectedSeverity || selectedCategory) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="container mx-auto px-4 py-6">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Issues Grid */}
      <div className="container mx-auto px-4 pb-8">
        {currentIssues.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No issues found matching your criteria
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentIssues.map((issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={severityColors[issue.severity]}>
                        {issue.severity}
                      </Badge>
                      <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
                        {issue.tool}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{issue.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {issue.symptoms[0]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {issue.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {issue.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{issue.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-gray-600 dark:text-gray-400">
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
