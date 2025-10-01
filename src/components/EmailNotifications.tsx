'use client'

import { useState } from 'react'
import { Mail, Check, X, AlertCircle } from 'lucide-react'

interface EmailNotificationProps {
  type: 'winner' | 'participant' | 'reminder'
  recipient: string
  campaignTitle: string
  onSend?: () => void
  onClose?: () => void
}

interface EmailTemplateData {
  subject: string
  content: string
}

export default function EmailNotifications({ type, recipient, campaignTitle, onSend, onClose }: EmailNotificationProps) {
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const getEmailTemplate = (): EmailTemplateData => {
    switch (type) {
      case 'winner':
        return {
          subject: `🎉 Congratulations! You won the ${campaignTitle} giveaway!`,
          content: `
Congratulations! You are the winner of the ${campaignTitle} giveaway!

Your entry has been selected and you will be contacted shortly with details on how to claim your prize.

Thank you for participating in our BASED giveaway platform!

Best regards,
The BASED Team
          `.trim()
        }
      case 'participant':
        return {
          subject: `✅ Entry confirmed for ${campaignTitle}`,
          content: `
Thank you for entering the ${campaignTitle} giveaway!

Your entry has been successfully recorded. We'll notify you if you're selected as the winner.

Good luck!

Best regards,
The BASED Team
          `.trim()
        }
      case 'reminder':
        return {
          subject: `⏰ ${campaignTitle} giveaway ending soon!`,
          content: `
The ${campaignTitle} giveaway is ending soon!

Don't miss your chance to participate. Enter now before it's too late.

Visit our platform to enter: ${window.location.origin}

Best regards,
The BASED Team
          `.trim()
        }
      default:
        return { subject: '', content: '' }
    }
  }

  const handleSendEmail = async () => {
    setIsSending(true)
    setError('')

    try {
      const template = getEmailTemplate()
      
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipient,
          subject: template.subject,
          content: template.content,
          type,
          campaignTitle
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      setSent(true)
      onSend?.()
      
      // Auto close after 2 seconds
      setTimeout(() => {
        onClose?.()
      }, 2000)
    } catch (err) {
      setError('Failed to send email. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const template = getEmailTemplate()

  // Show success message for participant type instead of email form
  if (type === 'participant') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-black border-2 border-white max-w-2xl w-full">
          {/* Header */}
          <div className="border-b border-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-400" />
              <h2 className="font-mono text-lg font-bold">SUBMISSION SUCCESSFUL</h2>
            </div>
            <button
              onClick={onClose}
              className="border border-white p-2 hover:bg-white hover:text-black transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Success Message */}
          <div className="p-8 space-y-6 text-center">
            <div className="space-y-4">
              <div className="border border-green-500 p-6 bg-green-900/20">
                <Check className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-mono text-xl font-bold text-green-400 mb-2">
                  APPLICATION SUBMITTED SUCCESSFULLY!
                </h3>
                <p className="text-sm text-gray-300">
                  Your entry for {campaignTitle} has been recorded.
                </p>
              </div>

              <div className="border border-white p-6 space-y-4">
                <h4 className="font-mono text-lg font-bold">STAY UPDATED</h4>
                <p className="text-sm text-gray-300 mb-4">
                  Join our Telegram group to keep updated with everything about the giveaway and get notified when winners are announced.
                </p>
                
                <a
                  href="https://t.me/basezambia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-blue-400 bg-blue-900/20 px-6 py-3 font-mono text-sm text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-300"
                >
                  JOIN TELEGRAM GROUP
                </a>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full border border-white p-3 hover:bg-white hover:text-black transition-colors font-mono text-sm"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Original email form for other types (winner, reminder)
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border-2 border-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5" />
            <h2 className="font-mono text-lg font-bold">
              {type === 'winner' && 'WINNER NOTIFICATION'}
              {type === 'reminder' && 'REMINDER EMAIL'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="border border-white p-2 hover:bg-white hover:text-black transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Email Preview */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-sm mb-2">TO:</label>
              <div className="border border-white p-3 font-mono text-sm bg-gray-900">
                {recipient}
              </div>
            </div>
            
            <div>
              <label className="block font-mono text-sm mb-2">SUBJECT:</label>
              <div className="border border-white p-3 font-mono text-sm bg-gray-900">
                {template.subject}
              </div>
            </div>
            
            <div>
              <label className="block font-mono text-sm mb-2">MESSAGE:</label>
              <div className="border border-white p-4 text-sm bg-gray-900 whitespace-pre-line">
                {template.content}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="border border-red-500 p-4 flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-mono text-sm">{error}</span>
            </div>
          )}

          {sent && (
            <div className="border border-green-500 p-4 flex items-center gap-3 text-green-400">
              <Check className="h-5 w-5" />
              <span className="font-mono text-sm">EMAIL SENT SUCCESSFULLY</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSendEmail}
              disabled={isSending || sent}
              className="flex-1 border border-white p-3 hover:bg-white hover:text-black transition-colors font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'SENDING...' : sent ? 'SENT' : 'SEND EMAIL'}
            </button>
            <button
              onClick={onClose}
              className="border border-white p-3 hover:bg-white hover:text-black transition-colors font-mono text-sm px-6"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for managing email notifications
export function useEmailNotifications() {
  const [notifications, setNotifications] = useState<EmailNotificationProps[]>([])

  const sendWinnerNotification = (recipient: string, campaignTitle: string) => {
    setNotifications(prev => [...prev, {
      type: 'winner',
      recipient,
      campaignTitle,
      onSend: () => removeNotification(0),
      onClose: () => removeNotification(0)
    }])
  }

  const sendParticipantConfirmation = (recipient: string, campaignTitle: string) => {
    setNotifications(prev => [...prev, {
      type: 'participant',
      recipient,
      campaignTitle,
      onSend: () => removeNotification(0),
      onClose: () => removeNotification(0)
    }])
  }

  const sendReminder = (recipient: string, campaignTitle: string) => {
    setNotifications(prev => [...prev, {
      type: 'reminder',
      recipient,
      campaignTitle,
      onSend: () => removeNotification(0),
      onClose: () => removeNotification(0)
    }])
  }

  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  return {
    notifications,
    sendWinnerNotification,
    sendParticipantConfirmation,
    sendReminder,
    removeNotification
  }
}