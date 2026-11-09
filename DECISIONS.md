# Decisions

- 2026-11-09 — Adopt a premium dark fintech direction with a warm gold and violet palette, a mascot-first hero, and a procedural Kobo fallback so the demo remains usable even without Blender assets.
  - Reason: the design brief calls for a premium lifestyle brand instead of a generic SaaS bank look, and the environment does not guarantee Bforartists is installed.

- 2026-11-09 — Keep the Vercel deployment path as “push to GitHub, import repo in Vercel using default Next.js settings”; direct deployment credentials are not available in this environment.
  - Reason: platform access is not available from the API session, but the project is already structured as a standard Next.js app.
