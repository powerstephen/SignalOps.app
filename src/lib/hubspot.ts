export const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID!
export const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET!
export const HUBSPOT_REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI!

export const HUBSPOT_SCOPES = [
  'crm.objects.contacts.read',
  'crm.objects.companies.read',
  'crm.objects.deals.read',
  'crm.objects.owners.read',
].join(' ')

export function getHubSpotAuthUrl(accountId: string) {
  const params = new URLSearchParams({
    client_id: HUBSPOT_CLIENT_ID,
    redirect_uri: HUBSPOT_REDIRECT_URI,
    scope: HUBSPOT_SCOPES,
    state: accountId,
  })
  return `https://app.hubspot.com/oauth/authorize?${params.toString()}`
}
