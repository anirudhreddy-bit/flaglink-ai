# FlagLink AI

> Scan any Terms & Conditions for red flags, shady clauses, and hidden traps — in plain English. Powered by Claude AI.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8) ![Claude AI](https://img.shields.io/badge/Claude-Sonnet_4-orange) ![NextAuth](https://img.shields.io/badge/NextAuth-4-purple)

## Features

- 🔍 **URL or Text Input** — Paste a URL to any Terms & Conditions page, or paste the raw text directly
- 🚩 **Red Flag Detection** — AI identifies auto-renewal traps, forced arbitration, data selling, IP grabs, and more
- 📊 **Risk Score** — 0-100 "Sign or Run" score with visual meter
- 🎨 **Color-Coded Results** — Green (safe), Yellow (caution), Red (danger) risk badges
- 💡 **Plain English Advice** — Actionable recommendations on what to do
- 👤 **User Accounts** — Sign up with email or GitHub to save scan history
- 📋 **Scan History** — View all your previous scans organized by website
- ⚡ **Fast & Modern** — Built with Next.js 15 App Router and Turbopack
- 🔒 **Secure** — Password hashing with bcryptjs, JWT sessions

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)
- (Optional) GitHub OAuth credentials for "Sign in with GitHub"

### Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd flaglink-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your credentials:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   NEXTAUTH_SECRET=generate-a-random-secret-here
   NEXTAUTH_URL=http://localhost:3000
   GITHUB_ID=your-github-app-id (optional)
   GITHUB_SECRET=your-github-app-secret (optional)
   ```

   Generate a NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── page.tsx                          # Home page with input field
├── results/page.tsx                  # Results display page
├── account/page.tsx                  # User account & scan history
├── auth/
│   ├── signin/page.tsx              # Sign in page
│   └── signup/page.tsx              # Sign up page
├── api/
│   ├── scan/route.ts                # API route for Claude analysis
│   ├── auth/signup/route.ts         # User registration endpoint
│   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   └── account/history/route.ts     # Fetch user scan history
├── layout.tsx                        # Root layout with auth provider
└── globals.css                       # Global styles
components/
├── AuthProvider.tsx                  # NextAuth session provider
├── RiskBadge.tsx                    # Color-coded risk level badge
├── RedFlagCard.tsx                  # Individual red flag card
└── ScoreMeter.tsx                   # Visual score meter (0-100)
lib/
├── types.ts                         # Shared TypeScript types
└── db/
    ├── index.ts                     # Database initialization
    └── schema.ts                    # Drizzle ORM schema
auth.ts                              # NextAuth configuration
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic Claude API key | ✅ |
| `NEXTAUTH_SECRET` | Random secret for session encryption | ✅ |
| `NEXTAUTH_URL` | Your app's URL (localhost:3000 in dev) | ✅ |
| `GITHUB_ID` | GitHub OAuth app ID | ❌ |
| `GITHUB_SECRET` | GitHub OAuth app secret | ❌ |

## Authentication

FlagLink AI supports three authentication methods:

1. **Email/Password** — Create a local account with password
2. **GitHub OAuth** — Sign in with your GitHub account
3. **Anonymous** — Use without an account (scans not saved)

To enable GitHub OAuth:
1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth app
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
4. Add `GITHUB_ID` and `GITHUB_SECRET` to `.env.local`

## Database

FlagLink AI uses SQLite with Drizzle ORM for local development. The database is automatically created in `flaglink.db` when you run the app.

**Tables:**
- `user` — User accounts
- `scan` — Saved scan results with website name, risk level, score, and red flags
- `session` — NextAuth session tokens
- `account` — OAuth account links (for GitHub sign-in)

## Deploying to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel settings:
   - `ANTHROPIC_API_KEY`
   - `NEXTAUTH_SECRET` (generate new one)
   - `NEXTAUTH_URL` (your Vercel domain)
   - `GITHUB_ID` & `GITHUB_SECRET` (if using GitHub OAuth)
4. Deploy!

**Note:** SQLite on Vercel requires the Vercel Postgres driver or you can use a managed database like PostgreSQL. Update `.env` as needed.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** Anthropic Claude (claude-sonnet-4-20250514)
- **Authentication:** NextAuth v4
- **Database:** SQLite + Drizzle ORM
- **Password Hashing:** bcryptjs
- **Date Formatting:** date-fns
- **Deployment:** Vercel-ready

## Disclaimer

⚖️ **Not legal advice.** FlagLink AI is for informational purposes only. Always consult a qualified attorney for legal matters.

## License

MIT
