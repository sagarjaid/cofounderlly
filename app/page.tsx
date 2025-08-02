"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Zap, Shield, Calendar, Linkedin, Search, Star } from "lucide-react"
import Link from "next/link"
import { signInWithLinkedIn } from "@/lib/auth"
import { useState } from "react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLinkedInSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithLinkedIn()
    } catch (error) {
      console.error("LinkedIn sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">CoFounder</span>
            <Badge variant="secondary" className="ml-2">
              BETA
            </Badge>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-blue-600">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-blue-600">
              Pricing
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-blue-600">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button onClick={handleLinkedInSignIn} disabled={isLoading}>
              {isLoading ? "Connecting..." : "Join Beta"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              🚀 Now in Private Beta - Free Access
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Perfect Co-Founder
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Join an exclusive network of verified entrepreneurs. Connect with Hackers, Hipsters, and Hustlers who are
            ready to build the next big thing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" onClick={handleLinkedInSignIn} disabled={isLoading}>
              <Linkedin className="w-5 h-5 mr-2" />
              {isLoading ? "Connecting..." : "Join with LinkedIn"}
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-slate-600">Verified Founders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
              <div className="text-slate-600">Successful Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">$2M+</div>
              <div className="text-slate-600">Funding Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Types */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Your Co-Founder Type</h2>
            <p className="text-slate-600 text-lg">Connect with the right skills to complement your expertise</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600">🧑‍💻 Hacker</CardTitle>
                <CardDescription>Technical Co-Founders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Developers, engineers, and technical experts who can build and scale your product.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-600">🎨 Hipster</CardTitle>
                <CardDescription>Design & Product Co-Founders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Designers, product managers, and UX experts who create amazing user experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-green-600">📈 Hustler</CardTitle>
                <CardDescription>Business Co-Founders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Sales, marketing, and business development experts who drive growth and revenue.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CoFounder?</h2>
            <p className="text-slate-600 text-lg">Built for serious entrepreneurs who are ready to commit</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Verified Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  All members verified through LinkedIn. No fake profiles, only serious entrepreneurs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Easy Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Integrated calendar booking. Schedule meetings directly through Calendly, Google Calendar, or Cal.com.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Search className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Advanced filters by location, availability, skills, and co-founder type for perfect matches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600 text-lg mb-12">Join our exclusive network of verified entrepreneurs</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="border-2 border-blue-200 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">Current</Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Beta Access</CardTitle>
                <div className="text-4xl font-bold text-blue-600 my-4">Free</div>
                <CardDescription>Limited time beta access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Full platform access</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Unlimited searches</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Direct messaging</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Calendar integration</span>
                </div>
              </CardContent>
            </Card>

            <Card className="opacity-75">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Premium</CardTitle>
                <div className="text-4xl font-bold text-slate-400 my-4">$49/mo</div>
                <CardDescription>Coming after beta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mr-3"></div>
                  <span className="text-sm text-slate-500">Everything in Beta</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mr-3"></div>
                  <span className="text-sm text-slate-500">Priority support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mr-3"></div>
                  <span className="text-sm text-slate-500">Advanced analytics</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mr-3"></div>
                  <span className="text-sm text-slate-500">Featured profile</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Co-Founder?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of entrepreneurs who are building the future together.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
            onClick={handleLinkedInSignIn}
            disabled={isLoading}
          >
            <Linkedin className="w-5 h-5 mr-2" />
            {isLoading ? "Connecting..." : "Get Started - Free Beta"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CoFounder</span>
              </div>
              <p className="text-slate-400 text-sm">The exclusive network for finding your perfect co-founder.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 CoFounder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
