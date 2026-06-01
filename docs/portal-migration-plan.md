# Portal Migration Plan — portal.adroadomain.com

> **DO NOT EXECUTE** — This plan documents what will be required when DNS is ready.
> This migration should only happen after DNS for `portal.adroadomain.com` is reserved and confirmed.

## Goal

Move the company portal from `adroadomain.com/dashboard` to `portal.adroadomain.com`.

## Current State

- Company portal lives at `adroadomain.com/dashboard/*`
- Routes: `/dashboard`, `/dashboard/employees`, `/dashboard/training`, `/dashboard/training-report`, `/dashboard/readiness`
- Auth: `/org/login`, `/org/signup`
- Main landing page: `adroadomain.com/`

## Migration Steps

### 1. Add DNS Record
```
Type:  CNAME
Name:  portal
Value: cname.vercel-dns.com
TTL:   300
```

### 2. Add Domain in Vercel
Add `portal.adroadomain.com` to the Vercel project settings.

### 3. Configure Vercel Rewrites
Update `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "portal.adroadomain.com" }],
      "destination": "/dashboard/$1"
    },
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "vcm.adroadomain.com" }],
      "destination": "/vcm/$1"
    }
  ]
}
```

### 4. Update Internal Links
- Company portal sidebar links: change from `/dashboard/*` to relative paths (or use `portal.adroadomain.com/*`)
- Auth routes: `/org/login` and `/org/signup` should redirect based on context
- Main landing page: update "Dashboard Login" button to link to `portal.adroadomain.com`

### 5. Add Redirects (Optional)
For backward compatibility, redirect old paths:
```json
{
  "redirects": [
    {
      "source": "/dashboard/:path*",
      "has": [{ "type": "host", "value": "adroadomain.com" }],
      "destination": "https://portal.adroadomain.com/:path*",
      "permanent": false
    }
  ]
}
```

### 6. Update Auth Context
The `AuthContext` currently loads org data on login. No changes needed — auth is shared via Supabase.

### 7. Testing Checklist
- [ ] `portal.adroadomain.com` loads the dashboard
- [ ] `portal.adroadomain.com/employees` works
- [ ] `portal.adroadomain.com/training` works
- [ ] Login/signup flows work on the subdomain
- [ ] `adroadomain.com/dashboard` redirects to `portal.adroadomain.com`
- [ ] `vcm.adroadomain.com` still works independently
- [ ] `adroadomain.com` landing page still works

## What NOT to Change

- Do NOT remove `/dashboard/*` routes from the React app — they're still needed for the Vercel rewrite
- Do NOT change the Supabase project or auth configuration
- Do NOT break existing bookmarks — keep redirects active for at least 30 days

## Estimated Effort

- DNS + Vercel config: 15 minutes
- Link updates + testing: 1-2 hours
- Redirect verification: 30 minutes
