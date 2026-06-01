# VCM Deployment Plan — vcm.adroadomain.com

## Current State

VCM is integrated into the Adroa Domain repo and accessible at `/vcm/*` routes:
- `/vcm` — Landing page
- `/vcm/login` — Individual user login
- `/vcm/signup` — Individual user signup
- `/vcm/dashboard` — Certification dashboard
- `/vcm/certifications` — Manage certifications
- `/vcm/certifications/new` — Add certification
- `/vcm/training-log` — Training activity log
- `/vcm/opportunities` — Training opportunities
- `/vcm/profile` — User profile

## Subdomain Deployment: vcm.adroadomain.com

### Prerequisites
1. DNS record for `vcm.adroadomain.com`
2. Access to Vercel project settings

### Steps

#### 1. Add DNS Record
Add a CNAME record in your DNS provider:
```
Type:  CNAME
Name:  vcm
Value: cname.vercel-dns.com
TTL:   300
```

#### 2. Add Domain in Vercel
1. Go to your Vercel project → **Settings** → **Domains**
2. Add `vcm.adroadomain.com`
3. Vercel will verify the DNS record

#### 3. Configure Vercel Rewrites
Add to `vercel.json` (create if it doesn't exist):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "vcm.adroadomain.com" }],
      "destination": "/vcm/$1"
    }
  ]
}
```

This maps `vcm.adroadomain.com/*` → `/vcm/*` within the app.

#### 4. Update VCM Internal Links (optional)
Once the subdomain is active, you may want VCM links to use `/` instead of `/vcm/` when accessed via `vcm.adroadomain.com`. This can be done with a URL prefix context if needed, but is optional for Phase 1.

### SSL
Vercel automatically provisions SSL for added domains. No action needed.

## Supabase Configuration

VCM uses the same Supabase project (`dobimlodgszkjmcoyamj`) as the company portal:
- Shared `auth.users` table
- VCM-specific tables: `vcm_user_profiles`, `certification_catalog`, `user_certifications`, `training_activities`, `training_opportunities`
- RLS policies enforce per-user data isolation

No additional Supabase configuration is needed for the subdomain.

## Future: Separate Vercel Projects (Optional)

If the combined bundle becomes too large, VCM could be extracted to its own Vercel project:
1. Create a new Vercel project from the same repo (or a separate VCM repo)
2. Point `vcm.adroadomain.com` to the new project
3. Share the same Supabase project/env vars

This is NOT needed for Phase 1.
