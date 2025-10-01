import { NextRequest, NextResponse } from 'next/server'

interface EmailRequest {
  to: string
  subject: string
  content: string
  type: 'winner' | 'participant' | 'reminder'
  campaignTitle: string
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content, type, campaignTitle }: EmailRequest = await request.json()

    // Validate required fields
    if (!to || !subject || !content || !type || !campaignTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    // - Nodemailer with SMTP
    
    // For now, we'll simulate the email sending process
    console.log('Sending email:', {
      to,
      subject,
      type,
      campaignTitle,
      timestamp: new Date().toISOString()
    })

    // Simulate email service delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Log email for development purposes
    const emailLog = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      to,
      subject,
      content,
      type,
      campaignTitle,
      sentAt: new Date().toISOString(),
      status: 'sent'
    }

    // In production, you would:
    // 1. Store email logs in database
    // 2. Handle email service responses
    // 3. Implement retry logic for failed sends
    // 4. Track delivery status
    
    // Example with a hypothetical email service:
    /*
    const emailService = new EmailService(process.env.EMAIL_API_KEY)
    const result = await emailService.send({
      to,
      subject,
      html: content.replace(/\n/g, '<br>'),
      from: 'noreply@basedgiveaways.com'
    })
    
    if (!result.success) {
      throw new Error(result.error)
    }
    */

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: emailLog.id,
      sentAt: emailLog.sentAt
    })

  } catch (error) {
    console.error('Email sending failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve email logs (for admin purposes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const campaignTitle = searchParams.get('campaign')
    const limit = parseInt(searchParams.get('limit') || '50')

    // In production, this would query your database
    // For now, return mock data
    const mockEmailLogs = [
      {
        id: 'email_1',
        to: 'winner@example.com',
        subject: '🎉 Congratulations! You won the YE giveaway!',
        type: 'winner',
        campaignTitle: 'YE',
        sentAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'delivered'
      },
      {
        id: 'email_2',
        to: 'participant@example.com',
        subject: '✅ Entry confirmed for TRAVIS',
        type: 'participant',
        campaignTitle: 'TRAVIS',
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'sent'
      }
    ]

    let filteredLogs = mockEmailLogs

    if (type) {
      filteredLogs = filteredLogs.filter(log => log.type === type)
    }

    if (campaignTitle) {
      filteredLogs = filteredLogs.filter(log => 
        log.campaignTitle.toLowerCase().includes(campaignTitle.toLowerCase())
      )
    }

    return NextResponse.json({
      emails: filteredLogs.slice(0, limit),
      total: filteredLogs.length,
      filters: { type, campaignTitle, limit }
    })

  } catch (error) {
    console.error('Failed to retrieve email logs:', error)
    
    return NextResponse.json(
      { error: 'Failed to retrieve email logs' },
      { status: 500 }
    )
  }
}