'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { HugeiconsIcon } from '@hugeicons/react';
import { SearchIcon, Home01Icon } from '@hugeicons/core-free-icons';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <HugeiconsIcon icon={SearchIcon} size={24} />
            <span className="text-xl font-bold">
              DevOps AtlasX
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button variant="ghost">
                <HugeiconsIcon icon={Home01Icon} size={16} />
                Home
              </Button>
            </Link>
            <Link href="/issues">
              <Button variant="ghost">
                Issues
              </Button>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {/* Mobile menu button could be added here */}
          </div>
        </div>
      </div>
    </header>
  );
}
