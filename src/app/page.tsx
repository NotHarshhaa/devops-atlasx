'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPopularIssues, getTools, getCategories } from '@/lib/issues';
import type { Issue } from '@/lib/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { SearchIcon, ArrowRightIcon, GitBranchIcon } from '@hugeicons/core-free-icons';

const toolIcons: Record<string, React.ReactNode> = {
  'Docker': <HugeiconsIcon icon={GitBranchIcon} size={24} />,
  'Kubernetes': <HugeiconsIcon icon={GitBranchIcon} size={24} />,
  'AWS': <HugeiconsIcon icon={GitBranchIcon} size={24} />,
  'Terraform': <HugeiconsIcon icon={GitBranchIcon} size={24} />,
  'CI/CD': <HugeiconsIcon icon={GitBranchIcon} size={24} />,
  'Networking': <HugeiconsIcon icon={GitBranchIcon} size={24} />,
  'Observability': <HugeiconsIcon icon={GitBranchIcon} size={24} />,
};

const severityColors: Record<string, string> = {
  'P1': 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
  'P2': 'bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400',
  'P3': 'bg-gray-400 text-white hover:bg-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500',
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const popularIssues = getPopularIssues(6);
  const tools = getTools().map(t => t.name);
  const categories = getCategories().map(c => c.name);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/issues?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-6">
            DevOps AtlasX
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10">
            Find real-world DevOps production issues and fixes instantly
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <HugeiconsIcon icon={SearchIcon} size={20} />
                </div>
                <Input
                  type="text"
                  placeholder="Search issues, symptoms, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-14 text-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-14 px-8 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Search
              </Button>
            </div>
          </div>

          <Link href="/issues">
            <Button variant="outline" className="gap-2">
              Browse All Issues <HugeiconsIcon icon={ArrowRightIcon} size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Popular Issues */}
      <section className="container mx-auto px-4 py-16 bg-white dark:bg-black rounded-2xl mb-16">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
          Popular Issues
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularIssues.map((issue) => (
            <Link key={issue.id} href={`/issues/${issue.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
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
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Tool */}
      <section className="container mx-auto px-4 py-16 bg-white dark:bg-black rounded-2xl mb-16">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
          Browse by Tool
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {tools.map((tool) => (
            <Link key={tool} href={`/issues?tool=${encodeURIComponent(tool)}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-2 text-black dark:text-white">
                    {toolIcons[tool] || <HugeiconsIcon icon={GitBranchIcon} size={24} />}
                  </div>
                  <p className="font-medium text-black dark:text-white">{tool}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="container mx-auto px-4 py-16 bg-white dark:bg-black rounded-2xl mb-16">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link key={category} href={`/issues?category=${encodeURIComponent(category)}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <p className="font-medium text-black dark:text-white">{category}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
