'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Globe, Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2,
  AlertCircle, Copy, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

export default function ForgotPasswordPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resetUrl, setResetUrl] = useState<string | null>(null)
  const [emailDeliveryFailed, setEmailDeliveryFailed] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResetUrl(null)
    setEmailDeliveryFailed(false)

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const result = await res.json()

      if (res.ok) {
        setSuccess(true)
        // If email delivery failed, show the reset link as a fallback
        if (result.resetUrl) {
          setResetUrl(result.resetUrl)
          setEmailDeliveryFailed(true)
        }
      } else {
        setError(result?.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Unable to connect to server. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (resetUrl) {
      navigator.clipboard.writeText(resetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#0A7E8C] rounded-full opacity-[0.04] blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#D4A843] rounded-full opacity-[0.04] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#D4A843]/[0.07] rounded-full" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#D4A843] flex items-center justify-center shadow-md shadow-[#D4A843]/20">
            <Globe className="w-6 h-6 text-[#0D1B2A]" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Diplomati<span className="text-[#D4A843]">Q</span>
          </span>
        </div>

        <Card className="bg-white/[0.06] border-white/[0.08] backdrop-blur-xl overflow-hidden">
          {success ? (
            <>
              <CardHeader className="text-center pb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <CardTitle className="text-2xl text-white">{t('auth.forgotPassword.checkEmail')}</CardTitle>
                <CardDescription className="text-white/45">
                  If an account exists with <span className="text-white/70">{email}</span>, you&apos;ll receive a password reset link shortly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {emailDeliveryFailed && resetUrl ? (
                  <div className="space-y-3">
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-sm">
                      <div className="flex items-center gap-2 text-amber-400 font-medium mb-2">
                        <AlertCircle className="w-4 h-4" />
                        Email delivery unavailable
                      </div>
                      <p className="text-white/60 text-xs mb-3">
                        We couldn&apos;t send the reset email. Use this direct link to reset your password:
                      </p>
                      <div className="bg-[#0D1B2A] border border-white/10 rounded-lg p-3">
                        <p className="text-[#0A7E8C] text-xs break-all mb-3">{resetUrl}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-[#0A7E8C] hover:bg-[#0A9EAC] text-white text-xs h-7"
                            onClick={() => window.location.href = resetUrl}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" /> Open Reset Link
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 text-white/70 hover:bg-white/5 text-xs h-7"
                            onClick={handleCopyLink}
                          >
                            <Copy className="w-3 h-3 mr-1" /> {copied ? 'Copied!' : 'Copy Link'}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#0A7E8C]/10 border border-[#0A7E8C]/20 rounded-lg p-3 text-xs text-white/50">
                      This link expires in 1 hour. If you did not request this reset, you can safely ignore it.
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0A7E8C]/10 border border-[#0A7E8C]/20 rounded-lg p-4 text-sm text-white/60">
                    <p>Check your email inbox and spam folder for the reset link. The link expires in 1 hour.</p>
                    <p className="mt-2 text-white/40 text-xs">If you don&apos;t receive the email within a few minutes, try again or contact support.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-3 pb-6">
                <Button
                  className="w-full bg-[#D4A843] text-[#0D1B2A] hover:bg-[#E0BC6A] font-semibold h-11"
                  onClick={() => { setSuccess(false); setEmail(''); setResetUrl(null); setEmailDeliveryFailed(false) }}
                >
                  Send Another Link
                </Button>
                <Link
                  href="/auth/signin"
                  className="text-sm text-[#0A7E8C] hover:text-[#0A9EAC] transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t('auth.forgotPassword.backToSignIn')}
                </Link>
              </CardFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl text-white">{t('auth.forgotPassword.title')}</CardTitle>
                <CardDescription className="text-white/45">
                  {t('auth.forgotPassword.instructions')}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">{t('common.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      placeholder="your@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="pl-10 bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#D4A843]/50 focus:ring-[#D4A843]/20"
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-[#D4A843] text-[#0D1B2A] hover:bg-[#E0BC6A] font-semibold h-11 shadow-md shadow-[#D4A843]/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>{t('auth.forgotPassword.sendLink')} <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </CardContent>

              <CardFooter className="flex-col gap-3 pb-6">
                <Link
                  href="/auth/signin"
                  className="text-sm text-[#0A7E8C] hover:text-[#0A9EAC] transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t('auth.forgotPassword.backToSignIn')}
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
