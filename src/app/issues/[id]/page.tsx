'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getIssueById } from '@/lib/issues';
import type { Issue } from '@/lib/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.id as string;
  const issue = getIssueById(issueId);

  const severityColors: Record<string, string> = {
    'P1': 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
    'P2': 'bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400',
    'P3': 'bg-gray-400 text-white hover:bg-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500',
  };

  if (!issue) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
            Issue Not Found
          </h1>
          <Link href="/issues">
            <Button variant="outline">
              Back to Issues
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = (items: string[]) => {
    return items.map((item, index) => {
      // Check if item contains code blocks
      if (item.includes('```')) {
        const parts = item.split('```');
        return (
          <div key={index} className="mb-3">
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                // This is a code block
                const firstLineBreak = part.indexOf('\n');
                let language = 'bash';
                let code = part;
                
                if (firstLineBreak !== -1) {
                  language = part.substring(0, firstLineBreak).trim();
                  code = part.substring(firstLineBreak + 1);
                }
                
                return (
                  <pre key={partIndex} className="bg-gray-900 dark:bg-gray-950 text-gray-50 p-4 rounded-lg overflow-x-auto my-2">
                    <code>{code}</code>
                  </pre>
                );
              } else {
                return <span key={partIndex}>{part}</span>;
              }
            })}
          </div>
        );
      }
      return <li key={index} className="mb-2">{item}</li>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back
        </Button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title and Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge className={severityColors[issue.severity]}>
              {issue.severity}
            </Badge>
            <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
              {issue.tool}
            </Badge>
            <Badge variant="secondary">
              {issue.category}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            {issue.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {issue.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <Card className="mb-6 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {issue.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Root Cause */}
        <Card className="mb-6 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Root Cause</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {issue.root_cause.map((cause, index) => (
                <li key={index}>{cause}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Diagnosis */}
        <Card className="mb-6 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {issue.diagnosis.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Fix */}
        <Card className="mb-6 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Fix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              {renderContent(issue.fix)}
            </div>
          </CardContent>
        </Card>

        {/* Prevention */}
        <Card className="mb-6 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Prevention</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {issue.prevention.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
