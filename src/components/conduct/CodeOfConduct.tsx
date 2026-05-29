'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Heart, BookOpen, MessageSquare, Gavel, Shirt,
  Monitor, AlertTriangle, Flag, ChevronDown, CheckCircle2,
  ScrollText, Scale, Globe
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// ============================================================
// SECTION DATA
// ============================================================

interface ConductSection {
  id: string
  number: number
  title: string
  icon: React.ElementType
  content: string[]
}

const SECTIONS: ConductSection[] = [
  {
    id: 'preamble',
    number: 1,
    title: 'Preamble',
    icon: ScrollText,
    content: [
      'MUNified is dedicated to fostering respectful, constructive, and educational discourse among delegates from diverse backgrounds worldwide. Our platform exists to prepare the next generation of diplomats, leaders, and global citizens.',
      'We believe that Model United Nations serves as a powerful tool for developing critical thinking, empathy, and cross-cultural understanding. This Code of Diplomatic Conduct establishes the principles and standards that all members of our community are expected to uphold.',
      'By using MUNified, you join a global community committed to the ideals of the United Nations: peace, cooperation, human rights, and sustainable development. We expect every member to conduct themselves with the dignity and respect befitting these ideals.',
    ],
  },
  {
    id: 'respect',
    number: 2,
    title: 'Respect & Dignity',
    icon: Heart,
    content: [
      'All delegates must treat fellow participants with respect and dignity, regardless of nationality, race, gender, religion, sexual orientation, or political views. Personal attacks, discrimination, or harassment of any kind will not be tolerated.',
      'Constructive disagreement is the cornerstone of diplomacy. Challenge ideas, not individuals. Engage in debate with the understanding that diverse perspectives strengthen our collective understanding.',
      'Respect the roles and authority of conference organizers, chairs, and faculty advisors. Their guidance ensures productive and fair proceedings for all delegates.',
    ],
  },
  {
    id: 'integrity',
    number: 3,
    title: 'Academic Integrity',
    icon: BookOpen,
    content: [
      'All work submitted through MUNified — including position papers, resolutions, and research briefs — must be your own original work. Plagiarism, including unauthorized use of AI-generated content presented as your own, is strictly prohibited.',
      'Properly cite all sources used in your research. Acknowledge the contributions of others and maintain transparency about the origins of your information and arguments.',
      'When using AI tools for research assistance, clearly indicate which parts of your work were developed with AI support. MUNified encourages ethical use of technology while maintaining authentic intellectual engagement.',
    ],
  },
  {
    id: 'communication',
    number: 4,
    title: 'Professional Communication',
    icon: MessageSquare,
    content: [
      'All communications on MUNified — including chat messages, forum posts, and committee discussions — must be professional, constructive, and relevant to the diplomatic exercise. Avoid informal language, slang, or tone that undermines the professional environment.',
      'Do not share personal contact information in public channels. Keep all communications within the platform to ensure safety and accountability.',
      'Report any inappropriate, offensive, or harmful content to the moderation team immediately. Do not engage with or amplify problematic messages.',
    ],
  },
  {
    id: 'etiquette',
    number: 5,
    title: 'Conference Etiquette',
    icon: Gavel,
    content: [
      'During MUN sessions, follow parliamentary procedure and respect the authority of the chair. Raise your placard to speak, address other delegates formally, and adhere to speaking time limits.',
      'Remain engaged and attentive during committee sessions. Refrain from side conversations, use of electronic devices for non-conference purposes, or any behavior that disrupts proceedings.',
      'Voting must reflect your assigned country\'s position, not your personal opinions. Represent your country authentically and research its policies thoroughly before sessions.',
    ],
  },
  {
    id: 'dress-code',
    number: 6,
    title: 'Dress Code',
    icon: Shirt,
    content: [
      'During MUN conferences and virtual sessions, delegates are expected to maintain professional attire consistent with diplomatic settings. This includes business formal wear: suits, dress shirts, ties, blazers, or equivalent professional attire.',
      'Cultural and religious attire is always welcome and respected. MUNified celebrates diversity and does not require anyone to compromise their cultural or religious dress practices.',
      'For virtual sessions, ensure your background is appropriate and professional. Maintain the same level of professionalism in your appearance as you would in an in-person conference.',
    ],
  },
  {
    id: 'digital',
    number: 7,
    title: 'Digital Conduct',
    icon: Monitor,
    content: [
      'Use MUNified\'s digital tools responsibly. Do not attempt to hack, exploit, or gain unauthorized access to any part of the platform or other users\' accounts.',
      'Respect the privacy of other delegates. Do not share screenshots, recordings, or content from private conversations without explicit consent from all parties involved.',
      'Maintain appropriate digital boundaries. Do not send unsolicited messages, engage in cyberbullying, or use the platform for purposes unrelated to MUN activities.',
    ],
  },
  {
    id: 'consequences',
    number: 8,
    title: 'Consequences',
    icon: AlertTriangle,
    content: [
      'Violations of this Code of Conduct will be reviewed by the MUNified moderation team. Depending on the severity of the violation, consequences may include: a formal warning, temporary suspension of platform privileges, or permanent account termination.',
      'Serious violations — including harassment, hate speech, plagiarism, or unauthorized access — may result in immediate suspension pending review, and may be reported to the delegate\'s school or institution.',
      'We aim to be fair and proportional in our responses. All reports are investigated thoroughly, and accused parties will have the opportunity to present their perspective before any action is taken.',
    ],
  },
  {
    id: 'reporting',
    number: 9,
    title: 'Reporting Violations',
    icon: Flag,
    content: [
      'If you experience or witness a violation of this Code of Conduct, please report it immediately using the in-app reporting feature or by contacting conduct@munified.io. All reports are treated confidentially.',
      'You may also report concerns to your faculty advisor, conference organizer, or any member of the MUNified team. We are committed to ensuring that no one faces retaliation for making a good-faith report.',
      'MUNified takes all reports seriously and commits to investigating them promptly and fairly. We will keep you informed about the progress of your report and any actions taken.',
    ],
  },
]

// ============================================================
// COLLAPSIBLE SECTION
// ============================================================

function ConductSectionCard({ section, isOpen, onToggle }: { section: ConductSection; isOpen: boolean; onToggle: () => void }) {
  const Icon = section.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: section.number * 0.06 }}
    >
      <Card className={`border-[#E8DED0]/60 overflow-hidden transition-all ${isOpen ? 'shadow-md' : 'hover:shadow-sm'}`}>
        <button
          onClick={onToggle}
          className="w-full text-left p-4 md:p-5 flex items-start gap-4 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-[#1B3A4B] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-[#D4A843]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#D4A843]">Section {section.number}</span>
            </div>
            <h3 className="text-base font-bold text-[#1B3A4B] mt-0.5">{section.title}</h3>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="shrink-0 mt-2"
          >
            <ChevronDown className="w-5 h-5 text-[#1B3A4B]/40" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Separator className="bg-[#E8DED0]/60" />
              <div className="p-4 md:p-5 pt-4 space-y-4">
                {section.content.map((paragraph, i) => (
                  <p key={i} className="text-sm text-[#1B3A4B]/80 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

// ============================================================
// MAIN CODE OF CONDUCT
// ============================================================

export default function CodeOfConduct() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['preamble']))
  const [accepted, setAccepted] = useState(false)

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => {
    setOpenSections(new Set(SECTIONS.map(s => s.id)))
  }

  const collapseAll = () => {
    setOpenSections(new Set())
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#1B3A4B] flex items-center justify-center">
            <Scale className="w-6 h-6 text-[#D4A843]" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1B3A4B]">
          MUNified Code of Diplomatic Conduct
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
          Our community standards and principles ensure that MUNified remains a respectful, educational, and inclusive platform for delegates worldwide.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge className="bg-[#0D7377]/10 text-[#0D7377] border-0">
            <Globe className="w-3 h-3 mr-1" /> Global Standards
          </Badge>
          <Badge className="bg-[#D4A843]/15 text-[#D4A843] border-0">
            <Shield className="w-3 h-3 mr-1" /> Community Protected
          </Badge>
        </div>
      </motion.div>

      {/* Quick Navigation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-[#E8DED0]/60 bg-gradient-to-r from-[#1B3A4B] to-[#264B5E]">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#D4A843] mr-2">Sections:</span>
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleSection(s.id)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                    openSections.has(s.id)
                      ? 'bg-[#D4A843] text-[#1B3A4B] font-semibold'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {s.number}. {s.title}
                </button>
              ))}
              <div className="flex items-center gap-2 ml-auto">
                <button onClick={expandAll} className="text-[10px] text-white/40 hover:text-white/70 transition-colors">
                  Expand All
                </button>
                <span className="text-white/20">|</span>
                <button onClick={collapseAll} className="text-[10px] text-white/40 hover:text-white/70 transition-colors">
                  Collapse All
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sections */}
      <div className="space-y-4">
        {SECTIONS.map(section => (
          <ConductSectionCard
            key={section.id}
            section={section}
            isOpen={openSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </div>

      {/* Acknowledgment */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className={`border-2 transition-all ${accepted ? 'border-[#059669]/30 bg-[#059669]/5' : 'border-[#1B3A4B]/20'}`}>
          <CardContent className="p-6 text-center">
            {accepted ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
                <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#059669] mb-1">Acknowledged</h3>
                <p className="text-sm text-muted-foreground">You have accepted the MUNified Code of Diplomatic Conduct</p>
              </motion.div>
            ) : (
              <>
                <p className="text-sm text-[#1B3A4B]/80 mb-4 max-w-lg mx-auto">
                  By using MUNified, you acknowledge that you have read, understood, and agree to abide by this Code of Diplomatic Conduct. Violations may result in disciplinary action as described above.
                </p>
                <Button
                  size="lg"
                  className="bg-[#1B3A4B] hover:bg-[#264B5E] text-white font-semibold px-8"
                  onClick={() => setAccepted(true)}
                >
                  <Shield className="w-4 h-4 mr-2" /> I Accept
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
