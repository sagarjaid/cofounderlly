"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Users, Linkedin, Calendar, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info (only for unauthenticated)
    firstName: "",
    lastName: "",
    email: "",
    linkedinUrl: "",
    avatarUrl: "", // Added avatarUrl
    // Step 2: Profile
    location: "",
    timezone: "",
    founderType: "",
    lookingFor: [] as string[],
    // Step 3: Availability & Goals
    weeklyHours: "",
    hasIdea: "",
    ideaDescription: "",
    lookingToJoin: false,
    // Step 4: Calendar & Final
    calendarType: "",
    calendarUrl: "",
    bio: "",
    skills: [] as string[],
  })

  // Steps: 1 = Basic Info (if unauthenticated), 2 = Profile, 3 = Availability, 4 = Calendar
  const totalSteps = 4

  useEffect(() => {
    const loadUserAndProfile = async () => {
      setLoadingProfile(true)
      const currentUser = await getCurrentUser()
      if (currentUser) {

        console.log("currentUser", currentUser);

        setUser(currentUser)
        setFormData((prev) => ({
          ...prev,
          firstName: prev.firstName || currentUser.user_metadata?.given_name || "",
          lastName: prev.lastName || currentUser.user_metadata?.family_name || "",
          email: prev.email || currentUser.user_metadata?.email || currentUser.email || "",
          avatarUrl: prev.avatarUrl || currentUser.user_metadata?.picture || "",
          linkedinUrl: prev.linkedinUrl || "", // Only set if not already set
        }))
        // Pre-populate form with existing data if available
        const supabase = createClient()
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single()
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            location: profile.location || "",
            timezone: profile.timezone || "",
            founderType: profile.founder_type || "",
            lookingFor: profile.looking_for || [],
            weeklyHours: profile.weekly_hours || "",
            hasIdea: profile.has_idea || "",
            ideaDescription: profile.idea_description || "",
            lookingToJoin: profile.looking_to_join || false,
            calendarType: profile.calendar_type || "",
            calendarUrl: profile.calendar_url || "",
            bio: profile.bio || "",
            skills: profile.skills || [],
          }))
        }
      }
      setLoadingProfile(false)
    }
    loadUserAndProfile()
  }, [])

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = user
      ? {
          location: formData.location,
          timezone: formData.timezone,
          founderType: formData.founderType,
          lookingFor: formData.lookingFor.length > 0,
          weeklyHours: formData.weeklyHours,
          hasIdea: formData.hasIdea,
          calendarUrl: formData.calendarUrl,
          bio: formData.bio,
        }
      : {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          linkedinUrl: formData.linkedinUrl,
          location: formData.location,
          timezone: formData.timezone,
          founderType: formData.founderType,
          lookingFor: formData.lookingFor.length > 0,
          weeklyHours: formData.weeklyHours,
          hasIdea: formData.hasIdea,
          calendarUrl: formData.calendarUrl,
          bio: formData.bio,
        }
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
      return
    }
    setIsLoading(true)
    try {
      const supabase = createClient()
      const now = new Date()
      const memberSince = now.toLocaleString('default', { month: 'long', year: 'numeric' })
      const timestamp = now.toISOString()
      if (user) {
        // Update existing profile
        const { error } = await supabase
          .from("profiles")
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            linkedin_url: formData.linkedinUrl,
            avatar_url: formData.avatarUrl || user.user_metadata?.picture || "",
            location: formData.location,
            timezone: formData.timezone,
            founder_type: formData.founderType,
            looking_for: formData.lookingFor,
            weekly_hours: formData.weeklyHours,
            has_idea: formData.hasIdea,
            idea_description: formData.ideaDescription,
            looking_to_join: !!formData.lookingToJoin,
            calendar_type: formData.calendarType,
            calendar_url: formData.calendarUrl,
            bio: formData.bio,
            skills: formData.skills,
            is_online: true,
            onboarding_complete: true,
            updated_at: timestamp,
          })
          .eq("id", user.id)
        if (error) throw error
      } else {
        // Create new user/profile (this assumes you have a signup API or Supabase signup logic)
        // For now, just insert into profiles (replace with real signup logic as needed)
        // If you have a user id, set it; otherwise, let Supabase generate it
        const profileInsert: any = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          linkedin_url: formData.linkedinUrl,
          avatar_url: formData.avatarUrl || "",
          location: formData.location,
          timezone: formData.timezone,
          founder_type: formData.founderType,
          looking_for: formData.lookingFor,
          weekly_hours: formData.weeklyHours,
          has_idea: formData.hasIdea,
          idea_description: formData.ideaDescription,
          looking_to_join: !!formData.lookingToJoin,
          calendar_type: formData.calendarType,
          calendar_url: formData.calendarUrl,
          bio: formData.bio,
          skills: formData.skills,
          is_online: true,
          match_score: null,
          response_rate: null,
          avg_response_time: null,
          member_since: memberSince,
          onboarding_complete: true,
          created_at: timestamp,
          updated_at: timestamp,
        }
        // (No id in formData; let Supabase generate it)
        const { error } = await supabase
          .from("profiles")
          .insert(profileInsert)
        if (error) throw error
      }
      router.push("/dashboard")
    } catch (error: any) {
      alert("Error saving profile: " + (error.message || error))
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayField = (field: string, value: string) => {
    setFormData((prev) => {
      const current = prev[field as keyof typeof prev]
      if (Array.isArray(current)) {
        return {
          ...prev,
          [field]: current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value],
        }
      }
      return prev
    })
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-5 h-5 text-white" />
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">CoFounder</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Join the Network</h1>
          <p className="text-slate-600">Create your profile to find your perfect co-founder</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-slate-500">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Basic Information"}
              {step === 2 && "Your Profile"}
              {step === 3 && "Availability & Goals"}
              {step === 4 && "Calendar & Bio"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Let's start with your basic information and LinkedIn profile"}
              {step === 2 && "Tell us about yourself and who you're looking for"}
              {step === 3 && "Share your availability and entrepreneurial goals"}
              {step === 4 && "Complete your profile with calendar integration"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                {user && (
                  <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded text-sm">
                    We could only import your name, email, and profile photo from LinkedIn. Please complete the rest of your profile.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      placeholder="John"
                      readOnly={!!user}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      placeholder="Doe"
                      readOnly={!!user}
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
                    readOnly={!!user}
                  />
                </div>

                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn Profile URL *</Label>
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
                  <p className="text-xs text-slate-500 mt-1">Required for profile verification</p>
                </div>
              </>
            )}

            {/* Step 2: Profile */}
            {step === 2 && (
              <>
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
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select onValueChange={(value) => updateFormData("timezone", value)}>
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
              </>
            )}

            {/* Step 3: Availability & Goals */}
            {step === 3 && (
              <>
                <div>
                  <Label>Weekly Time Commitment</Label>
                  <Select onValueChange={(value) => updateFormData("weeklyHours", value)} value={formData.weeklyHours}>
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
              </>
            )}

            {/* Step 4: Calendar & Bio */}
            {step === 4 && (
              <>
                <div>
                  <Label>Calendar Integration *</Label>
                  <Select onValueChange={(value) => updateFormData("calendarType", value)} value={formData.calendarType}>
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
                  <Label htmlFor="calendarUrl">Calendar Booking URL *</Label>
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
                  <p className="text-xs text-slate-500 mt-1">
                    Required for other founders to schedule meetings with you
                  </p>
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
                  <Label>Key Skills (optional)</Label>
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
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={step === 1}
                className="flex items-center space-x-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {step < totalSteps ? (
                <Button onClick={handleNext} className="flex items-center space-x-2">
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex items-center space-x-2">
                  <span>Complete Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Beta Notice */}
        <div className="text-center mt-8">
          <Badge variant="secondary" className="mb-2">
            🎉 Beta Access - Free for Limited Time
          </Badge>
          <p className="text-sm text-slate-600">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
