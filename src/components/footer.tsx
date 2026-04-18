import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { SearchIcon } from '@hugeicons/core-free-icons';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-3 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <HugeiconsIcon icon={SearchIcon} size={20} className="sm:size-6" />
              <span className="text-lg sm:text-xl font-bold">
                DevOps AtlasX
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Find real-world DevOps production issues and fixes instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-2 sm:mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-xs sm:text-sm hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/issues" className="text-xs sm:text-sm hover:underline">
                  Browse Issues
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-2 sm:mb-3">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/issues?tool=Docker" className="text-xs sm:text-sm hover:underline">
                  Docker
                </Link>
              </li>
              <li>
                <Link href="/issues?tool=Kubernetes" className="text-xs sm:text-sm hover:underline">
                  Kubernetes
                </Link>
              </li>
              <li>
                <Link href="/issues?tool=AWS" className="text-xs sm:text-sm hover:underline">
                  AWS
                </Link>
              </li>
              <li>
                <Link href="/issues?tool=Terraform" className="text-xs sm:text-sm hover:underline">
                  Terraform
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-2 sm:mb-3">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/issues?category=Containers" className="text-xs sm:text-sm hover:underline">
                  Containers
                </Link>
              </li>
              <li>
                <Link href="/issues?category=Cloud" className="text-xs sm:text-sm hover:underline">
                  Cloud
                </Link>
              </li>
              <li>
                <Link href="/issues?category=Infrastructure as Code" className="text-xs sm:text-sm hover:underline">
                  Infrastructure as Code
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevOps AtlasX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
