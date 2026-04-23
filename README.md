# SWE Interview Difficulty Tier List

A filterable, searchable tier list of software engineering interview difficulty by company — covering Bay Area, SoCal, remote, and global companies.

**1,000+ companies · 6 difficulty tiers · 2026**

---

## What is this?

Knowing how hard a company's interview is before you start grinding can save you weeks of prep. This app aggregates community knowledge from Glassdoor, Blind, interviewing.io, HelloInterview, and Teamblind into a single filterable reference.

Each company is rated on a 6-tier scale:

| Tier | Emoji | What to expect |
|------|-------|----------------|
| Easy | 🟢 | Take-homes, pair programming, no timed DSA |
| Medium-Easy | 🔵 | 1–2 LC easy/medium rounds, practical emphasis |
| Medium | 🟡 | Standard LC medium/hard loop + system design |
| Medium-Hard | 🟠 | LC medium/hard expected, multi-round loops |
| Hard | 🔴 | LC hard is the norm, deep system design |
| Brutal | 💀 | Elite-level, multi-hour, theoretical CS mastery |

> Calibrated for **mid-level SWE (2–5 YOE)**. Senior-level bars are generally one tier higher.

---

## Features

- **Search** by company name
- **Filter by region** — Bay Area, SoCal, Both, Remote, or Global
- **Click any card** for interview style details and sources
- **Save to my list** — bookmark companies locally
- **Dark mode** toggle
- Smooth GSAP animations throughout

---

## Data Sources

- Community reports from Glassdoor, Blind, Teamblind, interviewing.io, and HelloInterview
- [poteto/hiring-without-whiteboards](https://github.com/poteto/hiring-without-whiteboards) — practical/no-whiteboard companies

---

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP](https://gsap.com/) — animations

---

## Running Locally

Requires Node 18+.

```bash
git clone https://github.com/YOUR_USERNAME/sweTierList.git
cd sweTierList
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Contributing

Tier placements are subjective and change over time. If a company's bar has shifted or you have firsthand experience, open an issue or PR against `data/companies.json`.

Each entry follows this shape:

```json
{
  "name": "Acme Corp",
  "tier": "medium",
  "region": "ba",
  "remote": true,
  "interview_style": "2 LC mediums + system design",
  "detail": "Two technical rounds followed by a system design...",
  "sources": ["Blind", "Glassdoor"]
}
```

`region` is one of `"ba"` · `"sc"` · `"both"` · `"global"`

---

*Last updated April 2026*
