Webinar Landing Page

YAHSHUA-ABBA × CyTech International campaign landing page for the April 7, 2026 live webinar and free security assessment.

**Live URL:** https://webinar-registration-yahshua.vercel.app/

---

## What This Page Does

- Webinar registration form — captures leads and sends a confirmation email via Loops
- Assessment request form — captures leads, delivers the NPC Administrative Fines Guidelines via email, and redirects to CyTech's assessment form
- Proof block — links to WEF, IBM, and Palo Alto Networks research reports
- NPC teaser — highlights the Philippine government's data privacy fine structure to drive assessment requests

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Hosting | Vercel |
| Form backend | Vercel Serverless Function (`api/register.js`) |
| Lead storage | Google Sheets (via Google Sheets API) |
| Email sending | Loops (transactional emails) |
| Auth for Sheets | Google Cloud Service Account |

---

## Project Structure

```
/
├── api/
│   └── register.js         # Serverless function — handles form submissions
├── src/
│   ├── components/
│   │   ├── FormCard.tsx     # Webinar + Assessment form tabs
│   │   └── ...
│   ├── pages/
│   │   └── Index.tsx        # Main landing page
│   └── main.tsx
├── public/
├── package.json
├── vercel.json              # Vercel config — routes api/ as serverless functions
└── vite.config.ts
```

---

## Form Submission Flow

```
Client submits form
        ↓
api/register.js (Vercel serverless function)
        ↓              ↓
Google Sheets      Loops API
(new row added)    (confirmation email sent)
                       ↓
              Webinar → confirmation + Zoom link (sent April 6)
              Assessment → confirmation + NPC circular PDF link
                       ↓
              Assessment only → redirect to CyTech's assessment form
```

---

## Environment Variables

All set in Vercel → Settings → Environment Variables.

| Variable | What it is |
|---|---|
| `VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email from Google Cloud |
| `VITE_GOOGLE_PRIVATE_KEY_B64` | Private key from JSON file — Base64 encoded |
| `VITE_GOOGLE_SHEET_ID` | ID from the Google Sheet URL |
| `VITE_LOOPS_API_KEY` | API key from Loops → Settings → API |
| `VITE_LOOPS_WEBINAR_ID` | Transactional ID of the Webinar Confirmation email in Loops |
| `VITE_LOOPS_ASSESSMENT_ID` | Transactional ID of the Assessment Confirmation email in Loops |

> ⚠️ Never commit these values to GitHub. Always set them in Vercel's dashboard only.

---

## Google Sheets Setup

- Sheet name: `Secure Business Philippines — Leads`
- Tab: `Sheet1`
- Columns: Timestamp · Type · First Name · Last Name · Email · Company · Role · Team Size · Challenge · Source
- Access: Sheet is shared with the Google Cloud Service Account as Editor

---

## Loops Setup

Two transactional emails published in Loops:

**Webinar Confirmation**
- Triggered when `type = "webinar"`
- Sends: date, time, what to expect, Zoom link placeholder

**Assessment Confirmation**
- Triggered when `type = "assessment"`
- Sends: next steps, NPC circular PDF link
- Data variable: `firstName`

---

## Deploying Changes

**Code changes** — commit to GitHub → Vercel redeploys automatically.

**Environment variable changes** — update in Vercel dashboard → go to Deployments → manually redeploy the latest deployment.

---

## Pending Items

- [ ] Replace CyTech assessment form URL in `FormCard.tsx` redirect once received
- [ ] Update Loops assessment confirmation email with CyTech form URL
- [ ] Update landing page domain once custom domain is configured
- [ ] Remove debug `console.log` lines from `api/register.js` before go-live

---

## Contacts

| Role | Name |
|---|---|
| Campaign lead | Karl |
| CEO / Presenter | Pastor Ron Bayron, YAHSHUA-ABBA |
| Partner CEO | Chen Heffer, CyTech International |
