import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { HUBSPOT_CLIENT_ID, HUBSPOT_CLIENT_SECRET, HUBSPOT_REDIRECT_URI } from '@/lib/hubspot'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const accountId = searchParams.get('state')

  if (!code || !accountId) {
    return NextResponse.redirect('/?error=missing_params')
  }

  try {
    const tokenRes = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri: HUBSPOT_REDIRECT_URI,
        code,
      }),
    })

    const tokens = await tokenRes.json()

    if (!tokenRes.ok) {
      console.error('HubSpot token error:', tokens)
      return NextResponse.redirect('/?error=token_exchange_failed')
    }

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

    await supabaseAdmin.from('hubspot_connections').upsert({
      account_id: accountId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
    })

    return NextResponse.redirect('/?connected=true')
  } catch (err) {
    console.error('OAuth callback error:', err)
    return NextResponse.redirect('/?error=server_error')
  }
}
