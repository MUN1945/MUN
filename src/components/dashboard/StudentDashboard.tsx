'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Globe, BookOpen, Award, Users, BarChart3, MessageSquare,
  ChevronRight, Star, Trophy, Target, Zap, Clock, MapPin,
  Shield, GraduationCap, Crown, Gavel, FileText,
  Mic, Handshake, Brain, ArrowRight, Flame, Eye,
  ClipboardList, Play, Sparkles, CalendarDays
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore, useAppStore, useNavStore, getCurrentLevel, getNextLevel, getXPProgress } from '@/lib/store'

// ============================================================
// COUNT-UP ANIMATION HOOK
// ============================================================

function useCountUp(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.round(start + (target - start) * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return count
}

// ============================================================
// STAT CARD WITH COUNT-UP
// ============================================================

function StatCard({
  label, value, icon: Icon, color, bgColor, delay, suffix
}: {
  label: string; value: number; icon: React.ElementType;
  color: string; bgColor: string; delay: number; suffix?: string
}) {
  const countedValue = useCountUp(value, 1200)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="hover:shadow-md transition-all duration-300 group cursor-pointer border-[#E8DED0]/60">
        <CardContent className="p-4">
          <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div className="text-2xl font-bold text-[#1B3A4B]">
            {countedValue}{suffix || ''}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================================
// MUN ROLE DISPLAY
// ============================================================

function getMUNRoleFull(munRole?: string): string {
  const map: Record<string, string> = {
    SECRETARY_GENERAL: 'Secretary-General',
    DIRECTOR_GENERAL: 'Director-General',
    CHAIR: 'Committee Chair',
    DELEGATE: 'Delegate',
    DELEGATE_ADVANCED: 'Advanced Delegate',
    SDG_AMBASSADOR: 'SDG Ambassador',
    RAPPORTEUR: 'Rapporteur',
  }
  return map[munRole || ''] || 'Delegate'
}

// ============================================================
// STUDENT DASHBOARD
// ============================================================

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { delegateProfile, badges, courses, conferences, activities } = useAppStore()
  const { navigate } = useNavStore()

  if (!user || !delegateProfile) return null

  const currentLevel = getCurrentLevel(delegateProfile.xp)
  const nextLevel = getNextLevel(delegateProfile.xp)
  const xpProgress = getXPProgress(delegateProfile.xp)
  const recentBadges = badges.slice(0, 3)
  const activeCourses = courses.filter(c => c.progress > 0 && c.progress < 100)
  const upcomingConferences = conferences.filter(c => c.status !== 'COMPLETED' && c.status !== 'CANCELLED')

  const levelIcons: Record<string, React.ElementType> = {
    OBSERVER: Eye,
    DELEGATE: Users,
    AMBASSADOR: Crown,
    DIPLOMAT: Handshake,
    ENVOY: Shield,
    SECRETARY_GENERAL: Gavel,
  }

  const LevelIcon = levelIcons[currentLevel.name] || Star

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-[#1B3A4B] to-[#264B5E] border-[#0D7377]/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0D7377] rounded-full opacity-[0.06] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-[#D4A843] rounded-full opacity-[0.04] translate-y-1/2" />
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-[#D4A843]/15 text-[#D4A843] border-[#D4A843]/30 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" /> Student Dashboard
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Welcome back, <span className="text-[#D4A843]">{user.name.split(' ')[0]}</span>
              </h2>
              <p className="text-white/50 mt-1">
                {getMUNRoleFull(user.munRole)} · {delegateProfile.xp.toLocaleString()} XP
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-[#D4A843]/15 flex items-center justify-center">
                <LevelIcon className="w-7 h-7 text-[#D4A843]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* XP Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-[#E8DED0]/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-[#1B3A4B]">XP Progress</CardTitle>
              <Badge className="bg-[#0D7377]/10 text-[#0D7377] border-0 text-xs">
                <Flame className="w-3 h-3 mr-1" /> {currentLevel.name} Level
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">{currentLevel.name}</span>
              <span className="font-semibold text-[#1B3A4B]">{delegateProfile.xp.toLocaleString()} XP</span>
              {nextLevel && <span className="text-muted-foreground">{nextLevel.name}</span>}
            </div>
            <div className="h-3 bg-[#F5F0EB] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #0D7377, #059669)' }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {(nextLevel.minXP - delegateProfile.xp).toLocaleString()} XP to reach {nextLevel.name}
              </p>
            )}
            {/* Streak */}
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm">
                <Flame className="w-4 h-4 text-[#D4A843]" />
                <span className="font-medium text-[#1B3A4B]">{delegateProfile.streak} day streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Trophy className="w-4 h-4" />
                Best: {delegateProfile.longestStreak} days
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Conferences"
          value={delegateProfile.conferencesAttended}
          icon={Globe}
          color="text-[#0D7377]"
          bgColor="bg-[#0D7377]/10"
          delay={0.15}
        />
        <StatCard
          label="Committees Served"
          value={delegateProfile.committeesServed}
          icon={Gavel}
          color="text-[#D4A843]"
          bgColor="bg-[#D4A843]/10"
          delay={0.2}
        />
        <StatCard
          label="Speeches Given"
          value={delegateProfile.speechesDelivered}
          icon={Mic}
          color="text-[#059669]"
          bgColor="bg-[#059669]/10"
          delay={0.25}
        />
        <StatCard
          label="Awards Won"
          value={delegateProfile.awardsReceived}
          icon={Trophy}
          color="text-purple-500"
          bgColor="bg-purple-500/10"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="h-full border-[#E8DED0]/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-[#1B3A4B]">Active Badges</CardTitle>
                <Badge variant="secondary" className="text-[10px]">{badges.length} total</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBadges.map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F0EB] hover:bg-[#F0EBE3] transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#D4A843]/15 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-[#D4A843]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#1B3A4B]">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.description}</div>
                    </div>
                    <Badge className="bg-[#0D7377]/10 text-[#0D7377] border-0 text-[10px]">
                      +{badge.xpReward} XP
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Courses Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full border-[#E8DED0]/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-[#1B3A4B]">Current Courses</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-7"
                  onClick={() => navigate('training')}
                >
                  View All <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeCourses.length > 0 ? activeCourses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1B3A4B] truncate pr-2">{course.title}</span>
                      <span className="text-xs font-semibold text-[#0D7377]">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#F5F0EB] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[#0D7377]"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px] h-5">{course.category}</Badge>
                      <Clock className="w-3 h-3" />
                      {course.duration ? `${Math.round(course.duration / 60)}h` : 'Self-paced'}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No active courses yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Conferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Card className="h-full border-[#E8DED0]/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-[#1B3A4B]">Upcoming Conferences</CardTitle>
                <Badge variant="secondary" className="text-[10px]">{upcomingConferences.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingConferences.slice(0, 3).map((conf) => (
                  <div
                    key={conf.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-[#F5F0EB] hover:bg-[#F0EBE3] transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#1B3A4B] flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 text-[#D4A843]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[#1B3A4B] truncate">{conf.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <CalendarDays className="w-3 h-3" />
                        {conf.startDate}
                        {conf.location && (
                          <>
                            <MapPin className="w-3 h-3 ml-1" />
                            {conf.location}
                          </>
                        )}
                      </div>
                    </div>
                    <Badge className={`text-[10px] shrink-0 border-0 ${
                      conf.status === 'REGISTRATION_OPEN' ? 'bg-[#059669]/15 text-[#059669]' : 'bg-[#0D7377]/15 text-[#0D7377]'
                    }`}>
                      {conf.status === 'REGISTRATION_OPEN' ? 'Open' : 'Upcoming'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-[#E8DED0]/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#1B3A4B]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                className="h-auto py-4 flex flex-col gap-2 bg-[#0D7377] hover:bg-[#0A5C5F] text-white"
                onClick={() => navigate('assessment')}
              >
                <ClipboardList className="w-6 h-6" />
                <span className="text-sm font-medium">Take Assessment</span>
                <span className="text-xs opacity-70">Identify your strengths</span>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col gap-2 bg-[#1B3A4B] hover:bg-[#264B5E] text-white"
                onClick={() => navigate('training')}
              >
                <GraduationCap className="w-6 h-6" />
                <span className="text-sm font-medium">Continue Training</span>
                <span className="text-xs opacity-70">Pick up where you left off</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 border-[#0D7377]/30 text-[#0D7377] hover:bg-[#0D7377]/5"
                onClick={() => navigate('chat')}
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm font-medium">Join Chat</span>
                <span className="text-xs opacity-70">Connect with delegates</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


