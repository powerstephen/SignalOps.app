import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { accountId } = await request.json().catch(() => ({ accountId: 'demo-account' }))

    const [{ data: contacts }, { data: companies }] = await Promise.all([
      supabaseAdmin.from('hs_contacts').select('*').eq('account_id', accountId).limit(50),
      supabaseAdmin.from('hs_companies').select('*').eq('account_id', accountId).limit(50),
    ])

    const hasRealData = (contacts && contacts.length > 0) || (companies && companies.length > 0)

    const contactSummary = (contacts || []).map(c => ({
      name: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
      email: c.email,
      company: c.company,
      job_title: c.job_title,
    }))

    const companySummary = (companies || []).map(c => ({
      name: c.name,
      domain: c.domain,
      industry: c.industry,
      employees: c.employee_count,
      revenue: c.annual_revenue,
      country: c.country,
    }))

    const prompt = hasRealData
      ? `You are a revenue intelligence analyst. Analyse these real CRM records and build an ICP profile.

CONTACTS (${contactSummary.length}):
${JSON.stringify(contactSummary, null, 2)}

COMPANIES (${companySummary.length}):
${JSON.stringify(companySummary, null, 2)}

Based on this data, identify patterns and build an ICP profile. If data is limited, make reasonable inferences and note where more data would improve accuracy.

Return ONLY valid JSON matching this exact structure with no markdown or backticks:
{
  "summary": "2-3 sentence ICP description based on the actual data",
  "revenue_reality": { "total_analysed": ${(contacts||[]).length + (companies||[]).length}, "best_customers": 0, "avg_ltv_best": 0, "avg_ltv_all": 0, "ltv_multiplier": "N/A", "revenue_concentration": "N/A" },
  "primary_icp": { "label": "Primary ICP", "color": "teal", "title": "descriptive title", "size": "employee range", "stage": "funding stage", "industries": ["industry1", "industry2"], "regions": ["region1", "region2"], "avg_ltv": "estimated", "avg_months": 0, "expansion_rate": "N/A", "time_to_value": "N/A", "support_tickets": 0, "traits": ["trait1", "trait2", "trait3", "trait4", "trait5"] },
  "secondary_icp": { "label": "Secondary ICP", "color": "indigo", "title": "descriptive title", "size": "employee range", "stage": "funding stage", "industries": ["industry1", "industry2"], "regions": ["region1", "region2"], "avg_ltv": "estimated", "avg_months": 0, "expansion_rate": "N/A", "time_to_value": "N/A", "support_tickets": 0, "traits": ["trait1", "trait2", "trait3", "trait4", "trait5"] },
  "industry_breakdown": [{"label": "Industry1", "value": 40, "color": "#0D9488"}, {"label": "Other", "value": 60, "color": "#14B8A6"}],
  "size_breakdown": [{"label": "1-20", "value": 20, "color": "#6366F1"}, {"label": "21-50", "value": 40, "color": "#818CF8"}, {"label": "51-100", "value": 40, "color": "#A5B4FC"}],
  "profitability_matrix": [{"label": "Champions", "desc": "High LTV · Low tickets", "count": 0, "ltv": "N/A", "tickets": "N/A", "color": "teal", "action": "Clone these — they are your ICP"}, {"label": "Diamonds", "desc": "High LTV · High tickets", "count": 0, "ltv": "N/A", "tickets": "N/A", "color": "amber", "action": "Worth it, but set expectations early"}, {"label": "Quick Wins", "desc": "Lower LTV · Low tickets", "count": 0, "ltv": "N/A", "tickets": "N/A", "color": "blue", "action": "Good volume play — easy to serve"}, {"label": "Drains", "desc": "Low LTV · High tickets", "count": 0, "ltv": "N/A", "tickets": "N/A", "color": "red", "action": "Stop targeting these profiles"}],
  "red_flags": ["flag1", "flag2", "flag3"],
  "scorecard": { "size": "employee range", "stage": "funding stage", "industries": "top industries", "regions": "top regions", "time_to_value": "N/A", "expansion_window": "N/A", "ltv_multiplier": "N/A", "ticket_reduction": "N/A" }
}`
      : `You are a revenue intelligence analyst. Generate a realistic example ICP profile for a B2B SaaS company to demonstrate the SignalOps platform. Make it feel real and specific. Return ONLY valid JSON with no markdown or backticks:
{
  "summary": "2-3 sentence ICP description",
  "revenue_reality": { "total_analysed": 100, "best_customers": 24, "avg_ltv_best": 68400, "avg_ltv_all": 20200, "ltv_multiplier": "3.4x", "revenue_concentration": "71%" },
  "primary_icp": { "label": "Primary ICP", "color": "teal", "title": "Mid-Market HR & Sales Tech", "size": "40-90 employees", "stage": "Series A to Series B", "industries": ["HR Tech", "Sales Tech", "RevOps"], "regions": ["USA", "UK", "Ireland"], "avg_ltv": "€68,400", "avg_months": 19, "expansion_rate": "82%", "time_to_value": "18 days", "support_tickets": 3.2, "traits": ["VP Sales or RevOps as champion", "HubSpot or Salesforce already in place", "Stripe or Chargebee for billing", "Outbound-led growth motion", "Active hiring of SDRs or AEs"] },
  "secondary_icp": { "label": "Secondary ICP", "color": "indigo", "title": "Bootstrapped DevTools & FinTech", "size": "15-45 employees", "stage": "Bootstrapped to Seed", "industries": ["DevTools", "FinTech", "Analytics"], "regions": ["Germany", "Netherlands", "USA"], "avg_ltv": "€31,200", "avg_months": 14, "expansion_rate": "58%", "time_to_value": "24 days", "support_tickets": 2.1, "traits": ["Founder or CTO as champion", "Product-led with outbound overlay", "Fast time-to-value expectation", "High NPS, low expansion tendency", "Technical buyer, low handholding needed"] },
  "industry_breakdown": [{"label": "HR Tech", "value": 28, "color": "#0D9488"}, {"label": "Sales Tech", "value": 22, "color": "#14B8A6"}, {"label": "RevOps", "value": 18, "color": "#2DD4BF"}, {"label": "DevTools", "value": 16, "color": "#5EEAD4"}, {"label": "FinTech", "value": 10, "color": "#99F6E4"}, {"label": "Other", "value": 6, "color": "#CCFBF1"}],
  "size_breakdown": [{"label": "1-20", "value": 8, "color": "#6366F1"}, {"label": "21-50", "value": 26, "color": "#818CF8"}, {"label": "51-100", "value": 38, "color": "#A5B4FC"}, {"label": "101-200", "value": 20, "color": "#C7D2FE"}, {"label": "200+", "value": 8, "color": "#E0E7FF"}],
  "profitability_matrix": [{"label": "Champions", "desc": "High LTV · Low tickets", "count": 14, "ltv": "€74k avg", "tickets": "2.1 avg", "color": "teal", "action": "Clone these — they are your ICP"}, {"label": "Diamonds", "desc": "High LTV · High tickets", "count": 10, "ltv": "€61k avg", "tickets": "11.4 avg", "color": "amber", "action": "Worth it, but set expectations early"}, {"label": "Quick Wins", "desc": "Lower LTV · Low tickets", "count": 31, "ltv": "€18k avg", "tickets": "2.8 avg", "color": "blue", "action": "Good volume play — easy to serve"}, {"label": "Drains", "desc": "Low LTV · High tickets", "count": 45, "ltv": "€9k avg", "tickets": "14.2 avg", "color": "red", "action": "Stop targeting these profiles"}],
  "red_flags": ["Solo founders with no sales motion — high churn within 90 days", "Companies under 15 employees — low expansion, high support burden", "No CRM in place — 3x longer time to value, 2x higher churn", "E-commerce or D2C companies — poor product fit, high ticket volume", "Single contact engaged — champion dependency, high churn risk"],
  "scorecard": { "size": "40-90 employees", "stage": "Series A to Series B", "industries": "HR Tech or Sales Tech", "regions": "USA or UK", "time_to_value": "18 days", "expansion_window": "6 months", "ltv_multiplier": "3.4x", "ticket_reduction": "45%" }
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })

    const data = await response.json()
    if (!response.ok) return NextResponse.json({ error: `OpenAI error: ${data.error?.message}` }, { status: 500 })

    const result = JSON.parse(data.choices[0].message.content)
    return NextResponse.json({ result, source: hasRealData ? 'hubspot' : 'demo' })

  } catch (error: any) {
    console.error('ICP analysis error:', error)
    return NextResponse.json({ error: error?.message ?? 'Analysis failed' }, { status: 500 })
  }
}
