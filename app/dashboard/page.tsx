"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Filter, MapPin, Clock, Calendar, Star, Settings, Bell, Linkedin, Zap } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient, type Profile } from "@/lib/supabase-client"
import { getCurrentUser, signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [founders, setFounders] = useState<Profile[]>([])
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          console.log("No user found, redirecting to login...")
          router.push("/login")
          return
        }

        const supabase = createClient()

        // Load current user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("Error loading profile:", profileError)
          router.push("/login")
          return
        }

        if (!profile) {
          console.log("No profile found, redirecting to onboarding...")
          router.push("/signup/complete")
          return
        }

        // Double-check onboarding completion (this should be handled by auth callback, but just in case)
        if (!profile.onboarding_complete) {
          console.log("Onboarding not complete, redirecting to signup completion...")
          router.push("/signup/complete")
          return
        }

        setCurrentUser(profile)
        console.log("Current user profile loaded:", profile.email)

        // Load all founders except current user (only show completed onboarding)
        const { data: foundersData, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", user.id)
          .eq("onboarding_complete", true) // Only show founders who completed onboarding

        if (error) {
          console.error("Error loading founders:", error)
        } else {
          console.log("Loaded founders:", foundersData?.length || 0)
          setFounders(foundersData || [])
        }
      } catch (error) {
        console.error("Error loading data:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const filteredFounders = founders.filter((founder) => {
    const matchesSearch =
      founder.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || founder.founder_type === selectedType
    const matchesLocation = selectedLocation === "all" || founder.location?.includes(selectedLocation)

    return matchesSearch && matchesType && matchesLocation
  })

  const getTypeIcon = (type: string | null) => {
    switch (type) {
      case "hacker":
        return "🧑‍💻"
      case "hipster":
        return "🎨"
      case "hustler":
        return "📈"
      default:
        return "👤"
    }
  }

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case "hacker":
        return "bg-blue-100 text-blue-700"
      case "hipster":
        return "bg-purple-100 text-purple-700"
      case "hustler":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-5 h-5 text-white" />
          </div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CoFounder</span>
              </Link>
              <Badge variant="secondary">BETA</Badge>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium text-blue-600">
                Discover
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.avatar_url || "/placeholder.svg?height=32&width=32"} />
                      <AvatarFallback>
                        {currentUser?.first_name?.[0] || currentUser?.email?.[0]?.toUpperCase()}
                        {currentUser?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.first_name || currentUser?.email} {currentUser?.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile/" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

            
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleSignOut}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Co-Founder Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="hacker">🧑‍💻 Hacker</SelectItem>
                      <SelectItem value="hipster">🎨 Hipster</SelectItem>
                      <SelectItem value="hustler">📈 Hustler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="San Francisco">San Francisco</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="Austin">Austin</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Availability</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any availability</SelectItem>
                      <SelectItem value="part-time">Part-time (0-20h)</SelectItem>
                      <SelectItem value="significant">Significant (20-40h)</SelectItem>
                      <SelectItem value="full-time">Full-time (40h+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Has Idea</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="yes">Has an idea</SelectItem>
                      <SelectItem value="no">Looking to join</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search founders by name, skills, or bio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Discover Co-Founders</h1>
                <p className="text-slate-600">{filteredFounders.length} founders match your criteria</p>
              </div>
              <Select defaultValue="match">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="recent">Recently Joined</SelectItem>
                  <SelectItem value="active">Most Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Founder Cards */}
            <div className="space-y-6">
              {filteredFounders.map((founder) => (
                <Card key={founder.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                  <CardContent className="p-0">
                    {/* Header Section */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start space-x-4">
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-16 h-16 ring-2 ring-white shadow-md">
                            <AvatarImage src={founder.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {founder.first_name?.[0] || founder.email?.[0]?.toUpperCase()}
                              {founder.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          {founder.is_online && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-sm"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-bold text-slate-900">
                                {founder.first_name || founder.email} {founder.last_name}
                              </h3>
                              <Badge className={`${getTypeColor(founder.founder_type)} font-medium px-3 py-1`}>
                                {getTypeIcon(founder.founder_type)}{" "}
                                {founder.founder_type?.charAt(0).toUpperCase() + founder.founder_type?.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                              <Star className="w-4 h-4 fill-green-500 text-green-500" />
                              <span className="text-sm font-semibold text-green-700">{founder.match_score}% match</span>
                            </div>
                          </div>

                          {/* Meta Information */}
                          <div className="flex items-center space-x-6 text-sm text-slate-600 mb-4">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span>{founder.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span>{founder.weekly_hours} hrs/week</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Zap className="w-4 h-4 text-slate-400" />
                              <span>{founder.has_idea === "yes" ? "Has idea" : "Looking to join"}</span>
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-slate-700 leading-relaxed mb-4 line-clamp-2">{founder.bio}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    {founder.skills && founder.skills.length > 0 && (
                      <div className="px-6 pb-4">
                        <div className="flex flex-wrap gap-2">
                          {founder.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Section */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-600">Looking for:</span>
                          <div className="flex space-x-2">
                            {founder.looking_for?.map((type) => (
                              <Badge key={type} variant="outline" className="text-xs border-slate-300 text-slate-600">
                                {getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50" asChild>
                            <Link href={founder.linkedin_url || "#"} target="_blank">
                              <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                              LinkedIn
                            </Link>
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                            <Link href={founder.calendar_url || "#"} target="_blank">
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Meeting
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredFounders.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No founders found</h3>
                  <p className="text-slate-600 mb-4">Try adjusting your search criteria or filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedType("all")
                      setSelectedLocation("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
