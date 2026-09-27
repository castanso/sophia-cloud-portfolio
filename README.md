# Sophia Castaneda Cloud Portfolio

Static multi-page portfolio prepared for Cloudflare Pages.

## Deploy

- Build output directory: `dist`
- Functions directory: `functions`
- No build command is required.

## Contact form configuration

Add these encrypted environment variables in Cloudflare Pages:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

The destination email remains server-side and is not included in the public website files.
