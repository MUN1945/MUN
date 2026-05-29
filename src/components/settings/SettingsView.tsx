'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Globe, Building2, Camera, Shield, Bell,
  Lock, KeyRound, CreditCard, FileText, AlertTriangle,
  Trash2, Languages, ChevronRight, CheckCircle2, Clock,
  Download, X, Eye, EyeOff, Smartphone
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAuthStore, useNavStore } from '@/lib/store'

// ============================================================
// MOCK BILLING HISTORY
// ============================================================

const BILLING_HISTORY = [
  { id: 'inv-001', date: '2025-02-01', description: 'Delegate Pro - Monthly', amount: 'AED 29.00', status: 'Paid' },
  { id: 'inv-002', date: '2025-01-01', description: 'Delegate Pro - Monthly', amount: 'AED 29.00', status: 'Paid' },
  { id: 'inv-003', date: '2024-12-01', description: 'Delegate Pro - Monthly', amount: 'AED 29.00', status: 'Paid' },
  { id: 'inv-004', date: '2024-11-15', description: 'Delegate Pro - First Month (Prorated)', amount: 'AED 14.50', status: 'Paid' },
]

// ============================================================
// PROFILE SECTION
// ============================================================

function ProfileSection() {
  const { user } = useAuthStore()
  const [name, setName] = useState(user?.name || 'Amara Okafor')
  const [email, setEmail] = useState(user?.email || 'amara@munified.io')
  const [bio, setBio] = useState('Passionate MUN delegate representing Nigeria at international conferences. Focused on Security Council reform and climate action.')
  const [country, setCountry] = useState(user?.country || 'Switzerland')
  const [school, setSchool] = useState(user?.schoolName || 'International School of Geneva')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 800)
  }

  return (
    <Card className="border-[#E8DED0]/60">
      <CardHeader>
        <CardTitle className="text-base text-[#1B3A4B] flex items-center gap-2">
          <User className="w-4 h-4 text-[#0D7377]" /> Profile Information
        </CardTitle>
        <CardDescription>Update your personal details and public profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-[#0D7377]/20">
            <AvatarFallback className="bg-[#0D7377]/10 text-[#0D7377] text-xl font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" className="border-[#0D7377]/30 text-[#0D7377]">
              <Camera className="w-3.5 h-3.5 mr-1.5" /> Change Photo
            </Button>
            <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="settings-name">Full Name</Label>
            <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} className="border-[#E8DED0] focus-visible:ring-[#0D7377]/20" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-email">Email Address</Label>
            <Input id="settings-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-[#E8DED0] focus-visible:ring-[#0D7377]/20" />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="border-[#E8DED0]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['Switzerland', 'United States', 'United Kingdom', 'UAE', 'Nigeria', 'Japan', 'India', 'Brazil', 'Germany', 'France', 'China', 'South Korea'].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-school">School</Label>
            <Input id="settings-school" value={school} onChange={(e) => setSchool(e.target.value)} className="border-[#E8DED0] focus-visible:ring-[#0D7377]/20" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="settings-bio">Bio</Label>
          <Textarea id="settings-bio" value={bio} onChange={(e) => setBio(e.target.value)} className="border-[#E8DED0] focus-visible:ring-[#0D7377]/20 min-h-[80px]" placeholder="Tell us about yourself..." />
          <p className="text-[10px] text-muted-foreground">{bio.length}/300 characters</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} className="bg-[#0D7377] hover:bg-[#0A5C5F] text-white">
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </Button>
          {saved && <CheckCircle2 className="w-4 h-4 text-[#059669]" />}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// NOTIFICATION SECTION
// ============================================================

function NotificationSection() {
  const [notifications, setNotifications] = useState({
    emailAssessments: true,
    emailConferences: true,
    emailTraining: false,
    emailNewsletter: false,
    inAppMessages: true,
    inAppMentions: true,
    inAppUpdates: true,
    chatSounds: true,
    chatDesktop: true,
  })

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Card className="border-[#E8DED0]/60">
      <CardHeader>
        <CardTitle className="text-base text-[#1B3A4B] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#0D7377]" /> Notification Preferences
        </CardTitle>
        <CardDescription>Choose how and when you want to be notified</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h4 className="text-sm font-semibold text-[#1B3A4B] mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" /> Email Notifications
          </h4>
          <div className="space-y-3">
            {[
              { key: 'emailAssessments' as const, label: 'Assessment Results', desc: 'Get notified when your assessment is graded' },
              { key: 'emailConferences' as const, label: 'Conference Updates', desc: 'New conferences, registration deadlines, schedule changes' },
              { key: 'emailTraining' as const, label: 'Training Reminders', desc: 'Course deadlines, new modules, progress milestones' },
              { key: 'emailNewsletter' as const, label: 'Newsletter', desc: 'Monthly MUNified updates and MUN tips' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-[#1B3A4B]">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <Switch checked={notifications[item.key]} onCheckedChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-[#E8DED0]" />

        {/* In-App Notifications */}
        <div>
          <h4 className="text-sm font-semibold text-[#1B3A4B] mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-muted-foreground" /> In-App Notifications
          </h4>
          <div className="space-y-3">
            {[
              { key: 'inAppMessages' as const, label: 'Direct Messages', desc: 'Notify when someone sends you a message' },
              { key: 'inAppMentions' as const, label: 'Mentions', desc: 'Notify when you are mentioned in a discussion' },
              { key: 'inAppUpdates' as const, label: 'Platform Updates', desc: 'Feature releases and system announcements' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-[#1B3A4B]">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <Switch checked={notifications[item.key]} onCheckedChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-[#E8DED0]" />

        {/* Chat Notifications */}
        <div>
          <h4 className="text-sm font-semibold text-[#1B3A4B] mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" /> Chat Notifications
          </h4>
          <div className="space-y-3">
            {[
              { key: 'chatSounds' as const, label: 'Sound Alerts', desc: 'Play a sound for new messages' },
              { key: 'chatDesktop' as const, label: 'Desktop Notifications', desc: 'Show browser notifications for new messages' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-[#1B3A4B]">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <Switch checked={notifications[item.key]} onCheckedChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// SECURITY SECTION
// ============================================================

function SecuritySection() {
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changing, setChanging] = useState(false)
  const [changed, setChanged] = useState(false)

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return
    setChanging(true)
    setTimeout(() => {
      setChanging(false)
      setChanged(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setChanged(false), 2000)
    }, 800)
  }

  return (
    <Card className="border-[#E8DED0]/60">
      <CardHeader>
        <CardTitle className="text-base text-[#1B3A4B] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0D7377]" /> Security
        </CardTitle>
        <CardDescription>Manage your password and account security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Change Password */}
        <div>
          <h4 className="text-sm font-semibold text-[#1B3A4B] mb-3">Change Password</h4>
          <div className="space-y-3 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="current-pw">Current Password</Label>
              <div className="relative">
                <Input id="current-pw" type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="border-[#E8DED0] focus-visible:ring-[#0D7377]/20 pr-10" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pw">New Password</Label>
              <Input id="new-pw" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border-[#E8DED0] focus-visible:ring-[#0D7377]/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pw">Confirm New Password</Label>
              <Input id="confirm-pw" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border-[#E8DED0] focus-visible:ring-[#0D7377]/20" />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
            <Button onClick={handleChangePassword} disabled={changing || !currentPassword || !newPassword || newPassword !== confirmPassword} className="bg-[#0D7377] hover:bg-[#0A5C5F] text-white">
              {changing ? 'Updating...' : changed ? 'Updated!' : 'Update Password'}
            </Button>
          </div>
        </div>

        <Separator className="bg-[#E8DED0]" />

        {/* 2FA */}
        <div>
          <h4 className="text-sm font-semibold text-[#1B3A4B] mb-2">Two-Factor Authentication</h4>
          <p className="text-xs text-muted-foreground mb-3">Add an extra layer of security to your account</p>
          <Button variant="outline" className="border-[#E8DED0] text-muted-foreground" disabled>
            <Lock className="w-4 h-4 mr-2" /> Enable 2FA (Coming Soon)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// SUBSCRIPTION SECTION
// ============================================================

function SubscriptionSection() {
  const { user } = useAuthStore()
  const { navigate } = useNavStore()
  const currentTier = user?.subscriptionTier || 'FREE'
  const currentStatus = user?.subscriptionStatus || 'ACTIVE'

  const planNames: Record<string, string> = {
    FREE: 'Observer (Free)',
    STUDENT_PRO: 'Delegate Pro',
    TEACHER_PRO: 'Director Pro',
    SCHOOL_ENTERPRISE: 'School Enterprise',
  }

  return (
    <Card className="border-[#E8DED0]/60">
      <CardHeader>
        <CardTitle className="text-base text-[#1B3A4B] flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#0D7377]" /> Subscription
        </CardTitle>
        <CardDescription>Manage your plan and billing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-[#F5F0EB]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#1B3A4B]">Current Plan:</span>
              <Badge className="bg-[#0D7377]/10 text-[#0D7377] border-0">{planNames[currentTier] || 'Free'}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Status:</span>
              <Badge className={`text-[10px] border-0 ${currentStatus === 'ACTIVE' ? 'bg-[#059669]/15 text-[#059669]' : 'bg-amber-50 text-amber-600'}`}>
                {currentStatus}
              </Badge>
            </div>
          </div>
          <Button size="sm" className="bg-[#0D7377] hover:bg-[#0A5C5F] text-white" onClick={() => navigate('pricing')}>
            Manage Plan
          </Button>
        </div>

        {/* Billing History */}
        <div>
          <h4 className="text-sm font-semibold text-[#1B3A4B] mb-3">Billing History</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8DED0]">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground text-xs">Date</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground text-xs">Description</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground text-xs">Amount</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground text-xs">Status</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground text-xs"></th>
                </tr>
              </thead>
              <tbody>
                {BILLING_HISTORY.map(invoice => (
                  <tr key={invoice.id} className="border-b border-[#E8DED0]/30">
                    <td className="py-2.5 px-2 text-muted-foreground">{invoice.date}</td>
                    <td className="py-2.5 px-2 text-[#1B3A4B]">{invoice.description}</td>
                    <td className="py-2.5 px-2 text-right text-[#1B3A4B] font-medium">{invoice.amount}</td>
                    <td className="py-2.5 px-2 text-right">
                      <Badge className="bg-[#059669]/15 text-[#059669] border-0 text-[10px]">{invoice.status}</Badge>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Separator className="bg-[#E8DED0]" />

        {/* Cancel Subscription */}
        <div>
          <h4 className="text-sm font-semibold text-[#1B3A4B] mb-2">Cancel Subscription</h4>
          <p className="text-xs text-muted-foreground mb-3">Your access will continue until the end of the current billing period.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50">
                Cancel Subscription
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <DialogTitle className="text-[#1B3A4B]">Cancel Subscription?</DialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period. This action cannot be undone, but you can resubscribe at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white">Yes, Cancel</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// LANGUAGE SECTION
// ============================================================

function LanguageSection() {
  const [language, setLanguage] = useState('en')

  return (
    <Card className="border-[#E8DED0]/60">
      <CardHeader>
        <CardTitle className="text-base text-[#1B3A4B] flex items-center gap-2">
          <Languages className="w-4 h-4 text-[#0D7377]" /> Language
        </CardTitle>
        <CardDescription>Set your preferred interface language</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-sm space-y-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="border-[#E8DED0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية (Arabic)</SelectItem>
            </SelectContent>
          </Select>
          {language === 'ar' && (
            <div className="p-3 rounded-lg bg-[#D4A843]/10 text-xs text-[#D4A843]">
              Arabic language support is currently in preview. Some sections may still display in English.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// DANGER ZONE
// ============================================================

function DangerZone() {
  const [deleteConfirm, setDeleteConfirm] = useState('')

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-base text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </CardTitle>
        <CardDescription>Irreversible actions that affect your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-red-50/50 border border-red-100">
          <h4 className="text-sm font-semibold text-red-700 mb-1">Delete Account</h4>
          <p className="text-xs text-red-600/70 mb-3">
            This will permanently delete your account, all your data, badges, XP, and history. This action cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" /> Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <DialogTitle className="text-red-600">Delete Account Permanently?</DialogTitle>
                <AlertDialogDescription>
                  This action is irreversible. All your data including XP, badges, conference history, and training progress will be permanently deleted. Please type <strong>DELETE</strong> to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-2">
                <Input
                  placeholder='Type "DELETE" to confirm'
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className="border-red-200 focus-visible:ring-red-200"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirm('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white" disabled={deleteConfirm !== 'DELETE'}>
                  Permanently Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// MAIN SETTINGS VIEW
// ============================================================

export default function SettingsView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-[#1B3A4B]">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-[#F5F0EB] flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-[#0D7377]">
            <User className="w-4 h-4 mr-1.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-[#0D7377]">
            <Bell className="w-4 h-4 mr-1.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-[#0D7377]">
            <Shield className="w-4 h-4 mr-1.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="subscription" className="data-[state=active]:bg-white data-[state=active]:text-[#0D7377]">
            <CreditCard className="w-4 h-4 mr-1.5" /> Subscription
          </TabsTrigger>
          <TabsTrigger value="language" className="data-[state=active]:bg-white data-[state=active]:text-[#0D7377]">
            <Languages className="w-4 h-4 mr-1.5" /> Language
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <ProfileSection />
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <NotificationSection />
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <SecuritySection />
          </motion.div>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SubscriptionSection />
          </motion.div>
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <LanguageSection />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Danger Zone - Always visible at the bottom */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <DangerZone />
      </motion.div>
    </div>
  )
}
