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
  ChevronDown, ExternalLink, Filter
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
        {/* Orbiting dots */}
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
            Diplomati<span className="text-[#C9A84C]">Q</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#" className="hover:text-[#C9A84C] transition-colors">Features</a>
          <a href="#" className="hover:text-[#C9A84C] transition-colors">Academy</a>
          <a href="#" className="hover:text-[#C9A84C] transition-colors">Conferences</a>
          <a href="#" className="hover:text-[#C9A84C] transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => onNavigate('auth')}
          >
            Sign In
          </Button>
          <Button
            className="bg-[#C9A84C] text-[#1B2A4A] hover:bg-[#D4BA6E] font-semibold"
            onClick={() => onNavigate('auth')}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-20 md:pt-28 md:pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30 hover:bg-[#C9A84C]/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Now with AI-Powered Assessments
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          The Operating System
          <br />
          for{' '}
          <span className="gold-gradient-text">Model United Nations</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Train delegates with AI-powered assessments, manage conferences effortlessly,
          track achievements with XP, and build the next generation of diplomats.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="bg-[#C9A84C] text-[#1B2A4A] hover:bg-[#D4BA6E] font-semibold text-base px-8 h-12"
            onClick={() => onNavigate('auth')}
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 text-base px-8 h-12"
          >
            For Schools
          </Button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { value: '500+', label: 'Schools' },
            { value: '50,000+', label: 'Delegates' },
            { value: '120+', label: 'Conferences' },
            { value: '95%', label: 'Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-[#C9A84C]">{stat.value}</span>
              <span className="text-sm text-white/50 mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: 'AI Assessments',
              desc: 'Diagnostic evaluations that identify your diplomatic strengths and recommend the perfect committee role.',
              gradient: 'from-purple-500/20 to-indigo-500/20',
            },
            {
              icon: GraduationCap,
              title: 'MUN Academy',
              desc: 'Structured courses on procedures, resolution writing, public speaking, and crisis management.',
              gradient: 'from-[#C9A84C]/20 to-amber-500/20',
            },
            {
              icon: Trophy,
              title: 'XP & Rankings',
              desc: 'Earn XP, unlock achievements, and climb from Observer to Secretary-General on the global leaderboard.',
              gradient: 'from-emerald-500/20 to-teal-500/20',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300 group cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-[#C9A84C]" />
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

      {/* Footer */}
      <div className="relative z-10 border-t border-white/10 py-8 text-center text-white/30 text-sm">
        © 2025 DiplomatiQ. Building the next generation of diplomats.
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
    const levelIdx = XP_LEVELS.findIndex(l => l.name === 'Observer')
    onLogin({
      name: name || 'Alex Diplomat',
      email: email || 'alex@diplomatiq.com',
      role: roleLabel,
      xp: 2450,
      level: 'Ambassador',
      levelIndex: levelIdx,
      conferencesAttended: 8,
      committeesServed: 12,
      trainingProgress: 67,
    })
  }

  return (
    <div className="min-h-screen navy-gradient text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A84C] rounded-full opacity-[0.03] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C9A84C] rounded-full opacity-[0.04] blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#C9A84C] flex items-center justify-center">
            <Globe className="w-6 h-6 text-[#1B2A4A]" />
          </div>
          <span className="text-xl font-bold">
            Diplomati<span className="text-[#C9A84C]">Q</span>
          </span>
        </div>

        <Card className="bg-white/[0.07] border-white/10 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-white">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-white/50">
              {isRegister ? 'Begin your diplomatic journey' : 'Sign in to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white/[0.07] border-white/10 text-white placeholder:text-white/30 focus:border-[#C9A84C]/50 focus:ring-[#C9A84C]/20"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/[0.07] border-white/10 text-white placeholder:text-white/30 focus:border-[#C9A84C]/50 focus:ring-[#C9A84C]/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/[0.07] border-white/10 text-white placeholder:text-white/30 focus:border-[#C9A84C]/50 focus:ring-[#C9A84C]/20"
                />
              </div>
            </div>

            {isRegister && (
              <div className="space-y-3">
                <Label className="text-white/70 text-sm">I am a...</Label>
                <div className="grid grid-cols-1 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                        selectedRole === role.value
                          ? 'border-[#C9A84C]/50 bg-[#C9A84C]/10'
                          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                      }`}
                    >
                      <role.icon className={`w-5 h-5 ${selectedRole === role.value ? 'text-[#C9A84C]' : 'text-white/40'}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${selectedRole === role.value ? 'text-[#C9A84C]' : 'text-white/70'}`}>
                          {role.label}
                        </div>
                        <div className="text-xs text-white/40">{role.desc}</div>
                      </div>
                      {selectedRole === role.value && <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button
              className="w-full bg-[#C9A84C] text-[#1B2A4A] hover:bg-[#D4BA6E] font-semibold h-11"
              onClick={handleSubmit}
            >
              {isRegister ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </CardFooter>
        </Card>

        <button
          onClick={() => onNavigate('landing')}
          className="mt-6 text-sm text-white/30 hover:text-white/50 transition-colors flex items-center gap-1 mx-auto"
        >
          <ChevronRight className="w-3 h-3 rotate-180" />
          Back to home
        </button>
      </motion.div>
    </div>
  )
}

// ============================================================
// DASHBOARD SIDEBAR
// ============================================================

function DashboardSidebar({
  activeTab,
  onTabChange,
  user,
  onLogout,
  mobileOpen,
  onMobileClose,
}: {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  user: UserData
  onLogout: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}) {
  const currentLevel = XP_LEVELS.find(l => l.name === user.level) || XP_LEVELS[0]
  const nextLevel = XP_LEVELS[XP_LEVELS.indexOf(currentLevel) + 1]
  const xpProgress = nextLevel ? ((user.xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#C9A84C] flex items-center justify-center shrink-0">
          <Globe className="w-5 h-5 text-[#1B2A4A]" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          Diplomati<span className="text-[#C9A84C]">Q</span>
        </span>
        <button onClick={onMobileClose} className="ml-auto md:hidden text-white/50 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <Separator className="bg-white/10 mx-3" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); onMobileClose() }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-[#C9A84C]/15 text-[#C9A84C] font-medium'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${activeTab === item.id ? 'text-[#C9A84C]' : ''}`} />
              {item.label}
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* User profile */}
      <div className="px-3 pb-4">
        <Separator className="bg-white/10 mb-4" />
        <div className="flex items-center gap-3 px-2">
          <Avatar className="w-9 h-9 border-2 border-[#C9A84C]/30">
            <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-sm font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user.name}</div>
            <div className="text-xs text-white/40">{currentLevel.name} · {user.xp.toLocaleString()} XP</div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={onLogout} className="text-white/30 hover:text-white/60 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
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
              <motion.div
                className="h-full bg-[#C9A84C] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(xpProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-[#1B2A4A] border-r border-white/10 flex-col shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#1B2A4A] z-50 md:hidden"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
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

function DashboardHome({ user }: { user: UserData }) {
  const currentLevel = XP_LEVELS.find(l => l.name === user.level) || XP_LEVELS[0]
  const nextLevel = XP_LEVELS[XP_LEVELS.indexOf(currentLevel) + 1]
  const xpProgress = nextLevel ? ((user.xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100

  const stats = [
    { label: 'Conferences Attended', value: user.conferencesAttended, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Committees Served', value: user.committeesServed, icon: Gavel, color: 'text-[#C9A84C]', bg: 'bg-[#C9A84C]/10' },
    { label: 'Diplomatic Level', value: user.level, icon: Crown, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Training Progress', value: `${user.trainingProgress}%`, icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ]

  const upcomingConferences = [
    { name: 'Harvard WorldMUN 2025', date: 'Mar 15-19', location: 'Paris, France', status: 'Registration Open' },
    { name: 'NMUN New York 2025', date: 'Apr 7-11', location: 'New York, USA', status: 'Upcoming' },
    { name: 'RomeMUN 2025', date: 'May 20-24', location: 'Rome, Italy', status: 'Registration Open' },
  ]

  const recentActivity = [
    { text: 'Completed "Resolution Writing Masterclass"', time: '2 hours ago', icon: BookOpen, color: 'text-emerald-400' },
    { text: 'Earned "Skilled Orator" badge', time: '5 hours ago', icon: Award, color: 'text-[#C9A84C]' },
    { text: 'Registered for Harvard WorldMUN 2025', time: '1 day ago', icon: Building2, color: 'text-blue-400' },
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
      {/* Welcome card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-[#1B2A4A] to-[#243656] border-[#C9A84C]/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C] rounded-full opacity-[0.05] -translate-y-1/2 translate-x-1/4" />
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome back, <span className="text-[#C9A84C]">{user.name.split(' ')[0]}</span>
              </h2>
              <p className="text-white/50 mt-1">
                {user.role} · {user.xp.toLocaleString()} XP · {currentLevel.name} Level
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C9A84C] rounded-full" style={{ width: `${xpProgress}%` }} />
                </div>
                <span className="text-xs text-white/40">
                  {nextLevel ? `${(nextLevel.minXP - user.xp).toLocaleString()} XP to ${nextLevel.name}` : 'Max Level!'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-[#C9A84C]/15 flex items-center justify-center">
                {React.createElement(currentLevel.icon, { className: 'w-7 h-7 text-[#C9A84C]' })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming conferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Conferences</CardTitle>
                <Badge variant="secondary" className="text-xs">{upcomingConferences.length} upcoming</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingConferences.map((conf) => (
                <div key={conf.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#1B2A4A] flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-[#C9A84C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{conf.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <CalendarDays className="w-3 h-3" />
                      {conf.date}
                      <MapPin className="w-3 h-3 ml-1" />
                      {conf.location}
                    </div>
                  </div>
                  <Badge className={`text-[10px] shrink-0 ${
                    conf.status === 'Registration Open' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-blue-500/15 text-blue-600'
                  }`}>
                    {conf.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <Badge variant="secondary" className="text-xs">Today</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                <div className="space-y-3">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5`}>
                        <act.icon className={`w-4 h-4 ${act.color}`} />
                      </div>
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

      {/* Recommended training */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recommended Training</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                View All <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedCourses.map((course) => (
                <div key={course.title} className="p-4 rounded-lg border hover:border-[#C9A84C]/30 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
                    <Badge variant="outline" className="text-[10px]">{course.difficulty}</Badge>
                  </div>
                  <div className="font-medium text-sm mb-2 group-hover:text-[#C9A84C] transition-colors">{course.title}</div>
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
// ASSESSMENTS PAGE
// ============================================================

function AssessmentsPage() {
  const radarData = SKILLS.map(s => ({ subject: s.name, value: s.value, fullMark: 100 }))

  const recommendedRoles = [
    { role: 'Head Delegate', match: 94, desc: 'Your leadership and diplomacy scores are exceptional' },
    { role: 'Crisis Committee Member', match: 89, desc: 'Strong critical thinking and debate abilities' },
    { role: 'Security Council Delegate', match: 85, desc: 'Excellent research and procedures knowledge' },
  ]

  const assessmentHistory = [
    { name: 'Comprehensive Diagnostic', date: 'Feb 15, 2025', score: 84, type: 'Diagnostic' },
    { name: 'Public Speaking Evaluation', date: 'Jan 28, 2025', score: 78, type: 'Skill' },
    { name: 'Role Placement Assessment', date: 'Jan 10, 2025', score: 91, type: 'Placement' },
    { name: 'Progress Check #3', date: 'Dec 15, 2024', score: 72, type: 'Progress' },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold">Assessments</h2>
        <p className="text-muted-foreground mt-1">AI-powered evaluations to identify your diplomatic strengths</p>
      </motion.div>

      {/* AI Diagnostic Assessment Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="bg-gradient-to-r from-[#1B2A4A] to-[#243656] border-[#C9A84C]/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1">
                <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30 mb-3">
                  <Brain className="w-3 h-3 mr-1" /> AI-Powered
                </Badge>
                <h3 className="text-xl font-bold text-white mb-2">Comprehensive Diagnostic Assessment</h3>
                <p className="text-white/50 text-sm mb-4">
                  Our AI evaluates 10 core diplomatic competencies to create your personalized skill profile
                  and recommend the ideal MUN roles for you.
                </p>
                <Button className="bg-[#C9A84C] text-[#1B2A4A] hover:bg-[#D4BA6E] font-semibold">
                  <Play className="w-4 h-4 mr-2" /> Take Assessment
                </Button>
              </div>
              <div className="w-full lg:w-[380px] shrink-0">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Skills" dataKey="value" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skill breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill Breakdown</CardTitle>
            <CardDescription>Your current proficiency across 10 core diplomatic competencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SKILLS.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <span className={`font-semibold ${skill.value >= 80 ? 'text-emerald-500' : skill.value >= 60 ? 'text-[#C9A84C]' : 'text-orange-500'}`}>
                      {skill.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        skill.value >= 80 ? 'bg-emerald-500' : skill.value >= 60 ? 'bg-[#C9A84C]' : 'bg-orange-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.value}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended roles */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Recommended Roles</CardTitle>
              <CardDescription>Based on your assessment results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedRoles.map((rec) => (
                <div key={rec.role} className="p-4 rounded-lg border hover:border-[#C9A84C]/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{rec.role}</span>
                    <Badge className="bg-[#C9A84C]/15 text-[#C9A84C]">{rec.match}% Match</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Assessment history */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Assessment History</CardTitle>
              <CardDescription>Past evaluations and scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[260px]">
                <div className="space-y-3">
                  {assessmentHistory.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        a.score >= 80 ? 'bg-emerald-500/10' : a.score >= 60 ? 'bg-[#C9A84C]/10' : 'bg-orange-500/10'
                      }`}>
                        <span className={`font-bold text-sm ${
                          a.score >= 80 ? 'text-emerald-500' : a.score >= 60 ? 'text-[#C9A84C]' : 'text-orange-500'
                        }`}>{a.score}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.date}</div>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">{a.type}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================================
// ACADEMY PAGE
// ============================================================

function AcademyPage() {
  const categories = [
    { name: 'Procedures', icon: Gavel, count: 12, color: 'bg-blue-500/10 text-blue-500' },
    { name: 'Resolution Writing', icon: FileText, count: 8, color: 'bg-emerald-500/10 text-emerald-500' },
    { name: 'Public Speaking', icon: Mic, count: 10, color: 'bg-purple-500/10 text-purple-500' },
    { name: 'Negotiation', icon: Handshake, count: 7, color: 'bg-[#C9A84C]/10 text-[#C9A84C]' },
    { name: 'Geopolitics', icon: Globe, count: 15, color: 'bg-red-500/10 text-red-500' },
    { name: 'Leadership', icon: Crown, count: 6, color: 'bg-amber-500/10 text-amber-500' },
    { name: 'Crisis Committees', icon: Siren, count: 5, color: 'bg-orange-500/10 text-orange-500' },
    { name: 'Chair Training', icon: Scale, count: 4, color: 'bg-indigo-500/10 text-indigo-500' },
  ]

  const courses = [
    { title: 'Parliamentary Procedure Fundamentals', category: 'Procedures', progress: 92, lessons: 12, duration: '6h', difficulty: 'Beginner', xp: 150 },
    { title: 'Drafting Effective Resolutions', category: 'Resolution Writing', progress: 67, lessons: 8, duration: '4h', difficulty: 'Intermediate', xp: 200 },
    { title: 'Persuasive Speaking for MUN', category: 'Public Speaking', progress: 45, lessons: 10, duration: '5h', difficulty: 'Intermediate', xp: 200 },
    { title: 'Diplomatic Negotiation Tactics', category: 'Negotiation', progress: 30, lessons: 7, duration: '3.5h', difficulty: 'Advanced', xp: 250 },
    { title: 'Understanding Global Geopolitics', category: 'Geopolitics', progress: 15, lessons: 15, duration: '8h', difficulty: 'Intermediate', xp: 300 },
    { title: 'Crisis Committee Mastery', category: 'Crisis Committees', progress: 0, lessons: 5, duration: '3h', difficulty: 'Advanced', xp: 200 },
    { title: 'Chairing a Committee: Complete Guide', category: 'Chair Training', progress: 0, lessons: 4, duration: '2.5h', difficulty: 'Advanced', xp: 250 },
    { title: 'Advanced Research Techniques', category: 'Procedures', progress: 55, lessons: 6, duration: '3h', difficulty: 'Intermediate', xp: 150 },
  ]

  const certifications = [
    { name: 'Certified Delegate', progress: 75, required: 3, completed: 2 },
    { name: 'Resolution Writer', progress: 33, required: 3, completed: 1 },
    { name: 'Crisis Specialist', progress: 0, required: 4, completed: 0 },
    { name: 'Master Chair', progress: 0, required: 5, completed: 0 },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold">MUN Academy</h2>
        <p className="text-muted-foreground mt-1">Structured courses to master every aspect of Model United Nations</p>
      </motion.div>

      {/* Categories */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="p-4 rounded-lg border hover:border-[#C9A84C]/30 hover:shadow-sm transition-all text-left group"
            >
              <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <div className="font-medium text-sm">{cat.name}</div>
              <div className="text-xs text-muted-foreground">{cat.count} courses</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Courses */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Your Courses</CardTitle>
                <CardDescription>Track your learning progress</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Filter className="w-3 h-3 mr-1" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.title} className={`p-4 rounded-lg border transition-all cursor-pointer group ${
                  course.progress === 0 ? 'opacity-70 hover:opacity-100' : 'hover:border-[#C9A84C]/30 hover:shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
                    <Badge variant="outline" className="text-[10px]">{course.difficulty}</Badge>
                    {course.progress === 0 && (
                      <Lock className="w-3 h-3 text-muted-foreground ml-auto" />
                    )}
                  </div>
                  <div className="font-medium text-sm mb-1 group-hover:text-[#C9A84C] transition-colors">{course.title}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {course.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${
                        course.progress >= 80 ? 'bg-emerald-500' : course.progress > 0 ? 'bg-[#C9A84C]' : 'bg-muted-foreground/30'
                      }`} style={{ width: `${course.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{course.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Certifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Certifications</CardTitle>
            <CardDescription>Complete courses to earn professional certifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {certifications.map((cert) => (
                <div key={cert.name} className="p-4 rounded-lg border text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    cert.progress === 100 ? 'bg-[#C9A84C]/15' : cert.progress > 0 ? 'bg-blue-500/10' : 'bg-muted'
                  }`}>
                    {cert.progress === 100 ? (
                      <BadgeCheck className="w-6 h-6 text-[#C9A84C]" />
                    ) : cert.progress > 0 ? (
                      <Award className="w-6 h-6 text-blue-500" />
                    ) : (
                      <Award className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="font-medium text-sm">{cert.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {cert.completed}/{cert.required} courses completed
                  </div>
                  <Progress value={cert.progress} className="h-1.5 mt-3" />
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
// CONFERENCES PAGE
// ============================================================

function ConferencesPage() {
  const [confFilter, setConfFilter] = useState('all')

  const conferences = [
    { name: 'Harvard WorldMUN 2025', date: 'Mar 15-19, 2025', location: 'Paris, France', status: 'Registration Open', committees: 12, delegates: 2000, type: 'International' },
    { name: 'NMUN New York 2025', date: 'Apr 7-11, 2025', location: 'New York, USA', status: 'Upcoming', committees: 18, delegates: 5000, type: 'International' },
    { name: 'RomeMUN 2025', date: 'May 20-24, 2025', location: 'Rome, Italy', status: 'Registration Open', committees: 8, delegates: 1200, type: 'International' },
    { name: 'LSEMUN XII', date: 'Jun 5-8, 2025', location: 'London, UK', status: 'Upcoming', committees: 10, delegates: 800, type: 'Regional' },
    { name: 'Westfield MUN Invitational', date: 'Feb 1-3, 2025', location: 'Virtual', status: 'Completed', committees: 5, delegates: 300, type: 'School' },
    { name: 'GEMUN 2024', date: 'Nov 15-17, 2024', location: 'Geneva, Switzerland', status: 'Completed', committees: 15, delegates: 3500, type: 'International' },
  ]

  const filtered = confFilter === 'all' ? conferences : conferences.filter(c => c.status.toLowerCase().replace(/\s+/g, '') === confFilter)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Conferences</h2>
          <p className="text-muted-foreground mt-1">Discover and register for MUN conferences worldwide</p>
        </div>
        <Button className="bg-[#C9A84C] text-[#1B2A4A] hover:bg-[#D4BA6E] font-semibold shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Create Conference
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { value: 'all', label: 'All' },
            { value: 'registrationopen', label: 'Registration Open' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'completed', label: 'Completed' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setConfFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                confFilter === f.value
                  ? 'bg-[#1B2A4A] text-[#C9A84C] font-medium'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Conference list */}
      <div className="space-y-4">
        {filtered.map((conf, i) => (
          <motion.div
            key={conf.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1B2A4A] flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-[#C9A84C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold group-hover:text-[#C9A84C] transition-colors">{conf.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{conf.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {conf.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {conf.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {conf.delegates.toLocaleString()} delegates</span>
                      <span className="flex items-center gap-1"><Gavel className="w-3.5 h-3.5" /> {conf.committees} committees</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge className={`${
                      conf.status === 'Registration Open' ? 'bg-emerald-500/15 text-emerald-600' :
                      conf.status === 'Upcoming' ? 'bg-blue-500/15 text-blue-600' :
                      'bg-gray-500/15 text-gray-600'
                    }`}>
                      {conf.status}
                    </Badge>
                    {conf.status !== 'Completed' && (
                      <Button size="sm" variant="outline" className="shrink-0">
                        Register <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// RANKINGS PAGE
// ============================================================

function RankingsPage() {
  const [rankTab, setRankTab] = useState('delegates')

  const leaderboard = [
    { rank: 1, name: 'Sophia Chen', school: 'Harvard University', xp: 12450, level: 'Secretary-General', awards: 15, avatar: 'SC' },
    { rank: 2, name: 'Marcus Johnson', school: 'Oxford University', xp: 10800, level: 'Diplomat', awards: 12, avatar: 'MJ' },
    { rank: 3, name: 'Aisha Patel', school: 'Stanford University', xp: 9200, level: 'Diplomat', awards: 11, avatar: 'AP' },
    { rank: 4, name: 'Liam O\'Brien', school: 'LSE', xp: 7500, level: 'Ambassador', awards: 9, avatar: 'LO' },
    { rank: 5, name: 'Yuki Tanaka', school: 'University of Tokyo', xp: 6800, level: 'Ambassador', awards: 8, avatar: 'YT' },
    { rank: 6, name: 'Elena Rodriguez', school: 'Sciences Po', xp: 5100, level: 'Ambassador', awards: 7, avatar: 'ER' },
    { rank: 7, name: 'David Kim', school: 'Yale University', xp: 4200, level: 'Delegate', awards: 5, avatar: 'DK' },
    { rank: 8, name: 'Fatima Al-Hassan', school: 'Cairo University', xp: 3800, level: 'Delegate', awards: 4, avatar: 'FA' },
  ]

  const schoolLeaderboard = [
    { rank: 1, name: 'Harvard University', country: 'USA', delegates: 245, conferences: 28, avgXP: 3200, trophies: 45 },
    { rank: 2, name: 'Oxford University', country: 'UK', delegates: 198, conferences: 22, avgXP: 2900, trophies: 38 },
    { rank: 3, name: 'Stanford University', country: 'USA', delegates: 180, conferences: 19, avgXP: 2750, trophies: 32 },
    { rank: 4, name: 'Sciences Po', country: 'France', delegates: 165, conferences: 17, avgXP: 2600, trophies: 28 },
    { rank: 5, name: 'University of Tokyo', country: 'Japan', delegates: 150, conferences: 15, avgXP: 2400, trophies: 22 },
  ]

  const badges = [
    { name: 'First Resolution', icon: FileText, desc: 'Drafted your first resolution', earned: true, rarity: 'Common' },
    { name: 'Skilled Orator', icon: Mic, desc: 'Scored 90%+ in Public Speaking', earned: true, rarity: 'Rare' },
    { name: 'Diplomat Heart', icon: Heart, desc: 'Resolved 5 conflicts peacefully', earned: true, rarity: 'Uncommon' },
    { name: 'Crisis Manager', icon: Siren, desc: 'Excelled in 3 crisis committees', earned: false, rarity: 'Rare' },
    { name: 'Committee Chair', icon: Gavel, desc: 'Chaired a committee session', earned: false, rarity: 'Epic' },
    { name: 'Global Citizen', icon: Globe, desc: 'Represented 10 different countries', earned: false, rarity: 'Legendary' },
    { name: 'Rising Star', icon: Star, desc: 'Top 10% in your first conference', earned: true, rarity: 'Uncommon' },
    { name: 'Master Negotiator', icon: Handshake, desc: 'Brokered 10 successful alliances', earned: false, rarity: 'Epic' },
  ]

  const rarityColors: Record<string, string> = {
    Common: 'bg-gray-500/10 text-gray-500',
    Uncommon: 'bg-green-500/10 text-green-500',
    Rare: 'bg-blue-500/10 text-blue-500',
    Epic: 'bg-purple-500/10 text-purple-500',
    Legendary: 'bg-[#C9A84C]/10 text-[#C9A84C]',
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold">Rankings & Achievements</h2>
        <p className="text-muted-foreground mt-1">Track your progress and compete with delegates worldwide</p>
      </motion.div>

      {/* XP Levels */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">XP Level Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {XP_LEVELS.map((lvl, i) => (
                <div key={lvl.name} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center p-3 rounded-lg border min-w-[100px]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${lvl.color}20` }}>
                      <lvl.icon className="w-5 h-5" style={{ color: lvl.color }} />
                    </div>
                    <span className="text-xs font-medium text-center">{lvl.name}</span>
                    <span className="text-[10px] text-muted-foreground">{lvl.minXP.toLocaleString()} XP</span>
                  </div>
                  {i < XP_LEVELS.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground mx-1 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs for delegates/schools */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Tabs value={rankTab} onValueChange={setRankTab}>
          <TabsList>
            <TabsTrigger value="delegates">Delegate Leaderboard</TabsTrigger>
            <TabsTrigger value="schools">School Rankings</TabsTrigger>
            <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="delegates" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {leaderboard.map((d) => (
                    <div key={d.rank} className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${d.rank <= 3 ? 'bg-muted/30' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        d.rank === 1 ? 'bg-[#C9A84C]/15 text-[#C9A84C]' :
                        d.rank === 2 ? 'bg-gray-300/15 text-gray-400' :
                        d.rank === 3 ? 'bg-amber-600/15 text-amber-600' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {d.rank <= 3 ? <Trophy className="w-4 h-4" /> : d.rank}
                      </div>
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-[#1B2A4A] text-[#C9A84C] text-xs font-semibold">{d.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{d.name}</div>
                        <div className="text-xs text-muted-foreground">{d.school}</div>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0 hidden sm:flex">{d.level}</Badge>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-sm">{d.xp.toLocaleString()} XP</div>
                        <div className="text-xs text-muted-foreground">{d.awards} awards</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {schoolLeaderboard.map((s) => (
                    <div key={s.rank} className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${s.rank <= 3 ? 'bg-muted/30' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        s.rank === 1 ? 'bg-[#C9A84C]/15 text-[#C9A84C]' :
                        s.rank === 2 ? 'bg-gray-300/15 text-gray-400' :
                        'bg-amber-600/15 text-amber-600'
                      }`}>
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.country} · {s.delegates} delegates</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm shrink-0">
                        <span className="hidden sm:flex items-center gap-1 text-muted-foreground"><TrophyIcon className="w-3.5 h-3.5" /> {s.trophies}</span>
                        <span className="font-semibold">{s.avgXP.toLocaleString()} avg XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div key={badge.name} className={`p-4 rounded-lg border text-center transition-all ${badge.earned ? 'hover:border-[#C9A84C]/30 hover:shadow-sm' : 'opacity-50'}`}>
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    badge.earned ? 'bg-[#C9A84C]/15' : 'bg-muted'
                  }`}>
                    <badge.icon className={`w-6 h-6 ${badge.earned ? 'text-[#C9A84C]' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="font-medium text-sm">{badge.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 mb-2">{badge.desc}</div>
                  <Badge className={`text-[10px] ${rarityColors[badge.rarity]}`}>{badge.rarity}</Badge>
                  {badge.earned && <CheckCircle2 className="w-4 h-4 text-[#C9A84C] mx-auto mt-2" />}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

// ============================================================
// COMMUNICATIONS PAGE
// ============================================================

function CommunicationsPage() {
  const [activeChannel, setActiveChannel] = useState('general')
  const [messageText, setMessageText] = useState('')

  const channels = [
    { id: 'general', name: 'General', type: 'text', unread: 3 },
    { id: 'announcements', name: 'Announcements', type: 'text', unread: 1 },
    { id: 'help', name: 'Help & Support', type: 'text', unread: 0 },
    { id: 'sec-council', name: 'Security Council', type: 'committee', unread: 5 },
    { id: 'ga-1', name: 'GA - Disarmament', type: 'committee', unread: 2 },
    { id: 'ecosoc', name: 'ECOSOC', type: 'committee', unread: 0 },
    { id: 'crisis', name: 'Crisis Committee', type: 'committee', unread: 8 },
    { id: 'delegates', name: 'Delegates Lounge', type: 'social', unread: 12 },
  ]

  const messages = [
    { id: 1, user: 'Sarah Mitchell', avatar: 'SM', content: 'Has anyone started their position paper for the Security Council agenda?', time: '10:32 AM', isOwn: false },
    { id: 2, user: 'Alex Diplomat', avatar: 'AD', content: 'Yes! I\'m focusing on the cybersecurity dimension. The UN Charter Article 51 has some interesting implications.', time: '10:35 AM', isOwn: true },
    { id: 3, user: 'James Chen', avatar: 'JC', content: 'Great angle! I\'m representing France and looking at the EU\'s collective response framework.', time: '10:38 AM', isOwn: false },
    { id: 4, user: 'Maria Garcia', avatar: 'MG', content: 'Don\'t forget to check the latest SIPRI report on international security trends. Very useful data points.', time: '10:42 AM', isOwn: false },
    { id: 5, user: 'Alex Diplomat', avatar: 'AD', content: 'Thanks Maria! I\'ll incorporate that into my resolution draft. Should we coordinate our positions?', time: '10:45 AM', isOwn: true },
    { id: 6, user: 'Sarah Mitchell', avatar: 'SM', content: 'Absolutely! Let\'s schedule a caucus before the first session. How about Thursday evening?', time: '10:48 AM', isOwn: false },
    { id: 7, user: 'James Chen', avatar: 'JC', content: 'Thursday works for me. I\'ll prepare a working paper with potential alliance structures. 🤝', time: '10:51 AM', isOwn: false },
  ]

  const channelTypeIcon: Record<string, React.ElementType> = {
    text: MessageSquare,
    committee: Shield,
    social: Users,
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold">Communications</h2>
        <p className="text-muted-foreground mt-1">Connect with delegates, coordinate strategies, and join committee rooms</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 h-[600px]">
          {/* Channel list */}
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm">Channels</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 overflow-y-auto">
              <div className="space-y-0.5">
                {channels.map((ch) => {
                  const TypeIcon = channelTypeIcon[ch.type] || MessageSquare
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeChannel === ch.id
                          ? 'bg-[#1B2A4A] text-[#C9A84C]'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <TypeIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate flex-1 text-left">{ch.name}</span>
                      {ch.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#C9A84C] text-[#1B2A4A] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {ch.unread}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{channels.find(c => c.id === activeChannel)?.name || 'General'}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {channels.find(c => c.id === activeChannel)?.type || 'text'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className={`text-xs font-semibold ${msg.isOwn ? 'bg-[#C9A84C]/20 text-[#C9A84C]' : 'bg-[#1B2A4A] text-white'}`}>
                        {msg.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[75%] ${msg.isOwn ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-2 mb-1 ${msg.isOwn ? 'justify-end' : ''}`}>
                        <span className="text-xs font-medium">{msg.user}</span>
                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                      </div>
                      <div className={`inline-block px-3 py-2 rounded-lg text-sm ${
                        msg.isOwn
                          ? 'bg-[#1B2A4A] text-white rounded-tr-none'
                          : 'bg-muted rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => { if (e.key === 'Enter') setMessageText('') }}
                />
                <Button size="icon" className="bg-[#C9A84C] text-[#1B2A4A] hover:bg-[#D4BA6E] shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

function Hash({ className }: { className?: string }) {
  return <span className={className}>#</span>
}

// ============================================================
// ANALYTICS PAGE
// ============================================================

function AnalyticsPage() {
  const performanceData = [
    { month: 'Sep', score: 62 },
    { month: 'Oct', score: 68 },
    { month: 'Nov', score: 75 },
    { month: 'Dec', score: 71 },
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 88 },
  ]

  const participationData = [
    { name: 'General Assembly', value: 35, color: '#3B82F6' },
    { name: 'Security Council', value: 25, color: '#C9A84C' },
    { name: 'ECOSOC', value: 20, color: '#10B981' },
    { name: 'Crisis Committee', value: 15, color: '#F59E0B' },
    { name: 'Specialized', value: 5, color: '#8B5CF6' },
  ]

  const xpHistoryData = [
    { month: 'Sep', xp: 200 },
    { month: 'Oct', xp: 550 },
    { month: 'Nov', xp: 1200 },
    { month: 'Dec', xp: 1600 },
    { month: 'Jan', xp: 2100 },
    { month: 'Feb', xp: 2450 },
  ]

  const skillRadarData = SKILLS.map(s => ({ subject: s.name, value: s.value, fullMark: 100 }))

  const reports = [
    { name: 'Monthly Performance Report', date: 'Feb 28, 2025', type: 'Performance' },
    { name: 'Conference Participation Summary', date: 'Feb 15, 2025', type: 'Participation' },
    { name: 'Skill Development Report', date: 'Jan 31, 2025', type: 'Skills' },
    { name: 'Annual Progress Review', date: 'Dec 31, 2024', type: 'Annual' },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground mt-1">Track your performance, skills, and growth over time</p>
      </motion.div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Over Time</CardTitle>
              <CardDescription>Your assessment scores progression</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <RTooltip />
                  <Line type="monotone" dataKey="score" stroke="#C9A84C" strokeWidth={2.5} dot={{ fill: '#C9A84C', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Committee Participation</CardTitle>
              <CardDescription>Distribution across committee types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RPieChart>
                  <Pie data={participationData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={2}>
                    {participationData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <RTooltip />
                </RPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skill Radar</CardTitle>
              <CardDescription>Current diplomatic competency profile</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar name="Skills" dataKey="value" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">XP Growth</CardTitle>
              <CardDescription>Cumulative experience points over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={xpHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RTooltip />
                  <Bar dataKey="xp" fill="#1B2A4A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Reports */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reports</CardTitle>
            <CardDescription>Download detailed performance reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#1B2A4A] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#C9A84C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.date}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">{r.type}</Badge>
                  <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
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
// SETTINGS PAGE
// ============================================================

function SettingsPage({ user }: { user: UserData }) {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16 border-2 border-[#C9A84C]/30">
                  <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-lg font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.role}</div>
                  <Badge className="mt-1 bg-[#C9A84C]/15 text-[#C9A84C] text-xs">{user.level}</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Full Name</Label>
                  <Input defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Email</Label>
                  <Input defaultValue={user.email} type="email" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Bio</Label>
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Tell us about your MUN experience..."
                    defaultValue="Passionate MUN delegate with 3+ years of experience in Security Council and Crisis Committees."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">School</Label>
                  <Input defaultValue="Stanford University" />
                </div>
              </div>
              <Button className="bg-[#C9A84C] text-[#1B2A4A] hover:bg-[#D4BA6E] font-semibold">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Role */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Role & Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Primary Role</Label>
                  <Select defaultValue="delegate">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delegate">Delegate</SelectItem>
                      <SelectItem value="chair">Chair</SelectItem>
                      <SelectItem value="secretariat">Secretariat</SelectItem>
                      <SelectItem value="advisor">Teacher/Advisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Preferred Committee Type</Label>
                  <Select defaultValue="security-council">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general-assembly">General Assembly</SelectItem>
                      <SelectItem value="security-council">Security Council</SelectItem>
                      <SelectItem value="ecosoc">ECOSOC</SelectItem>
                      <SelectItem value="crisis">Crisis Committee</SelectItem>
                      <SelectItem value="specialized">Specialized Agency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Country Preference</Label>
                  <Input defaultValue="France" placeholder="Your preferred country to represent" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Conference updates', desc: 'New conferences and registration deadlines' },
                  { label: 'Assessment reminders', desc: 'Upcoming assessments and score notifications' },
                  { label: 'Committee messages', desc: 'New messages in your committee channels' },
                  { label: 'Achievement alerts', desc: 'Badges, level-ups, and XP milestones' },
                  { label: 'Weekly digest', desc: 'Summary of your weekly progress' },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{n.label}</div>
                      <div className="text-xs text-muted-foreground">{n.desc}</div>
                    </div>
                    <div className="w-10 h-5 rounded-full bg-[#C9A84C] p-0.5 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-white translate-x-5 transition-transform" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('landing')
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData>({
    name: '',
    email: '',
    role: '',
    xp: 0,
    level: 'Observer',
    levelIndex: 0,
    conferencesAttended: 0,
    committeesServed: 0,
    trainingProgress: 0,
  })

  const handleLogin = (userData: UserData) => {
    setUser(userData)
    setIsAuthenticated(true)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentPage('landing')
    setActiveTab('dashboard')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome user={user} />
      case 'assessments': return <AssessmentsPage />
      case 'academy': return <AcademyPage />
      case 'conferences': return <ConferencesPage />
      case 'rankings': return <RankingsPage />
      case 'communications': return <CommunicationsPage />
      case 'analytics': return <AnalyticsPage />
      case 'settings': return <SettingsPage user={user} />
      default: return <DashboardHome user={user} />
    }
  }

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'landing' && (
        <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <LandingSection onNavigate={setCurrentPage} />
        </motion.div>
      )}

      {currentPage === 'auth' && (
        <motion.div key="auth" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <AuthSection onNavigate={setCurrentPage} onLogin={handleLogin} />
        </motion.div>
      )}

      {currentPage === 'dashboard' && isAuthenticated && (
        <motion.div key="dashboard" className="flex min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          {/* Sidebar */}
          <DashboardSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            user={user}
            onLogout={handleLogout}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top bar */}
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b px-4 md:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden p-1.5 rounded-lg hover:bg-muted"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 w-64">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    placeholder="Search DiplomatiQ..."
                    className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#C9A84C] rounded-full" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Notifications</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
              {renderTabContent()}
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
