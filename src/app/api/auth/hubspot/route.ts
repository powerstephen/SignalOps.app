import { NextResponse } from 'next/server'
import { getHubSpotAuthUrl } from '@/lib/hubspot'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const accountId = searchParams.get('account_id') || 'demo-account'
  const authUrl = getHubSpotAuthUrl(accountId)
  return NextResponse.redirect(authUrl)
}
