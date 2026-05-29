'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, BookOpen, Award, Users, BarChart3, Settings, MessageSquare,
  ChevronRight, Star, Trophy, Target, Zap, Clock, MapPin, TrendingUp,
  Shield, GraduationCap, Crown, Sword, Landmark, Gavel, FileText,
  Mic, Handshake, Brain, Eye, Heart, ArrowRight, LogOut, Bell,
  Search, Plus, CheckCircle2, Circle, Play, Lock, Sparkles,
  Home as HomeIcon, ClipboardList, BookMarked, Building2, TrophyIcon,
  Radio, Send, Menu, X, User, Mail, KeyRound, BadgeCheck,
  Flame, Medal, Rocket, World, Siren, Scale, Briefcase,
  PieChart, Activity, CalendarDays, UsersRound, Signal,
  ChevronDown, ExternalLink, Filter, ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, LineChart, Line, PieChart as RPieChart, Pie, Cell, Legend
} from 'recharts'
import AssessmentQuiz from '@/components/assessment/AssessmentQuiz'
import TrainingHub from '@/components/training/TrainingHub'
import ConferenceManager from '@/components/conferences/ConferenceManager'
import ChatView from '@/components/chat/ChatView'
import AppShell from '@/components/dashboard/AppShell'
import { useAuthStore, useNavStore, useAppStore, type UserRole } from '@/lib/store'

// ============================================================
// TYPES & CONSTANTS
// ============================================================

type Page = 'landing' | 'auth' | 'dashboard'
type TabId = 'dashboard' | 'assessments' | 'academy' | 'conferences' | 'rankings' | 'communications' | 'analytics' | 'settings'

interface UserData {
  name: string
  email: string
  role: string
  xp: number
  level: string
  levelIndex: number
  conferencesAttended: number
  committeesServed: number
  trainingProgress: number
}

const XP_LEVELS = [
  { name: 'Observer', minXP: 0, icon: Eye, color: '#94A3B8' },
  { name: 'Delegate', minXP: 500, icon: Users, color: '#60A5FA' },
  { name: 'Ambassador', minXP: 2000, icon: Crown, color: '#C9A84C' },
  { name: 'Diplomat', minXP: 5000, icon: Handshake, color: '#A78BFA' },
  { name: 'Secretary-General', minXP: 10000, icon: Gavel, color: '#F59E0B' },
]

const SKILLS = [
  { name: 'Confidence', value: 78 },
  { name: 'Diplomacy', value: 85 },
  { name: 'Public Speaking', value: 72 },
  { name: 'Research', value: 90 },
  { name: 'Leadership', value: 68 },
  { name: 'Writing', value: 82 },
  { name: 'Procedures', value: 76 },
  { name: 'Critical Thinking', value: 88 },
  { name: 'Collaboration', value: 74 },
  { name: 'Debate', value: 80 },
]

const SIDEBAR_ITEMS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { id: 'assessments', label: 'Assessments', icon: ClipboardList },
  { id: 'academy', label: 'Academy', icon: BookMarked },
  { id: 'conferences', label: 'Conferences', icon: Building2 },
  { id: 'rankings', label: 'Rankings', icon: TrophyIcon },
  { id: 'communications', label: 'Communications', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

// ============================================================
// LANDING SECTION
// ============================================================

function LandingSection({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-screen navy-gradient text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C9A84C] rounded-full opacity-[0.03] blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C9A84C] rounded-full opacity-[0.04] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#C9A84C]/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#C9A84C]/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-[#C9A84C]/[0.03] rounded-full" />
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-[#C9A84C]/30 rounded-full"
            style={{
              top: `${50 + 35 * Math.sin((i / 12) * Math.PI * 2)}%`,
              left: `${50 + 35 * Math.cos((i / 12) * Math.PI * 2)}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3, delay: i * 0.25, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#C9A84C] flex items-center justify-center">
            <Globe className="w-6 h-6 text-[#1B2A4A]" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            MUN<span className="text-[#D4A843]">ified</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#" className="hover:text-[#D4A843] transition-colors">Features</a>
          <a href="#" className="hover:text-[#D4A843] transition-colors">Academy</a>
          <a href="#" className="hover:text-[#D4A843] transition-colors">Conferences</a>
          <a href="#" className="hover:text-[#D4A843] transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" onClick={() => onNavigate('auth')}>
            Sign In
          </Button>
          <Button className="bg-[#D4A843] text-[#1B3A4B] hover:bg-[#D4BA6E] font-semibold" onClick={() => onNavigate('auth')}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-20 md:pt-28 md:pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-6 bg-[#D4A843]/15 text-[#D4A843] border-[#D4A843]/30 hover:bg-[#D4A843]/20">
            <Sparkles className="w-3 h-3 mr-1" /> Now with AI-Powered Assessments
          </Badge>
        </motion.div>
        <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
          The Operating System<br />for <span className="gold-gradient-text">Model United Nations</span>
        </motion.h1>
        <motion.p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          Train delegates with AI-powered assessments, manage conferences effortlessly, track achievements with XP, and build the next generation of diplomats.
        </motion.p>
        <motion.div className="mt-10 flex flex-col sm:flex-row items-center gap-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <Button size="lg" className="bg-[#D4A843] text-[#1B3A4B] hover:bg-[#D4BA6E] font-semibold text-base px-8 h-12" onClick={() => onNavigate('auth')}>
            Start Your Journey <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-base px-8 h-12">For Schools</Button>
        </motion.div>
        <motion.div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
          {[{ value: '500+', label: 'Schools' }, { value: '50,000+', label: 'Delegates' }, { value: '120+', label: 'Conferences' }, { value: '95%', label: 'Satisfaction' }].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-[#D4A843]">{stat.value}</span>
              <span className="text-sm text-white/50 mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: 'AI Assessments', desc: 'Diagnostic evaluations that identify your diplomatic strengths and recommend the perfect committee role.', gradient: 'from-purple-500/20 to-indigo-500/20' },
            { icon: GraduationCap, title: 'MUN Academy', desc: 'Structured courses on procedures, resolution writing, public speaking, and crisis management.', gradient: 'from-[#D4A843]/20 to-amber-500/20' },
            { icon: Trophy, title: 'XP & Rankings', desc: 'Earn XP, unlock achievements, and climb from Observer to Secretary-General on the global leaderboard.', gradient: 'from-emerald-500/20 to-teal-500/20' },
          ].map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300 group cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-[#D4A843]" />
                  </div>
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 py-8 text-center text-white/30 text-sm">
        &copy; 2025 MUNified. Building the next generation of diplomats.
      </div>
    </div>
  )
}

// ============================================================
// AUTH SECTION
// ============================================================

function AuthSection({ onNavigate, onLogin }: { onNavigate: (page: Page) => void; onLogin: (data: UserData) => void }) {
  const [isRegister, setIsRegister] = useState(true)
  const [selectedRole, setSelectedRole] = useState('DELEGATE')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const roles = [
    { value: 'DELEGATE', label: 'Student / Delegate', icon: Users, desc: 'Join conferences, train, and compete' },
    { value: 'TEACHER', label: 'Teacher / MUN Advisor', icon: GraduationCap, desc: 'Guide students and manage programs' },
    { value: 'SCHOOL_ADMIN', label: 'School Administrator', icon: Building2, desc: 'Oversee school MUN programs' },
    { value: 'SECRETARIAT', label: 'Secretariat', icon: Gavel, desc: 'Organize and run conferences' },
  ]

  const handleSubmit = () => {
    const roleLabel = roles.find(r => r.value === selectedRole)?.label || 'Delegate'
    onLogin({
      name: name || 'Alex Diplomat',
      email: email || 'alex@munified.com',
      role: roleLabel,
      xp: 2450,
      level: 'Ambassador',
      levelIndex: 2,
      conferencesAttended: 8,
      committeesServed: 12,
      trainingProgress: 67,
    })
  }

  return (
    <div className="min-h-screen navy-gradient text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4A843] rounded-full opacity-[0.03] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4A843] rounded-full opacity-[0.04] blur-3xl" />
      </div>
      <motion.div className="relative z-10 w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#D4A843] flex items-center justify-center">
            <Globe className="w-6 h-6 text-[#1B3A4B]" />
          </div>
          <span className="text-xl font-bold">MUN<span className="text-[#D4A843]">ified</span></span>
        </div>
        <Card className="bg-white/[0.07] border-white/10 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-white">{isRegister ? 'Create Account' : 'Welcome Back'}</CardTitle>
            <CardDescription className="text-white/50">{isRegister ? 'Begin your diplomatic journey' : 'Sign in to continue'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 bg-white/[0.07] border-white/10 text-white placeholder:text-white/30 focus:border-[#D4A843]/50 focus:ring-[#D4A843]/20" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input placeholder="your@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-white/[0.07] border-white/10 text-white placeholder:text-white/30 focus:border-[#D4A843]/50 focus:ring-[#D4A843]/20" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-white/[0.07] border-white/10 text-white placeholder:text-white/30 focus:border-[#D4A843]/50 focus:ring-[#D4A843]/20" />
              </div>
            </div>
            {isRegister && (
              <div className="space-y-3">
                <Label className="text-white/70 text-sm">I am a...</Label>
                <div className="grid grid-cols-1 gap-2">
                  {roles.map((role) => (
                    <button key={role.value} onClick={() => setSelectedRole(role.value)} className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${selectedRole === role.value ? 'border-[#D4A843]/50 bg-[#D4A843]/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}>
                      <role.icon className={`w-5 h-5 ${selectedRole === role.value ? 'text-[#D4A843]' : 'text-white/40'}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${selectedRole === role.value ? 'text-[#D4A843]' : 'text-white/70'}`}>{role.label}</div>
                        <div className="text-xs text-white/40">{role.desc}</div>
                      </div>
                      {selectedRole === role.value && <CheckCircle2 className="w-4 h-4 text-[#D4A843] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button className="w-full bg-[#D4A843] text-[#1B3A4B] hover:bg-[#D4BA6E] font-semibold h-11" onClick={handleSubmit}>
              {isRegister ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-white/40 hover:text-white/60 transition-colors">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </CardFooter>
        </Card>
        <button onClick={() => onNavigate('landing')} className="mt-6 text-sm text-white/30 hover:text-white/50 transition-colors flex items-center gap-1 mx-auto">
          <ChevronRight className="w-3 h-3 rotate-180" /> Back to home
        </button>
      </motion.div>
    </div>
  )
}

// ============================================================
// DASHBOARD SIDEBAR
// ============================================================

function DashboardSidebar({ activeTab, onTabChange, user, onLogout, mobileOpen, onMobileClose }: {
  activeTab: TabId; onTabChange: (tab: TabId) => void; user: UserData; onLogout: () => void; mobileOpen: boolean; onMobileClose: () => void
}) {
  const currentLevel = XP_LEVELS.find(l => l.name === user.level) || XP_LEVELS[0]
  const nextLevel = XP_LEVELS[XP_LEVELS.indexOf(currentLevel) + 1]
  const xpProgress = nextLevel ? ((user.xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#D4A843] flex items-center justify-center shrink-0">
          <Globe className="w-5 h-5 text-[#1B3A4B]" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">MUN<span className="text-[#D4A843]">ified</span></span>
        <button onClick={onMobileClose} className="ml-auto md:hidden text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <Separator className="bg-white/10 mx-3" />
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button key={item.id} onClick={() => { onTabChange(item.id); onMobileClose() }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${activeTab === item.id ? 'bg-[#D4A843]/15 text-[#D4A843] font-medium' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]'}`}>
              <item.icon className={`w-[18px] h-[18px] ${activeTab === item.id ? 'text-[#D4A843]' : ''}`} />
              {item.label}
            </button>
          ))}
        </div>
      </ScrollArea>
      <div className="px-3 pb-4">
        <Separator className="bg-white/10 mb-4" />
        <div className="flex items-center gap-3 px-2">
          <Avatar className="w-9 h-9 border-2 border-[#D4A843]/30">
            <AvatarFallback className="bg-[#D4A843]/20 text-[#D4A843] text-sm font-semibold">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user.name}</div>
            <div className="text-xs text-white/40">{currentLevel.name} · {user.xp.toLocaleString()} XP</div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={onLogout} className="text-white/30 hover:text-white/60 transition-colors"><LogOut className="w-4 h-4" /></button>
              </TooltipTrigger>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {nextLevel && (
          <div className="mt-3 px-2">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>{currentLevel.name}</span>
              <span>{nextLevel.name}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-[#D4A843] rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(xpProgress, 100)}%` }} transition={{ duration: 1, delay: 0.5 }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:flex w-64 bg-[#1B3A4B] border-r border-white/10 flex-col shrink-0 h-screen sticky top-0">{sidebarContent}</aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onMobileClose} />
            <motion.aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#1B3A4B] z-50 md:hidden" initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================================
// DASHBOARD HOME
// ============================================================

function DashboardHome({ user, onTabChange }: { user: UserData; onTabChange: (tab: TabId) => void }) {
  const currentLevel = XP_LEVELS.find(l => l.name === user.level) || XP_LEVELS[0]
  const nextLevel = XP_LEVELS[XP_LEVELS.indexOf(currentLevel) + 1]
  const xpProgress = nextLevel ? ((user.xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100

  const stats = [
    { label: 'Conferences Attended', value: user.conferencesAttended, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Committees Served', value: user.committeesServed, icon: Gavel, color: 'text-[#D4A843]', bg: 'bg-[#D4A843]/10' },
    { label: 'Diplomatic Level', value: user.level, icon: Crown, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Training Progress', value: `${user.trainingProgress}%`, icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ]

  const recentActivity = [
    { text: 'Completed "Resolution Writing Masterclass"', time: '2 hours ago', icon: BookOpen, color: 'text-emerald-400' },
    { text: 'Earned "Skilled Orator" badge', time: '5 hours ago', icon: Award, color: 'text-[#D4A843]' },
    { text: 'Scored 92% on Diplomatic Assessment', time: '2 days ago', icon: Target, color: 'text-purple-400' },
    { text: 'Joined Security Council committee', time: '3 days ago', icon: Shield, color: 'text-red-400' },
  ]

  const recommendedCourses = [
    { title: 'Advanced Resolution Writing', category: 'Writing', progress: 45, duration: '4h', difficulty: 'Advanced' },
    { title: 'Crisis Committee Survival Guide', category: 'Crisis', progress: 0, duration: '3h', difficulty: 'Intermediate' },
    { title: 'Mastering Parliamentary Procedure', category: 'Procedures', progress: 78, duration: '5h', difficulty: 'Beginner' },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-gradient-to-r from-[#1B3A4B] to-[#243656] border-[#D4A843]/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A843] rounded-full opacity-[0.05] -translate-y-1/2 translate-x-1/4" />
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, <span className="text-[#D4A843]">{user.name.split(' ')[0]}</span></h2>
              <p className="text-white/50 mt-1">{user.role} · {user.xp.toLocaleString()} XP · {currentLevel.name} Level</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4A843] rounded-full" style={{ width: `${xpProgress}%` }} />
                </div>
                <span className="text-xs text-white/40">{nextLevel ? `${(nextLevel.minXP - user.xp).toLocaleString()} XP to ${nextLevel.name}` : 'Max Level!'}</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-[#D4A843]/15 flex items-center justify-center">
              {React.createElement(currentLevel.icon, { className: 'w-7 h-7 text-[#D4A843]' })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 * i }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <button onClick={() => onTabChange('assessments')} className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer text-left">
                <div className="w-10 h-10 rounded-lg bg-[#0D7377]/10 flex items-center justify-center shrink-0"><Brain className="w-5 h-5 text-[#0D7377]" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">Take Diagnostic Assessment</div>
                  <div className="text-xs text-muted-foreground">Discover your diplomatic profile</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => onTabChange('academy')} className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer text-left">
                <div className="w-10 h-10 rounded-lg bg-[#D4A843]/10 flex items-center justify-center shrink-0"><GraduationCap className="w-5 h-5 text-[#D4A843]" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">Continue Training</div>
                  <div className="text-xs text-muted-foreground">Pick up where you left off</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <Badge variant="secondary" className="text-xs">Today</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5"><act.icon className={`w-4 h-4 ${act.color}`} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">{act.text}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recommended Training</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => onTabChange('academy')}>View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedCourses.map((course) => (
                <div key={course.title} className="p-4 rounded-lg border hover:border-[#D4A843]/30 hover:shadow-sm transition-all cursor-pointer group" onClick={() => onTabChange('academy')}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
                    <Badge variant="outline" className="text-[10px]">{course.difficulty}</Badge>
                  </div>
                  <div className="font-medium text-sm mb-2 group-hover:text-[#0D7377] transition-colors">{course.title}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ============================================================
// PLACEHOLDER PAGES
// ============================================================

function ConferencesPage() {
  return <ConferenceManager />
}

function RankingsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold">Rankings & Achievements</h2>
        <p className="text-muted-foreground mt-1">Track your progress and compete with delegates worldwide</p>
      </motion.div>
      <Card><CardContent className="p-12 text-center"><Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" /><h3 className="font-semibold text-lg mb-1">Coming Soon</h3><p className="text-sm text-muted-foreground">Rankings and achievements are being developed</p></CardContent></Card>
    </div>
  )
}

function CommunicationsPage() {
  return <ChatView />
}

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground mt-1">Insights into your diplomatic journey</p>
      </motion.div>
      <Card><CardContent className="p-12 text-center"><BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" /><h3 className="font-semibold text-lg mb-1">Coming Soon</h3><p className="text-sm text-muted-foreground">Analytics features are being developed</p></CardContent></Card>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>
      <Card><CardContent className="p-12 text-center"><Settings className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" /><h3 className="font-semibold text-lg mb-1">Coming Soon</h3><p className="text-sm text-muted-foreground">Settings features are being developed</p></CardContent></Card>
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Home() {
  const [page, setPage] = useState<Page>('landing')
  const { user: storeUser, isAuthenticated, demoLogin, logout: storeLogout } = useAuthStore()
  const { navigate } = useNavStore()

  const handleLogin = (data: UserData) => {
    // Determine role for Zustand store
    const roleMap: Record<string, UserRole> = {
      'Student / Delegate': 'STUDENT',
      'Teacher / MUN Advisor': 'TEACHER',
      'School Administrator': 'SCHOOL_ADMIN',
      'Secretariat': 'ADMIN',
    }
    const role = roleMap[data.role] || 'STUDENT'
    demoLogin(role)
    navigate('dashboard')
    setPage('dashboard')
  }

  const handleLogout = () => {
    storeLogout()
    setPage('landing')
  }

  // Landing page
  if (page === 'landing' || (!isAuthenticated && page !== 'auth')) {
    return <LandingSection onNavigate={setPage} />
  }

  // Auth page
  if (page === 'auth' && !isAuthenticated) {
    return <AuthSection onNavigate={setPage} onLogin={handleLogin} />
  }

  // Dashboard - use AppShell with Zustand store integration
  if (isAuthenticated) {
    return <AppShell />
  }

  return <LandingSection onNavigate={setPage} />
}
