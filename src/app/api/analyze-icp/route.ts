import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { accountId } = await request.json().catch(() => ({ accountId: 'demo-account' }))

    const [{ data: contacts }, { data: companies }] = await Promise.all([
      supabaseAdmin.from('hs_contacts').select('*').eq('account_id', accountId).limit(100),
      supabaseAdmin.from('hs_companies').select('*').eq('account_id', accountId).limit(250),
    ])

    const hasRealData = (contacts && contacts.length > 0) || (companies && companies.length > 0)

    const contactSummary = (contacts || []).map(c => ({
      name: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
      company: c.company,
      job_title: c.job_title,
    }))

    const companySummary = (companies || []).map(c => ({
      name: c.name,
      domain: c.domain,
      employees: c.employee_count,
      revenue: c.annual_revenue,
      country: c.country,
    }))

    const prompt = hasRealData
      ? `You are a revenue intelligence analyst for a B2B SaaS platform called SignalOps.

Analyse these CRM records and build a detailed ICP profile. 

IMPORTANT: Do NOT use the HubSpot industry field — it is unreliable. Instead, infer each company's true SaaS vertical from their company name and domain. Use these specific subcategories: HR Tech, Sales Tech, RevOps, DevTools, FinTech, LegalTech, MarTech, CS Tech, Security, Analytics, Product Analytics, Workflow, EdTech, HealthTech, PropTech, Other SaaS.

For example:
- "TalentFlow", "HireIQ", "PeopleFirst" → HR Tech
- "SalesPath", "PipelineAI", "QuotaIQ" → Sales Tech  
- "RevEngine", "GTMstack", "OpsMetrics" → RevOps
- "CodeMetrics", "DevFlow", "BuildIQ" → DevTools
- "FinanceAI", "PayMetrics", "BillingIQ" → FinTech
- "CampaignIQ", "LeadEngine", "MarketAI" → MarTech
- "ChurnStop", "SuccessIQ", "RetainBase" → CS Tech
- "SecureOps", "ThreatIQ", "ComplianceAI" → Security
- "DataPulse", "InsightIQ", "MetricsAI" → Analytics
- "ProductIQ", "FeatureFlow", "UsageAI" → Product Analytics
- "DocFlow", "WorkflowAI", "ApprovalIQ" → Workflow

CONTACTS (${contactSummary.length}):
${JSON.stringify(contactSummary, null, 2)}

COMPANIES (${companySummary.length}):
${JSON.stringify(companySummary, null, 2)}

Analyse patterns across company names, domains, employee counts, revenue, and contact titles. Build a rich, specific ICP profile. Use employee counts and revenue to estimate funding stages and LTV ranges. Be specific and opinionated — this is a demo of what SignalOps can do with real data.

Return ONLY valid JSON with no markdown or backticks:
{
  "summary": "2-3 sentence specific ICP description referencing actual patterns you found in the data",
  "revenue_reality": {
    "total_analysed": ${(companies||[]).length},
    "best_customers": ${Math.round((companies||[]).length * 0.25)},
    "avg_ltv_best": 68000,
    "avg_ltv_all": 21000,
    "ltv_multiplier": "3.2x",
    "revenue_concentration": "68%"
  },
  "primary_icp": {
    "label": "Primary ICP",
    "color": "teal",
    "title": "specific title based on what you found",
    "size": "employee range e.g. 40-90 employees",
    "stage": "funding stage e.g. Series A to Series B",
    "industries": ["top industry", "second industry", "third industry"],
    "regions": ["top region", "second region"],
    "avg_ltv": "estimated e.g. €65,000",
    "avg_months": 18,
    "expansion_rate": "estimated e.g. 74%",
    "time_to_value": "estimated e.g. 21 days",
    "support_tickets": 3.1,
    "traits": ["specific trait 1", "specific trait 2", "specific trait 3", "specific trait 4", "specific trait 5"]
  },
  "secondary_icp": {
    "label": "Secondary ICP",
    "color": "indigo",
    "title": "specific title based on what you found",
    "size": "employee range",
    "stage": "funding stage",
    "industries": ["industry1", "industry2"],
    "regions": ["region1", "region2"],
    "avg_ltv": "estimated",
    "avg_months": 14,
    "expansion_rate": "estimated e.g. 58%",
    "time_to_value": "estimated e.g. 26 days",
    "support_tickets": 2.4,
    "traits": ["trait1", "trait2", "trait3", "trait4", "trait5"]
  },
  "industry_breakdown": [
    {"label": "HR Tech", "value": 0, "color": "#0D9488"},
    {"label": "Sales Tech", "value": 0, "color": "#14B8A6"},
    {"label": "RevOps", "value": 0, "color": "#2DD4BF"},
    {"label": "DevTools", "value": 0, "color": "#5EEAD4"},
    {"label": "FinTech", "value": 0, "color": "#99F6E4"},
    {"label": "MarTech", "value": 0, "color": "#6366F1"},
    {"label": "CS Tech", "value": 0, "color": "#818CF8"},
    {"label": "Analytics", "value": 0, "color": "#A5B4FC"},
    {"label": "Other", "value": 0, "color": "#CCFBF1"}
  ],
  "size_breakdown": [
    {"label": "1-20", "value": 0, "color": "#6366F1"},
    {"label": "21-50", "value": 0, "color": "#818CF8"},
    {"label": "51-100", "value": 0, "color": "#A5B4FC"},
    {"label": "101-200", "value": 0, "color": "#C7D2FE"},
    {"label": "200+", "value": 0, "color": "#E0E7FF"}
  ],
  "profitability_matrix": [
    {"label": "Champions", "desc": "High LTV · Low tickets", "count": 0, "ltv": "estimated", "tickets": "estimated", "color": "teal", "action": "Clone these — they are your ICP"},
    {"label": "Diamonds", "desc": "High LTV · High tickets", "count": 0, "ltv": "estimated", "tickets": "estimated", "color": "amber", "action": "Worth it, but set expectations early"},
    {"label": "Quick Wins", "desc": "Lower LTV · Low tickets", "count": 0, "ltv": "estimated", "tickets": "estimated", "color": "blue", "action": "Good volume play — easy to serve"},
    {"label": "Drains", "desc": "Low LTV · High tickets", "count": 0, "ltv": "estimated", "tickets": "estimated", "color": "red", "action": "Stop targeting these profiles"}
  ],
  "red_flags": ["specific red flag 1 based on data", "specific red flag 2", "specific red flag 3", "specific red flag 4"],
  "scorecard": {
    "size": "employee range",
    "stage": "funding stage",
    "industries": "top 2-3 industries",
    "regions": "top regions",
    "time_to_value": "estimated",
    "expansion_window": "estimated",
    "ltv_multiplier": "estimated",
    "ticket_reduction": "estimated"
  }
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
