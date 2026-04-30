import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function getValidToken(accountId: string) {
  const { data, error } = await supabaseAdmin
    .from('hubspot_connections')
    .select('*')
    .eq('account_id', accountId)
    .single()

  if (error || !data) throw new Error('No connection found')

  const isExpired = new Date(data.expires_at) < new Date()
  if (!isExpired) return data.access_token

  const res = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.HUBSPOT_CLIENT_ID!,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
      refresh_token: data.refresh_token,
    }),
  })

  const tokens = await res.json()
  if (!res.ok) throw new Error('Token refresh failed')

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()
  await supabaseAdmin.from('hubspot_connections').update({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: expiresAt,
  }).eq('account_id', accountId)

  return tokens.access_token
}

async function fetchAllPages(url: string, token: string) {
  let results: any[] = []
  let after: string | null = null

  while (true) {
    const pageUrl = after ? `${url}&after=${after}` : url
    const res = await fetch(pageUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(JSON.stringify(data))
    results = results.concat(data.results || [])
    after = data.paging?.next?.after ?? null
    if (!after) break
  }

  return results
}

export async function POST(request: Request) {
  const { accountId } = await request.json()
  if (!accountId) return NextResponse.json({ error: 'Missing accountId' }, { status: 400 })

  try {
    const token = await getValidToken(accountId)

    // Sync contacts
    const contacts = await fetchAllPages(
      'https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,company,jobtitle',
      token
    )
    if (contacts.length > 0) {
      await supabaseAdmin.from('hs_contacts').upsert(
        contacts.map((c: any) => ({
          account_id: accountId,
          hubspot_id: c.id,
          first_name: c.properties.firstname,
          last_name: c.properties.lastname,
          email: c.properties.email,
          company: c.properties.company,
          job_title: c.properties.jobtitle,
        })),
        { onConflict: 'account_id,hubspot_id' }
      )
    }

    // Sync companies
    const companies = await fetchAllPages(
      'https://api.hubapi.com/crm/v3/objects/companies?limit=100&properties=name,domain,industry,numberofemployees,annualrevenue,country',
      token
    )
    if (companies.length > 0) {
      await supabaseAdmin.from('hs_companies').upsert(
        companies.map((c: any) => ({
          account_id: accountId,
          hubspot_id: c.id,
          name: c.properties.name,
          domain: c.properties.domain,
          industry: c.properties.industry,
          employee_count: c.properties.numberofemployees ? parseInt(c.properties.numberofemployees) : null,
          annual_revenue: c.properties.annualrevenue ? parseFloat(c.properties.annualrevenue) : null,
          country: c.properties.country,
        })),
        { onConflict: 'account_id,hubspot_id' }
      )
    }

    // Sync deals
    const deals = await fetchAllPages(
      'https://api.hubapi.com/crm/v3/objects/deals?limit=100&properties=dealname,dealstage,amount,closedate,pipeline,hs_lastmodifieddate',
      token
    )
    if (deals.length > 0) {
      await supabaseAdmin.from('hs_deals').upsert(
        deals.map((d: any) => ({
          account_id: accountId,
          hubspot_id: d.id,
          deal_name: d.properties.dealname,
          stage: d.properties.dealstage,
          amount: d.properties.amount ? parseFloat(d.properties.amount) : null,
          close_date: d.properties.closedate || null,
          pipeline: d.properties.pipeline,
          last_activity_date: d.properties.hs_lastmodifieddate || null,
        })),
        { onConflict: 'account_id,hubspot_id' }
      )
    }

    return NextResponse.json({
      success: true,
      synced: {
        contacts: contacts.length,
        companies: companies.length,
        deals: deals.length,
      }
    })

  } catch (err: any) {
    console.error('Sync error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
