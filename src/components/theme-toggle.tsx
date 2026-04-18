'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <HugeiconsIcon icon={SunIcon} size={20} />
      ) : (
        <HugeiconsIcon icon={MoonIcon} size={20} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
