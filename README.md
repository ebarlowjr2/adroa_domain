# Adroa Domain – Landing Page

Vite + React + Tailwind landing page scaffold. Deploys on Vercel. Auth0 hooks left for later.

## Quick start
```bash
npm i
npm run dev
```

## Add Auth0 later
- `npm i @auth0/auth0-react`
- Wrap `<App />` with `<Auth0Provider>` in `src/main.tsx`
- Wire the header buttons to `loginWithRedirect()` and your access request route/form.
```
