import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, TrendingUp, Shield, Zap, Star, ArrowRight } from "lucide-react"
import { HeroSection } from "@/components/ui/hero-section-1"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <section id="about" className="py-20 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm inline-block mb-6">
              <span className="text-blue-300 text-sm font-medium">About Us</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-light mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Built on intelligence, innovation, and trust
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              We leverage cutting-edge artificial intelligence to revolutionize financial advisory services, providing
              personalized insights and strategies that adapt to your unique financial journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-b from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">Smart Analytics</h3>
                <p className="text-gray-400">
                  Advanced AI algorithms analyze market trends and personal data to provide actionable insights.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">Secure & Private</h3>
                <p className="text-gray-400">
                  Bank-level security ensures your financial data remains protected and confidential.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">Real-time Decisions</h3>
                <p className="text-gray-400">Get instant recommendations and automated portfolio adjustments 24/7.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm inline-block mb-6">
              <span className="text-blue-300 text-sm font-medium">Our Services</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-light mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Comprehensive Financial Solutions
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Portfolio Management</h3>
                  <p className="text-gray-400">
                    AI-powered portfolio optimization with real-time rebalancing and risk management.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Retirement Planning</h3>
                  <p className="text-gray-400">
                    Personalized retirement strategies based on your goals, timeline, and risk tolerance.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Tax Optimization</h3>
                  <p className="text-gray-400">
                    Smart tax-loss harvesting and strategic planning to minimize your tax burden.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Financial Planning</h3>
                  <p className="text-gray-400">
                    Comprehensive financial roadmaps tailored to your life goals and circumstances.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl p-8 border border-blue-500/30 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-4 text-white">Why Choose AI-Driven Advisory?</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• 24/7 market monitoring and analysis</li>
                  <li>• Emotion-free investment decisions</li>
                  <li>• Lower fees than traditional advisors</li>
                  <li>• Personalized recommendations at scale</li>
                  <li>• Continuous learning and improvement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm inline-block mb-6">
              <span className="text-blue-300 text-sm font-medium">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-light mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Trusted by thousands
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-b from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-blue-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "Srin transformed my investment strategy. The AI insights helped me achieve 23% returns last year
                  while managing risk perfectly."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">S</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Sarah Johnson</p>
                    <p className="text-gray-400 text-sm">Tech Executive</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-blue-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "The retirement planning feature is incredible. It automatically adjusts my portfolio as I get closer
                  to my goals. Peace of mind guaranteed."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">M</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Michael Chen</p>
                    <p className="text-gray-400 text-sm">Small Business Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-blue-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "Finally, a financial advisor that works around the clock. The tax optimization alone saved me
                  thousands this year."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">E</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Emily Rodriguez</p>
                    <p className="text-gray-400 text-sm">Marketing Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm inline-block mb-6">
              <span className="text-blue-300 text-sm font-medium">Pricing</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-light mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Choose your plan
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-b from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-2 text-white">Starter</h3>
                <p className="text-gray-400 mb-6">Perfect for beginners</p>
                <div className="mb-6">
                  <span className="text-4xl font-medium text-white">$29</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Basic portfolio management
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Monthly reports
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Email support
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-300">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-blue-500/20 to-blue-600/10 border-2 border-blue-500/40 backdrop-blur-sm relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-2 text-white">Professional</h3>
                <p className="text-gray-400 mb-6">For serious investors</p>
                <div className="mb-6">
                  <span className="text-4xl font-medium text-white">$99</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Advanced portfolio management
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Weekly reports & insights
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Tax optimization
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-2 text-white">Enterprise</h3>
                <p className="text-gray-400 mb-6">For wealth management</p>
                <div className="mb-6">
                  <span className="text-4xl font-medium text-white">$299</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Full-service management
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Daily insights & alerts
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Personal advisor access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                    24/7 phone support
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-300">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm inline-block mb-6">
              <span className="text-blue-300 text-sm font-medium">Get In Touch</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-light mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to transform your finances?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of investors who trust AI to manage their financial future.
            </p>
          </div>

          <Card className="bg-gradient-to-b from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Investment Goals</label>
                  <select className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <option>Select your primary goal</option>
                    <option>Retirement Planning</option>
                    <option>Wealth Building</option>
                    <option>Tax Optimization</option>
                    <option>Portfolio Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Tell us about your financial goals..."
                  ></textarea>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3">
                  Start Your Financial Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-blue-500/20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="Srin Logo" className="h-8 w-8" />
                <span className="text-white font-semibold text-lg">Srin</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing financial advisory through artificial intelligence and data-driven insights.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Portfolio Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Retirement Planning
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tax Optimization
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Financial Planning
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-500/20 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Srin. All rights reserved. Built with intelligence, innovation, and trust.
            </p>
          </div>
        </div>
      </footer>

      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/10 via-transparent to-blue-900/10 pointer-events-none"></div>
    </div>
  )
}
