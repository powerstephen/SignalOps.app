import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const accountId = searchParams.get('account_id') || 'demo-account'

  const { data } = await supabaseAdmin
    .from('hubspot_connections')
    .select('id')
    .eq('account_id', accountId)
    .single()

  if (!data) return NextResponse.json({ connected: false })

  const [{ count: contacts }, { count: companies }, { count: deals }] = await Promise.all([
    supabaseAdmin.from('hs_contacts').select('*', { count: 'exact', head: true }).eq('account_id', accountId),
    supabaseAdmin.from('hs_companies').select('*', { count: 'exact', head: true }).eq('account_id', accountId),
    supabaseAdmin.from('hs_deals').select('*', { count: 'exact', head: true }).eq('account_id', accountId),
  ])

  return NextResponse.json({
    connected: true,
    counts: { contacts: contacts||0, companies: companies||0, deals: deals||0 }
  })
}
