import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, RefreshCw, Shield, ShoppingCart, Star, Truck } from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';

const featuredProducts = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.8,
    reviews: 124,
    badge: 'Best Seller',
    description: 'High-quality sound with noise cancellation',
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.6,
    reviews: 89,
    badge: 'New',
    description: 'Track your health and fitness goals',
  },
  {
    id: 3,
    name: 'Minimalist Backpack',
    price: 89.99,
    originalPrice: 119.99,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.9,
    reviews: 156,
    badge: 'Sale',
    description: 'Perfect for work and travel',
  },
  {
    id: 4,
    name: 'Wireless Charging Pad',
    price: 49.99,
    originalPrice: 69.99,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.5,
    reviews: 67,
    badge: 'Popular',
    description: 'Fast wireless charging for all devices',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    text: 'Amazing quality products and fast shipping. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Mike Chen',
    text: 'Great customer service and the products exceeded my expectations.',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    text: 'Love the minimalist design and premium feel of everything I ordered.',
    rating: 5,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">TechStore</div>
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
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart (0)
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            New Collection
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Premium Tech Products
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our curated collection of high-quality tech products designed to enhance your lifestyle and
            productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Shop Now
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              View Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-b">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Free shipping on orders over $100</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2 Year Warranty</h3>
              <p className="text-muted-foreground">Comprehensive warranty on all products</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">30-Day Returns</h3>
              <p className="text-muted-foreground">Easy returns within 30 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked products that combine innovation, quality, and style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge
                      className="absolute top-3 left-3"
                      variant={product.badge === 'Sale' ? 'destructive' : 'secondary'}
                    >
                      {product.badge}
                    </Badge>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array.from({ length: 5 })].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      {product.rating}
                      {' '}
                      (
                      {product.reviews}
                      )
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      $
                      {product.price}
                    </span>
                    <span className="text-muted-foreground line-through">
                      $
                      {product.originalPrice}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground">Join thousands of satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {[...new Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "
                    {testimonial.text}
                    "
                  </p>
                  <p className="font-semibold">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Upgrade Your Tech?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of customers who trust us for their tech needs</p>
          <Button size="lg" variant="secondary" className="text-lg px-8">
            Start Shopping Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">TechStore</h3>
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
            <p>&copy; 2024 TechStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
