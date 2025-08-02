"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, ArrowLeft, Save, Upload, Linkedin, Calendar } from "lucide-react"
import Link from "next/link"
import { getCurrentProfile, updateProfile } from "@/lib/auth"

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    linkedinUrl: "",
    avatarUrl: "", // Added avatarUrl
    location: "",
    timezone: "",
    founderType: "",
    lookingFor: [] as string[],
    weeklyHours: "",
    hasIdea: "",
    ideaDescription: "",
    lookingToJoin: false,
    calendarType: "",
    calendarUrl: "",
    bio: "",
    skills: [] as string[],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [extraProfileFields, setExtraProfileFields] = useState<any>({})

  // Load user data from Supabase on component mount
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getCurrentProfile()
      if (profile) {
        setFormData({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          email: profile.email || "",
          linkedinUrl: profile.linkedin_url || "",
          avatarUrl: profile.avatar_url || "", // Load avatarUrl
          location: profile.location || "",
          timezone: profile.timezone || "",
          founderType: profile.founder_type || "",
          lookingFor: Array.isArray(profile.looking_for) ? profile.looking_for : [],
          weeklyHours: profile.weekly_hours || "",
          hasIdea: profile.has_idea || "",
          ideaDescription: profile.idea_description || "",
          lookingToJoin: typeof profile.looking_to_join === 'boolean' ? profile.looking_to_join : false,
          calendarType: profile.calendar_type || "",
          calendarUrl: profile.calendar_url || "",
          bio: profile.bio || "",
          skills: Array.isArray(profile.skills) ? profile.skills : [],
        })
        // Store extra fields for display
        setExtraProfileFields({
          is_online: profile.is_online,
          member_since: profile.member_since,
          match_score: profile.match_score,
          response_rate: profile.response_rate,
          avg_response_time: profile.avg_response_time,
          onboarding_complete: profile.onboarding_complete,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        })
      }
      setProfileLoaded(true)
    }
    loadProfile()
  }, [])

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayField = (field: string, value: string) => {
    setFormData((prev) => {
      const current = prev[field as keyof typeof prev];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [field]: current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value],
        };
      }
      // If not an array, just return prev (or handle as needed)
      return prev;
    });
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        linkedin_url: formData.linkedinUrl,
        avatar_url: formData.avatarUrl,
        location: formData.location,
        timezone: formData.timezone,
        founder_type: formData.founderType as "hacker" | "hipster" | "hustler" | null,
        looking_for: formData.lookingFor,
        weekly_hours: formData.weeklyHours,
        has_idea: formData.hasIdea,
        idea_description: formData.ideaDescription,
        looking_to_join: formData.lookingToJoin,
        calendar_type: formData.calendarType,
        calendar_url: formData.calendarUrl,
        bio: formData.bio,
        skills: formData.skills,
        updated_at: new Date().toISOString(),
      })
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Error saving profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    !profileLoaded ? (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading profile...</span>
      </div>
    ) : (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">CoFounder</span>
                </div>
              </div>

              <Button onClick={handleSave} disabled={isLoading} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
            <p className="text-slate-600">Update your information to attract the right co-founders</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>This will be visible to other founders</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src={formData.avatarUrl || "/placeholder.svg?height=128&width=128"} />
                    <AvatarFallback className="text-2xl">
                      {formData.firstName && formData.lastName ? `${formData.firstName[0]}${formData.lastName[0]}` : "JD"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-slate-500">Recommended: Square image, at least 400x400px</p>
                </CardContent>
              </Card>
            </div>

            {/* Form Sections */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={(e) => updateFormData("linkedinUrl", e.target.value)}
                        placeholder="https://linkedin.com/in/johndoe"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div>
                      <Label>Timezone</Label>
                      <Select value={formData.timezone} onValueChange={(value) => updateFormData("timezone", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pst">PST (UTC-8)</SelectItem>
                          <SelectItem value="mst">MST (UTC-7)</SelectItem>
                          <SelectItem value="cst">CST (UTC-6)</SelectItem>
                          <SelectItem value="est">EST (UTC-5)</SelectItem>
                          <SelectItem value="utc">UTC (UTC+0)</SelectItem>
                          <SelectItem value="cet">CET (UTC+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Founder Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Founder Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>I am a...</Label>
                    <RadioGroup
                      value={formData.founderType}
                      onValueChange={(value) => updateFormData("founderType", value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hacker" id="hacker" />
                        <Label htmlFor="hacker" className="flex items-center space-x-2">
                          <span>🧑‍💻 Hacker</span>
                          <span className="text-sm text-slate-500">(Technical)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hipster" id="hipster" />
                        <Label htmlFor="hipster" className="flex items-center space-x-2">
                          <span>🎨 Hipster</span>
                          <span className="text-sm text-slate-500">(Design/Product)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hustler" id="hustler" />
                        <Label htmlFor="hustler" className="flex items-center space-x-2">
                          <span>📈 Hustler</span>
                          <span className="text-sm text-slate-500">(Business/Sales)</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>I'm looking for... (select all that apply)</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {["hacker", "hipster", "hustler"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`looking-${type}`}
                            checked={formData.lookingFor.includes(type)}
                            onCheckedChange={() => toggleArrayField("lookingFor", type)}
                          />
                          <Label htmlFor={`looking-${type}`} className="flex items-center space-x-2">
                            <span>
                              {type === "hacker" && "🧑‍💻 Hacker (Technical)"}
                              {type === "hipster" && "🎨 Hipster (Design/Product)"}
                              {type === "hustler" && "📈 Hustler (Business/Sales)"}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Weekly Time Commitment</Label>
                    <Select value={formData.weeklyHours} onValueChange={(value) => updateFormData("weeklyHours", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="How many hours per week?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-10">0-10 hours/week</SelectItem>
                        <SelectItem value="10-20">10-20 hours/week</SelectItem>
                        <SelectItem value="20-30">20-30 hours/week</SelectItem>
                        <SelectItem value="30-40">30-40 hours/week</SelectItem>
                        <SelectItem value="40+">40+ hours/week (Full-time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Startup Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Startup Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Do you have a startup idea?</Label>
                    <RadioGroup
                      value={formData.hasIdea}
                      onValueChange={(value) => updateFormData("hasIdea", value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="has-idea" />
                        <Label htmlFor="has-idea">Yes, I have an idea and need help building it</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-idea" />
                        <Label htmlFor="no-idea">No, I want to join someone else's idea</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both">Both - I'm open to either</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {(formData.hasIdea === "yes" || formData.hasIdea === "both") && (
                    <div>
                      <Label htmlFor="ideaDescription">Tell us about your idea</Label>
                      <Textarea
                        id="ideaDescription"
                        value={formData.ideaDescription}
                        onChange={(e) => updateFormData("ideaDescription", e.target.value)}
                        placeholder="Describe your startup idea, the problem you're solving, and what kind of co-founder would complement your skills..."
                        rows={4}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lookingToJoin"
                      checked={formData.lookingToJoin}
                      onCheckedChange={(checked) => updateFormData("lookingToJoin", checked)}
                    />
                    <Label htmlFor="lookingToJoin">
                      I'm also interested in adding value to existing ideas and helping them grow
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Calendar & Bio */}
              <Card>
                <CardHeader>
                  <CardTitle>Calendar & Bio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Calendar Integration</Label>
                    <Select
                      value={formData.calendarType}
                      onValueChange={(value) => updateFormData("calendarType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your calendar platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calendly">Calendly</SelectItem>
                        <SelectItem value="cal">Cal.com</SelectItem>
                        <SelectItem value="google">Google Calendar</SelectItem>
                        <SelectItem value="outlook">Outlook Calendar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="calendarUrl">Calendar Booking URL</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="calendarUrl"
                        value={formData.calendarUrl}
                        onChange={(e) => updateFormData("calendarUrl", e.target.value)}
                        placeholder="https://calendly.com/johndoe or https://cal.com/johndoe"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateFormData("bio", e.target.value)}
                      placeholder="Tell potential co-founders about yourself, your background, what you're passionate about, and what you bring to the table..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Key Skills</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        "React",
                        "Node.js",
                        "Python",
                        "AI/ML",
                        "Mobile Dev",
                        "DevOps",
                        "UI/UX Design",
                        "Product Management",
                        "Marketing",
                        "Sales",
                        "Fundraising",
                        "Operations",
                        "Strategy",
                        "Analytics",
                      ].map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={formData.skills.includes(skill)}
                            onCheckedChange={() => toggleArrayField("skills", skill)}
                          />
                          <Label htmlFor={`skill-${skill}`} className="text-sm">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading} size="lg" className="px-8">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
              {/* Show all DB fields for debug/visibility */}
              <div className="mt-8">
                <h2 className="text-lg font-bold mb-2">Profile Data in Database</h2>
                <div className="bg-slate-100 rounded p-4 text-xs overflow-x-auto">
                  <pre>{JSON.stringify({ ...formData, ...extraProfileFields }, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
