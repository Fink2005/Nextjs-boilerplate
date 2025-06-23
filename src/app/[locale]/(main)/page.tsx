import { Button } from '@/components/ui/button';

import Link from 'next/link';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">Fink</div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
          <Button variant="outline" size="sm">
            Cart (0)
          </Button>
        </div>
      </header>

      {/* Hero Section */}

      <div className="flex items-center justify-center h-64 bg-gradient-to-r from-blue-500 to-purple-500 text-white space-x-2">
        <p>
          hello
        </p>
        {' '}
        <h2 className="text-2xl">Fink</h2>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Fink</h3>
              <p className="text-muted-foreground">
                Your trusted partner for premium tech products and exceptional service.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Headphones
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Watches
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Fink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
