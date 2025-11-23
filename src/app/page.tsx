import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Download, Users, Search, Star, Shield } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Cambridge Study Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Free access to Cambridge past papers, notes, and study resources
          </p>
          <p className="text-lg mb-8 text-blue-100 max-w-3xl mx-auto">
            Access thousands of Cambridge IGCSE, AS-Level, and A-Level resources. 
            Past papers are freely available to everyone, while Cambridge books require unique login credentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/past-papers">
                <FileText className="mr-2 h-5 w-5" />
                Browse Past Papers
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/auth/signup">
                <BookOpen className="mr-2 h-5 w-5" />
                Get Book Access
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive study resources organized by subject, year, and type
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Past Papers</CardTitle>
                <CardDescription>
                  Free access to all Cambridge past papers with mark schemes and examiner reports
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Cambridge Books</CardTitle>
                <CardDescription>
                  Official Cambridge textbooks with controlled access through unique login credentials
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Search className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Smart Search</CardTitle>
                <CardDescription>
                  Find resources quickly by subject, year, paper number, or keyword
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Download className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Easy Downloads</CardTitle>
                <CardDescription>
                  Download individual files or entire subject/year packs as ZIP archives
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Bookmarks</CardTitle>
                <CardDescription>
                  Save your favorite resources for quick access later
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Secure Access</CardTitle>
                <CardDescription>
                  Protected book access with unique credentials for authorized users
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Resource Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you need from our organized collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/past-papers">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <FileText className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Past Papers</CardTitle>
                  <CardDescription>
                    Free access to all Cambridge past papers by subject and year
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/mark-schemes">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <FileText className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Mark Schemes</CardTitle>
                  <CardDescription>
                    Official marking schemes for all past papers
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/examiner-reports">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <FileText className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Examiner Reports</CardTitle>
                  <CardDescription>
                    Detailed reports on exam performance and common mistakes
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/books">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-orange-600 mb-2" />
                  <CardTitle>Cambridge Books</CardTitle>
                  <CardDescription>
                    Official textbooks (login required)
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/syllabi">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <FileText className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle>Syllabi</CardTitle>
                  <CardDescription>
                    Current and past syllabi for all subjects
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/notes">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <FileText className="h-8 w-8 text-yellow-600 mb-2" />
                  <CardTitle>Study Notes</CardTitle>
                  <CardDescription>
                    Comprehensive notes and study guides
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Thousands of Students
            </h2>
            <p className="text-xl text-blue-100">
              Growing community of Cambridge students worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Resources Available</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Downloads</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Subjects Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Excel in Your Cambridge Studies?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start exploring our comprehensive collection of study resources today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/past-papers">
                <FileText className="mr-2 h-5 w-5" />
                Browse Resources
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signup">
                <Users className="mr-2 h-5 w-5" />
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">Cambridge Study Hub</span>
              </div>
              <p className="text-gray-400">
                Free access to Cambridge study resources with controlled book access.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/past-papers" className="hover:text-white">Past Papers</Link></li>
                <li><Link href="/mark-schemes" className="hover:text-white">Mark Schemes</Link></li>
                <li><Link href="/examiner-reports" className="hover:text-white">Examiner Reports</Link></li>
                <li><Link href="/syllabi" className="hover:text-white">Syllabi</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/auth/signin" className="hover:text-white">Sign In</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white">Sign Up</Link></li>
                <li><Link href="/bookmarks" className="hover:text-white">Bookmarks</Link></li>
                <li><Link href="/admin" className="hover:text-white">Admin</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Cambridge Study Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}