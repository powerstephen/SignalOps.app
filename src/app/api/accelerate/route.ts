import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { accountId } = await request.json().catch(() => ({ accountId: 'demo-account' }))

    const { data: deals } = await supabaseAdmin
      .from('hs_deals')
      .select('*')
      .eq('account_id', accountId)
      .not('stage', 'eq', 'closedwon')
      .not('stage', 'eq', 'closedlost')
      .limit(40)

    const hasRealDeals = deals && deals.length > 0

    const dealData = hasRealDeals ? deals.map(d => ({
      id: d.hubspot_id,
      company: d.deal_name?.split(' - ')[0] || d.deal_name,
      deal_name: d.deal_name,
      stage: d.stage,
      amount: d.amount,
      close_date: d.close_date,
      days_in_stage: d.days_in_stage || Math.floor(Math.random() * 20) + 1,
      last_activity: d.last_activity_date,
      pipeline: d.pipeline,
    })) : []

    if (!hasRealDeals) {
      return NextResponse.json({ deals: [], source: 'no_data' })
    }

    const prompt = `You are a sales intelligence analyst for a B2B SaaS company. Score each pipeline deal on health.

For each deal, analyse the stage, amount, close date, and days in stage to infer deal health. Use these rules:
- Deals past their close date = stalling
- Deals in early stages with close dates soon = at risk  
- Deals progressing normally = on track
- Deals with strong stage progression = accelerating
- "qualifiedtobuy" stage = early/qualified
- "presentationscheduled" stage = proposal/mid stage
- "decisionmakerboughtin" stage = negotiation/late stage
- "contractsent" stage = near close

DEALS:
${JSON.stringify(dealData, null, 2)}

Today's date: ${new Date().toISOString().split('T')[0]}

For each deal generate:
- A realistic health score (0-100)
- A status: exactly "Accelerating", "On Track", "At Risk", or "Stalling"
- Engagement, commitment, velocity, stakeholder scores (0-100 each)
- A specific top signal based on the deal data
- 0-3 specific risk flags
- A specific next action the rep should take
- Two follow-up email drafts with subject lines and bodies

Return ONLY valid JSON with no markdown:
{
  "deals": [
    {
      "id": "deal_id",
      "company": "company name",
      "contact": "inferred contact name",
      "title": "inferred title e.g. VP Sales",
      "stage": "stage name",
      "deal_value": 15000,
      "health_score": 72,
      "status": "On Track",
      "engagement_score": 70,
      "commitment_score": 68,
      "velocity_score": 75,
      "stakeholder_score": 72,
      "top_signal": "specific signal about this deal",
      "risk_flags": ["flag1", "flag2"],
      "next_action": "specific next action for this deal",
      "days_in_stage": 8,
      "avg_days_won": 10,
      "email1": {
        "subject": "email subject",
        "body": "email body",
        "timing": "Send now",
        "goal": "goal of this email"
      },
      "email2": {
        "subject": "follow up subject",
        "body": "follow up body",
        "timing": "Schedule · Day 5",
        "goal": "goal of follow up"
      }
    }
  ]
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })

    const data = await response.json()
    if (!response.ok) return NextResponse.json({ error: `OpenAI error: ${data.error?.message}` }, { status: 500 })

    const parsed = JSON.parse(data.choices[0].message.content)
    const scored = parsed.deals
      .sort((a: any, b: any) => {
        const order: Record<string, number> = { 'Stalling': 0, 'At Risk': 1, 'On Track': 2, 'Accelerating': 3 }
        return (order[a.status] ?? 2) - (order[b.status] ?? 2)
      })

    return NextResponse.json({ deals: scored, source: 'hubspot' })

  } catch (error: any) {
    console.error('Ignite scoring error:', error)
    return NextResponse.json({ error: error?.message ?? 'Scoring failed' }, { status: 500 })
  }
}
