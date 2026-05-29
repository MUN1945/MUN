'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check, X, Sparkles, HelpCircle, ChevronDown, Mail,
  Zap, Shield, Globe, Users, Building2, Phone
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { useAuthStore } from '@/lib/store'

// ============================================================
// PLAN DATA
// ============================================================

interface PlanFeature {
  name: string
  observer: boolean | string
  delegatePro: boolean | string
  directorPro: boolean | string
  enterprise: boolean | string
}

const PLANS = [
  {
    id: 'FREE',
    name: 'Observer',
    price: 'Free',
    priceNote: 'forever',
    description: 'Get started with basic MUN resources and explore the platform.',
    cta: 'Current Plan',
    ctaVariant: 'outline' as const,
    borderColor: 'border-[#E8DED0]/60',
    accentColor: '#94A3B8',
  },
  {
    id: 'STUDENT_PRO',
    name: 'Delegate Pro',
    price: 'AED 29',
    priceNote: '/month',
    description: 'Full training and assessment access for individual delegates.',
    cta: 'Upgrade',
    ctaVariant: 'default' as const,
    popular: true,
    borderColor: 'border-[#0D7377]/30',
    accentColor: '#0D7377',
  },
  {
    id: 'TEACHER_PRO',
    name: 'Director Pro',
    price: 'AED 99',
    priceNote: '/month',
    description: 'Complete management suite for MUN directors and advisors.',
    cta: 'Upgrade',
    ctaVariant: 'default' as const,
    borderColor: 'border-[#D4A843]/30',
    accentColor: '#D4A843',
  },
  {
    id: 'SCHOOL_ENTERPRISE',
    name: 'School Enterprise',
    price: 'Custom',
    priceNote: 'pricing',
    description: 'Unlimited access for entire schools with dedicated support.',
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    borderColor: 'border-[#E8DED0]/60',
    accentColor: '#059669',
  },
]

const COMPARISON_FEATURES: PlanFeature[] = [
  { name: 'Platform Access', observer: 'Basic', delegatePro: 'Full', directorPro: 'Full', enterprise: 'Full' },
  { name: 'Diagnostic Assessments', observer: '1', delegatePro: 'Unlimited', directorPro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Training Modules', observer: '3 free', delegatePro: 'All', directorPro: 'All + Custom', enterprise: 'All + Custom' },
  { name: 'Conference Directory', observer: true, delegatePro: true, directorPro: true, enterprise: true },
  { name: 'Conference Registration', observer: false, delegatePro: true, directorPro: true, enterprise: true },
  { name: 'Performance Analytics', observer: false, delegatePro: true, directorPro: true, enterprise: true },
  { name: 'Committee Hub', observer: false, delegatePro: true, directorPro: true, enterprise: true },
  { name: 'Real-time Chat', observer: false, delegatePro: true, directorPro: true, enterprise: true },
  { name: 'Conference Command Tools', observer: false, delegatePro: false, directorPro: true, enterprise: true },
  { name: 'Team Management', observer: false, delegatePro: false, directorPro: true, enterprise: true },
  { name: 'Delegate Progress Tracking', observer: false, delegatePro: false, directorPro: true, enterprise: true },
  { name: 'Custom Assessments', observer: false, delegatePro: false, directorPro: true, enterprise: true },
  { name: 'Export & Reporting', observer: false, delegatePro: false, directorPro: true, enterprise: true },
  { name: 'Priority Support', observer: false, delegatePro: false, directorPro: true, enterprise: true },
  { name: 'Unlimited Student Seats', observer: false, delegatePro: false, directorPro: false, enterprise: true },
  { name: 'Dedicated Account Manager', observer: false, delegatePro: false, directorPro: false, enterprise: true },
  { name: 'SSO & LMS Integration', observer: false, delegatePro: false, directorPro: false, enterprise: true },
  { name: 'Custom Branding', observer: false, delegatePro: false, directorPro: false, enterprise: true },
  { name: 'On-site Training', observer: false, delegatePro: false, directorPro: false, enterprise: true },
  { name: 'SLA Guarantee', observer: false, delegatePro: false, directorPro: false, enterprise: true },
  { name: 'API Access', observer: false, delegatePro: false, directorPro: false, enterprise: true },
]

const FAQ_ITEMS = [
  {
    question: 'Is there a free trial available?',
    answer: 'Yes! Both Delegate Pro and Director Pro plans come with a 14-day free trial. No credit card required. You can explore all premium features before committing.',
  },
  {
    question: 'Can I switch plans at any time?',
    answer: 'Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, the change takes effect at the end of your current billing cycle.',
  },
  {
    question: 'What happens when my free trial ends?',
    answer: 'When your trial ends, you\'ll be automatically moved to the free Observer plan. No charges will be made unless you explicitly choose to subscribe. We\'ll send you a reminder before your trial expires.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes, we offer a 20% discount when you choose annual billing. Delegate Pro drops to AED 278/year (AED 23.17/month) and Director Pro to AED 948/year (AED 79/month).',
  },
  {
    question: 'Can I get a refund if I\'m not satisfied?',
    answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied within the first 30 days, contact our support team for a full refund — no questions asked.',
  },
  {
    question: 'How does the School Enterprise plan work?',
    answer: 'School Enterprise provides unlimited access for your entire school. Pricing is based on school size and needs. Contact our sales team for a custom quote that includes dedicated support, training, and integration assistance.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for School Enterprise plans. All payments are processed securely through Stripe.',
  },
  {
    question: 'Is my data secure on MUNified?',
    answer: 'Absolutely. We take data security seriously. All data is encrypted in transit and at rest. We comply with FERPA, COPPA, and GDPR regulations. Schools have full control over their data, and we never sell user information to third parties.',
  },
  {
    question: 'Can students and teachers use the same plan?',
    answer: 'Delegate Pro is designed for individual students, while Director Pro is built for teachers and MUN advisors. Schools can mix and match by purchasing School Enterprise, which includes access for all students and teachers.',
  },
]

// ============================================================
// FEATURE CELL
// ============================================================

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-sm text-[#1B3A4B]">{value}</span>
  }
  return value ? (
    <Check className="w-4 h-4 text-[#059669]" />
  ) : (
    <X className="w-4 h-4 text-gray-300" />
  )
}

// ============================================================
// MAIN PRICING PAGE
// ============================================================

export default function PricingPage() {
  const { user } = useAuthStore()
  const currentPlan = user?.subscriptionTier || 'FREE'
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <Badge className="bg-[#D4A843]/15 text-[#D4A843] border-0 mb-4">
          <Sparkles className="w-3 h-3 mr-1" /> Pricing
        </Badge>
        <h2 className="text-3xl font-bold text-[#1B3A4B]">Invest in Diplomatic Excellence</h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Choose the plan that matches your MUN ambitions. Start free, upgrade as you grow.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-[#1B3A4B] font-medium' : 'text-muted-foreground'}`}>Monthly</span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            className="relative w-12 h-6 bg-[#0D7377] rounded-full transition-colors"
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${billingPeriod === 'annual' ? 'left-0.5' : 'left-[26px]'}`} />
          </button>
          <span className={`text-sm ${billingPeriod === 'annual' ? 'text-[#1B3A4B] font-medium' : 'text-muted-foreground'}`}>
            Annual <Badge className="bg-[#059669]/15 text-[#059669] border-0 text-[9px] ml-1">Save 20%</Badge>
          </span>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map((plan, i) => {
          const isCurrentPlan = plan.id === currentPlan
          const price = billingPeriod === 'annual' && plan.price !== 'Free' && plan.price !== 'Custom'
            ? `AED ${Math.round(parseInt(plan.price.replace('AED ', '')) * 12 * 0.8)}`
            : plan.price
          const priceNote = billingPeriod === 'annual' && plan.price !== 'Free' && plan.price !== 'Custom' ? '/year' : plan.priceNote

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-[#0D7377] text-white border-0 shadow-lg shadow-[#0D7377]/30 px-3">
                    <Sparkles className="w-3 h-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}

              <Card className={`border ${plan.borderColor} ${plan.popular ? 'ring-2 ring-[#0D7377]/30 shadow-lg shadow-[#0D7377]/5' : ''} hover:shadow-xl transition-all duration-300 h-full flex flex-col`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[#1B3A4B]">{plan.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-[#1B3A4B]">{price}</span>
                    <span className="text-muted-foreground text-sm ml-1">{priceNote}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {isCurrentPlan ? (
                    <div className="mb-4">
                      <Badge className="bg-[#0D7377]/10 text-[#0D7377] border-0 w-full justify-center py-1.5">
                        <Check className="w-3.5 h-3.5 mr-1" /> Current Plan
                      </Badge>
                    </div>
                  ) : (
                    <Button
                      variant={plan.ctaVariant}
                      className={`w-full font-semibold mb-4 ${
                        plan.popular
                          ? 'bg-[#0D7377] text-white hover:bg-[#0A5C5F] shadow-md shadow-[#0D7377]/20'
                          : plan.id === 'SCHOOL_ENTERPRISE'
                          ? 'border-[#059669]/30 text-[#059669] hover:bg-[#059669]/5'
                          : ''
                      }`}
                      style={!plan.popular && plan.ctaVariant === 'default' ? { backgroundColor: plan.accentColor } : undefined}
                    >
                      {plan.cta}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Feature Comparison Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-[#E8DED0]/60">
          <CardHeader>
            <CardTitle className="text-xl text-[#1B3A4B]">Feature Comparison</CardTitle>
            <CardDescription>See everything that&apos;s included in each plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#E8DED0]">
                    <th className="text-left py-3 px-3 font-semibold text-[#1B3A4B] w-[200px]">Feature</th>
                    <th className="text-center py-3 px-2 font-semibold text-[#1B3A4B]">Observer</th>
                    <th className="text-center py-3 px-2 font-semibold text-[#0D7377]">Delegate Pro</th>
                    <th className="text-center py-3 px-2 font-semibold text-[#D4A843]">Director Pro</th>
                    <th className="text-center py-3 px-2 font-semibold text-[#059669]">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((feature, i) => (
                    <tr key={feature.name} className={`border-b border-[#E8DED0]/50 ${i % 2 === 0 ? 'bg-[#F5F0EB]/30' : ''}`}>
                      <td className="py-2.5 px-3 text-[#1B3A4B]/80 font-medium">{feature.name}</td>
                      <td className="py-2.5 px-2 text-center"><FeatureCell value={feature.observer} /></td>
                      <td className="py-2.5 px-2 text-center"><FeatureCell value={feature.delegatePro} /></td>
                      <td className="py-2.5 px-2 text-center"><FeatureCell value={feature.directorPro} /></td>
                      <td className="py-2.5 px-2 text-center"><FeatureCell value={feature.enterprise} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FAQ Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-[#E8DED0]/60">
          <CardHeader>
            <CardTitle className="text-xl text-[#1B3A4B]">Frequently Asked Questions</CardTitle>
            <CardDescription>Everything you need to know about MUNified pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-[#E8DED0]/50">
                  <AccordionTrigger className="text-sm font-medium text-[#1B3A4B] hover:text-[#0D7377] hover:no-underline text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Sales CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="border-[#059669]/20 bg-gradient-to-r from-[#1B3A4B] to-[#264B5E] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#0D7377] rounded-full opacity-[0.08] -translate-y-1/2 translate-x-1/4" />
          <CardContent className="p-8 text-center relative z-10">
            <Building2 className="w-10 h-10 text-[#D4A843] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Need a custom solution for your school?</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Our School Enterprise plan includes unlimited seats, dedicated support, and custom integrations. Get a personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button className="bg-[#D4A843] text-[#1B3A4B] hover:bg-[#D4BA6E] font-semibold px-6">
                <Mail className="w-4 h-4 mr-2" /> Contact Sales
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6">
                <Phone className="w-4 h-4 mr-2" /> Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
