'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Play, Share2, Trophy, Target,
  Brain, Mic, Handshake, BookOpen, Shield, Gavel, Users,
  Crown, Sparkles, CheckCircle2, Star, Zap, ArrowRight,
  RotateCcw, Award, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// ============================================================
// TYPES & DATA
// ============================================================

type QuizPhase = 'intro' | 'quiz' | 'analyzing' | 'results'

interface Question {
  id: number
  category: string
  text: string
  options: { text: string; score: number }[]
}

interface CategoryScore {
  name: string
  score: number // 0-100
  avg: number   // raw average 1-4
  color: string
  icon: React.ElementType
}

interface RoleRecommendation {
  role: string
  color: string
  description: string
  strengths: string[]
  icon: React.ElementType
}

const QUESTIONS: Question[] = [
  // Category 1 - MUN Knowledge (Q1-Q3)
  {
    id: 1, category: 'MUN Knowledge',
    text: 'What does MUN stand for?',
    options: [
      { text: 'Model United Nations', score: 4 },
      { text: 'Model Unified Nations', score: 1 },
      { text: 'United Model Nations', score: 2 },
      { text: 'Model Union of Nations', score: 1 },
    ]
  },
  {
    id: 2, category: 'MUN Knowledge',
    text: 'What is a resolution in MUN?',
    options: [
      { text: 'A formal document outlining proposed solutions', score: 4 },
      { text: 'A verbal agreement between delegates', score: 1 },
      { text: 'A type of motion to end debate', score: 2 },
      { text: "A country's opening statement", score: 2 },
    ]
  },
  {
    id: 3, category: 'MUN Knowledge',
    text: "What is a 'Point of Order'?",
    options: [
      { text: 'A procedural objection when rules are violated', score: 4 },
      { text: 'A request to extend speaking time', score: 1 },
      { text: 'A motion to change the topic', score: 2 },
      { text: 'A way to yield time to another delegate', score: 1 },
    ]
  },
  // Category 2 - Confidence (Q4-Q5)
  {
    id: 4, category: 'Confidence',
    text: 'How would you feel speaking in front of 100+ delegates?',
    options: [
      { text: 'Excited and ready', score: 4 },
      { text: 'Slightly nervous but prepared', score: 3 },
      { text: 'Quite anxious but willing', score: 2 },
      { text: 'Very uncomfortable', score: 1 },
    ]
  },
  {
    id: 5, category: 'Confidence',
    text: 'When someone challenges your position in debate, you:',
    options: [
      { text: 'Welcome it as an opportunity to strengthen your argument', score: 4 },
      { text: 'Stand firm but listen', score: 4 },
      { text: 'Feel defensive but try to respond', score: 2 },
      { text: 'Prefer to avoid confrontation', score: 1 },
    ]
  },
  // Category 3 - Research Skills (Q6-Q7)
  {
    id: 6, category: 'Research Skills',
    text: "When researching a country's position, your first step is:",
    options: [
      { text: "Review official UN records and the country's voting history", score: 4 },
      { text: 'Search news articles about the country', score: 3 },
      { text: 'Ask a teammate what they know', score: 1 },
      { text: 'Look at Wikipedia', score: 1 },
    ]
  },
  {
    id: 7, category: 'Research Skills',
    text: 'How do you verify the credibility of a source?',
    options: [
      { text: 'Cross-reference with official UN documents and multiple sources', score: 4 },
      { text: "Check if it's from a well-known website", score: 2 },
      { text: 'See if other delegates used it', score: 2 },
      { text: 'Trust it if it sounds professional', score: 1 },
    ]
  },
  // Category 4 - Public Speaking (Q8-Q9)
  {
    id: 8, category: 'Public Speaking',
    text: 'When preparing a speech, you focus most on:',
    options: [
      { text: 'Crafting a compelling narrative with evidence and emotional appeal', score: 4 },
      { text: 'Making sure every fact is perfect', score: 2 },
      { text: 'Keeping it short', score: 2 },
      { text: 'Reading from a prepared script', score: 1 },
    ]
  },
  {
    id: 9, category: 'Public Speaking',
    text: 'How do you handle impromptu speaking situations?',
    options: [
      { text: 'Structure my thoughts quickly using a framework (Point-Reason-Example)', score: 4 },
      { text: 'Speak from the heart and hope for the best', score: 3 },
      { text: 'Try to avoid impromptu situations', score: 2 },
      { text: 'Get very nervous and freeze', score: 1 },
    ]
  },
  // Category 5 - Diplomatic Skills (Q10-Q11)
  {
    id: 10, category: 'Diplomatic Skills',
    text: 'During a heated debate, two delegates disagree strongly. You:',
    options: [
      { text: 'Facilitate compromise by finding common ground between positions', score: 4 },
      { text: 'Take a side and support it', score: 2 },
      { text: 'Stay out of it', score: 2 },
      { text: 'Report to the chair', score: 1 },
    ]
  },
  {
    id: 11, category: 'Diplomatic Skills',
    text: "What does 'diplomatic immunity' mean in a MUN context?",
    options: [
      { text: 'Delegates are protected from personal criticism while representing their country', score: 4 },
      { text: 'The Chair cannot be challenged', score: 1 },
      { text: "Countries don't have to follow resolutions", score: 1 },
      { text: 'Only the Secretary-General has special powers', score: 1 },
    ]
  },
  // Category 6 - Parliamentary Procedure (Q12-Q15)
  {
    id: 12, category: 'Parliamentary Procedure',
    text: "What is a 'motion' in MUN?",
    options: [
      { text: 'A formal proposal for committee action', score: 4 },
      { text: 'A type of dance at the social', score: 1 },
      { text: 'A way to end the conference', score: 2 },
      { text: "A delegate's opening statement", score: 2 },
    ]
  },
  {
    id: 13, category: 'Parliamentary Procedure',
    text: 'What is the correct order of a MUN committee session?',
    options: [
      { text: 'Roll Call → Setting Agenda → General Speakers List → Moderated Caucus → Unmoderated Caucus → Voting', score: 4 },
      { text: 'Opening speeches → Debate → Vote → Close', score: 2 },
      { text: 'Registration → Committees → Dinner → Awards', score: 1 },
      { text: 'Roll Call → Debate → Vote', score: 1 },
    ]
  },
  {
    id: 14, category: 'Parliamentary Procedure',
    text: "What is 'yielding time' in MUN?",
    options: [
      { text: 'Remaining speaking time is given to another delegate, the chair, or for questions', score: 4 },
      { text: 'Giving up your position in the speakers list', score: 1 },
      { text: 'Transferring your vote to another delegate', score: 2 },
      { text: 'A motion to end the debate', score: 1 },
    ]
  },
  {
    id: 15, category: 'Parliamentary Procedure',
    text: 'What is the purpose of the Security Council in MUN?',
    options: [
      { text: 'To address threats to international peace and security with binding resolutions', score: 4 },
      { text: 'To organize social events', score: 1 },
      { text: 'To manage conference registration', score: 1 },
      { text: 'To write the conference report', score: 1 },
    ]
  },
]

const CATEGORIES = [
  { name: 'MUN Knowledge', color: '#0D7377', icon: Brain, questions: [1, 2, 3] },
  { name: 'Confidence', color: '#D4A843', icon: Target, questions: [4, 5] },
  { name: 'Research Skills', color: '#059669', icon: BookOpen, questions: [6, 7] },
  { name: 'Public Speaking', color: '#E11D48', icon: Mic, questions: [8, 9] },
  { name: 'Diplomatic Skills', color: '#7C3AED', icon: Handshake, questions: [10, 11] },
  { name: 'Parliamentary Procedure', color: '#1B3A4B', icon: Gavel, questions: [12, 13, 14, 15] },
]

const ROLES: RoleRecommendation[] = [
  {
    role: 'Secretary-General',
    color: '#D4A843',
    description: 'You possess exceptional leadership, diplomacy, and confidence. You are ready to lead entire conferences and inspire delegates.',
    strengths: ['Leadership', 'Diplomacy', 'Confidence', 'Vision'],
    icon: Crown,
  },
  {
    role: 'Director-General',
    color: '#0D7377',
    description: 'Your deep MUN knowledge and procedural expertise makes you ideal for managing conference operations and guiding committees.',
    strengths: ['Procedural Expertise', 'Knowledge', 'Organization', 'Management'],
    icon: Shield,
  },
  {
    role: 'Chair',
    color: '#7C3AED',
    description: 'Your strong public speaking and confidence make you a natural choice to lead committee sessions and maintain order.',
    strengths: ['Public Speaking', 'Confidence', 'Authority', 'Fairness'],
    icon: Gavel,
  },
  {
    role: 'Delegate (Advanced)',
    color: '#059669',
    description: 'Your research skills and foundational knowledge position you as a strong delegate ready for advanced committees.',
    strengths: ['Research', 'Preparation', 'Foundational Knowledge', 'Analytical Thinking'],
    icon: Star,
  },
  {
    role: 'Delegate',
    color: '#1B3A4B',
    description: 'You have the core skills to represent your country effectively in committee. Focus on building your expertise through practice.',
    strengths: ['Foundational Skills', 'Potential', 'Growth Mindset', 'Dedication'],
    icon: Users,
  },
  {
    role: 'SDG Ambassador',
    color: '#E11D48',
    description: 'Your passion for global issues and desire to learn makes you a perfect advocate for the Sustainable Development Goals.',
    strengths: ['Passion', 'Global Awareness', 'Advocacy', 'Learning Spirit'],
    icon: Sparkles,
  },
]

// ============================================================
// SCORING LOGIC
// ============================================================

function calculateScores(answers: Record<number, number>): {
  categoryScores: CategoryScore[]
  totalScore: number
  recommendedRole: RoleRecommendation
} {
  // Calculate category scores
  const categoryScores = CATEGORIES.map(cat => {
    const questionScores = cat.questions.map(qId => answers[qId] || 0)
    const avg = questionScores.length > 0 ? questionScores.reduce((a, b) => a + b, 0) / questionScores.length : 0
    const score = Math.round(avg * 25) // scale 0-100
    return {
      name: cat.name,
      score,
      avg,
      color: cat.color,
      icon: cat.icon,
    }
  })

  // Total raw score (max 60)
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)

  // Get category averages for role recommendation
  const getAvg = (name: string) => categoryScores.find(c => c.name === name)?.avg || 0
  const knowledgeAvg = getAvg('MUN Knowledge')
  const confidenceAvg = getAvg('Confidence')
  const researchAvg = getAvg('Research Skills')
  const speakingAvg = getAvg('Public Speaking')
  const diplomacyAvg = getAvg('Diplomatic Skills')
  const procedureAvg = getAvg('Parliamentary Procedure')

  // Role recommendation rules (in order)
  let recommendedRole: RoleRecommendation
  if (totalScore >= 48 && diplomacyAvg >= 3.5 && confidenceAvg >= 3.5) {
    recommendedRole = ROLES[0] // Secretary-General
  } else if (totalScore >= 42 && knowledgeAvg >= 3.5 && procedureAvg >= 3.5) {
    recommendedRole = ROLES[1] // Director-General
  } else if (totalScore >= 36 && speakingAvg >= 3.5 && confidenceAvg >= 3.5) {
    recommendedRole = ROLES[2] // Chair
  } else if (totalScore >= 28 && researchAvg >= 3) {
    recommendedRole = ROLES[3] // Delegate (Advanced)
  } else if (totalScore >= 20) {
    recommendedRole = ROLES[4] // Delegate
  } else {
    recommendedRole = ROLES[5] // SDG Ambassador
  }

  return { categoryScores, totalScore, recommendedRole }
}

// ============================================================
// ANIMATED SVG RADAR CHART
// ============================================================

function AnimatedRadarChart({ scores, animate }: { scores: CategoryScore[]; animate: boolean }) {
  const centerX = 150
  const centerY = 150
  const radius = 110
  const axes = scores.length

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / axes - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  }

  const axisPoints = scores.map((_, i) => getPoint(i, 100))
  const dataPoints = scores.map((s, i) => getPoint(i, animate ? s.score : 0))

  const polygonPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[360px] mx-auto">
      {/* Grid rings */}
      {[20, 40, 60, 80, 100].map((ring) => (
        <polygon
          key={ring}
          points={Array.from({ length: axes }, (_, i) => {
            const p = getPoint(i, ring)
            return `${p.x},${p.y}`
          }).join(' ')}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="0.5"
          opacity={0.5}
        />
      ))}

      {/* Axis lines */}
      {axisPoints.map((p, i) => (
        <line key={i} x1={centerX} y1={centerY} x2={p.x} y2={p.y} stroke="#d1d5db" strokeWidth="0.5" />
      ))}

      {/* Data polygon */}
      <motion.path
        d={polygonPath}
        fill={scores[0]?.color || '#0D7377'}
        fillOpacity={0.15}
        stroke={scores[0]?.color || '#0D7377'}
        strokeWidth={2}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          fill={scores[i]?.color || '#0D7377'}
          initial={{ scale: 0, opacity: 0 }}
          animate={animate ? { scale: 1, opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
        />
      ))}

      {/* Labels */}
      {scores.map((s, i) => {
        const angle = (Math.PI * 2 * i) / axes - Math.PI / 2
        const labelR = radius + 28
        const lx = centerX + labelR * Math.cos(angle)
        const ly = centerY + labelR * Math.sin(angle)
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] fill-muted-foreground font-medium"
          >
            {s.name}
          </text>
        )
      })}
    </svg>
  )
}

// ============================================================
// CIRCULAR PROGRESS
// ============================================================

function CircularProgress({ value, size = 120, strokeWidth = 8, color = '#0D7377' }: {
  value: number; size?: number; strokeWidth?: number; color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {value}
        </motion.span>
        <span className="text-[10px] text-muted-foreground font-medium">OUT OF 60</span>
      </div>
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AssessmentQuiz({ onBeginTraining }: { onBeginTraining?: () => void }) {
  const [phase, setPhase] = useState<QuizPhase>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [animatingOut, setAnimatingOut] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const selectedOption = answers[question?.id] ?? null

  const results = useMemo(() => calculateScores(answers), [answers])
  const overallPercent = Math.round((results.totalScore / 60) * 100)

  const handleSelect = useCallback((score: number) => {
    if (!question) return
    setAnswers(prev => ({ ...prev, [question.id]: score }))
  }, [question])

  const handleNext = useCallback(() => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setAnimatingOut(true)
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
        setAnimatingOut(false)
      }, 200)
    } else {
      setPhase('analyzing')
      setTimeout(() => {
        setPhase('results')
        setTimeout(() => setShowResults(true), 100)
      }, 3000)
    }
  }, [currentQuestion])

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setAnimatingOut(true)
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1)
        setAnimatingOut(false)
      }, 200)
    }
  }, [currentQuestion])

  const handleRestart = useCallback(() => {
    setAnswers({})
    setCurrentQuestion(0)
    setPhase('intro')
    setShowResults(false)
  }, [])

  // INTRO PHASE
  if (phase === 'intro') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-2xl font-bold">Assessments</h2>
          <p className="text-muted-foreground mt-1">AI-powered evaluations to identify your diplomatic strengths</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="bg-gradient-to-r from-[#1B3A4B] to-[#243656] border-[#D4A843]/20 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="flex-1">
                  <Badge className="bg-[#D4A843]/15 text-[#D4A843] border-[#D4A843]/30 mb-3">
                    <Brain className="w-3 h-3 mr-1" /> AI-Powered
                  </Badge>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Comprehensive Diagnostic Assessment
                  </h3>
                  <p className="text-white/50 text-sm mb-4 leading-relaxed">
                    Our diagnostic evaluates 6 core diplomatic competencies across 15 questions to create
                    your personalized skill profile and recommend the ideal MUN role for you.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {CATEGORIES.map(cat => (
                      <Badge key={cat.name} variant="secondary" className="text-[10px] bg-white/10 text-white/70 border-white/10">
                        <cat.icon className="w-3 h-3 mr-1" />
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    className="bg-[#D4A843] text-[#1B3A4B] hover:bg-[#D4BA6E] font-semibold"
                    onClick={() => setPhase('quiz')}
                  >
                    <Play className="w-4 h-4 mr-2" /> Take Assessment
                  </Button>
                </div>
                <div className="w-full lg:w-[340px] shrink-0">
                  <div className="grid grid-cols-3 gap-3">
                    {CATEGORIES.map((cat, i) => (
                      <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                        className="flex flex-col items-center p-3 rounded-lg bg-white/[0.06] border border-white/10"
                      >
                        <cat.icon className="w-5 h-5 mb-1" style={{ color: cat.color }} />
                        <span className="text-[10px] text-white/60 text-center leading-tight">{cat.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ANALYZING PHASE
  if (phase === 'analyzing') {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0D7377] to-[#D4A843] flex items-center justify-center mb-6"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-xl font-bold mb-2">Analyzing your diplomatic profile...</h3>
          <p className="text-muted-foreground text-sm">Evaluating 6 competency areas across your responses</p>
          <div className="mt-6 flex gap-2">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // RESULTS PHASE
  if (phase === 'results') {
    return (
      <div className="space-y-6">
        {/* Celebration header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showResults ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${results.recommendedRole.color}20` }}
              initial={{ scale: 0 }}
              animate={showResults ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
            >
              <results.recommendedRole.icon className="w-8 h-8" style={{ color: results.recommendedRole.color }} />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Diplomatic Profile</h2>
            <p className="text-muted-foreground">Assessment complete — here are your results</p>
          </div>
        </motion.div>

        {/* Role card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showResults ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-2" style={{ borderColor: `${results.recommendedRole.color}40` }}>
            <div className="p-1" style={{ backgroundColor: results.recommendedRole.color }} />
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${results.recommendedRole.color}15` }}>
                      <results.recommendedRole.icon className="w-6 h-6" style={{ color: results.recommendedRole.color }} />
                    </div>
                    <div>
                      <Badge className="text-[10px] mb-1" style={{ backgroundColor: `${results.recommendedRole.color}15`, color: results.recommendedRole.color, borderColor: `${results.recommendedRole.color}30` }}>
                        Recommended Role
                      </Badge>
                      <h3 className="text-xl font-bold" style={{ color: results.recommendedRole.color }}>
                        {results.recommendedRole.role}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{results.recommendedRole.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {results.recommendedRole.strengths.map(s => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-[#059669]" />
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CircularProgress value={results.totalScore} color={results.recommendedRole.color} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar chart and skill bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={showResults ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Competency Radar</CardTitle>
                <CardDescription>Your diplomatic skill profile across 6 areas</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedRadarChart scores={results.categoryScores} animate={showResults} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={showResults ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skill Breakdown</CardTitle>
                <CardDescription>Detailed scores per competency area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {results.categoryScores.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.score}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                        initial={{ width: 0 }}
                        animate={showResults ? { width: `${cat.score}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.15, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showResults ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Button
            className="bg-[#0D7377] hover:bg-[#0D7377]/90 text-white font-semibold px-8 h-12"
            onClick={() => onBeginTraining?.()}
          >
            <Zap className="w-4 h-4 mr-2" /> Begin Your Training
          </Button>
          <Button variant="outline" className="px-6 h-12" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" /> Retake Assessment
          </Button>
          <Button variant="outline" className="px-6 h-12">
            <Share2 className="w-4 h-4 mr-2" /> Share Results
          </Button>
        </motion.div>
      </div>
    )
  }

  // QUIZ PHASE
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Diagnostic Assessment</h2>
          <Badge variant="secondary" className="text-xs">
            {currentQuestion + 1} / {QUESTIONS.length}
          </Badge>
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#0D7377] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center gap-1 mt-2">
          {CATEGORIES.map(cat => {
            const catQuestions = cat.questions
            const answered = catQuestions.filter(qId => answers[qId] !== undefined).length
            const isCurrent = catQuestions.includes(question.id)
            return (
              <div
                key={cat.name}
                className={`flex-1 h-1 rounded-full transition-all ${isCurrent ? 'ring-1 ring-offset-1' : ''}`}
                style={{
                  backgroundColor: answered === catQuestions.length ? cat.color : isCurrent ? `${cat.color}60` : '#e5e7eb',
                  ringColor: isCurrent ? cat.color : 'transparent',
                }}
                title={`${cat.name}: ${answered}/${catQuestions.length}`}
              />
            )
          })}
        </div>
      </motion.div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: animatingOut ? -40 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: animatingOut ? 40 : -40 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="overflow-hidden">
            <div className="h-1" style={{ backgroundColor: CATEGORIES.find(c => c.name === question.category)?.color }} />
            <CardContent className="p-6 md:p-8">
              {/* Category badge */}
              <div className="flex items-center gap-2 mb-4">
                {(() => {
                  const cat = CATEGORIES.find(c => c.name === question.category)
                  if (!cat) return null
                  return (
                    <Badge className="text-xs" style={{ backgroundColor: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}30` }}>
                      <cat.icon className="w-3 h-3 mr-1" />
                      {cat.name}
                    </Badge>
                  )
                })()}
                <span className="text-xs text-muted-foreground">Question {question.id}</span>
              </div>

              {/* Question text */}
              <h3 className="text-lg md:text-xl font-semibold mb-6 leading-relaxed">{question.text}</h3>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {question.options.map((option, i) => {
                  const isSelected = selectedOption === option.score
                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleSelect(option.score)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                        isSelected
                          ? 'border-[#0D7377] bg-[#0D7377]/8 shadow-sm'
                          : 'border-muted hover:border-[#0D7377]/40 hover:bg-[#0D7377]/4'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#0D7377] text-white'
                            : 'bg-muted text-muted-foreground group-hover:bg-[#0D7377]/10 group-hover:text-[#0D7377]'
                        }`}>
                          {isSelected ? <CheckCircle2 className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                        </div>
                        <span className={`text-sm md:text-base leading-relaxed ${isSelected ? 'font-medium' : ''}`}>
                          {option.text}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        <div className="text-xs text-muted-foreground">
          {Object.keys(answers).length} of {QUESTIONS.length} answered
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="bg-[#0D7377] hover:bg-[#0D7377]/90 text-white gap-2"
        >
          {currentQuestion === QUESTIONS.length - 1 ? 'Submit' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
