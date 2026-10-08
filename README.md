# Billy & Brenna — Wedding Site

The wedding website for Billy & Brenna (September 12th, 2027 · Waldenwoods), moved off Webflow's
custom-code fields into a standalone Next.js (React) app that runs on Replit or any Node host.

## Run it locally

Requires Node 20.9+.

```bash
npm install
npm run dev        # http://localhost:4317
```

Other scripts:

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run build`     | Production build (pages are prerendered)       |
| `npm run start`     | Serve the production build on `$PORT` or 4317  |
| `npm run lint`      | ESLint                                         |
| `npm run typecheck` | TypeScript check                               |

## Run it on Replit

1. In Replit, choose **Import from GitHub** (or upload this folder).
2. Press **Run**. The `.replit` file starts the dev server on port 5000.
3. To publish, use **Deploy → Autoscale**. The build and run commands are already configured.

Replit settings (Tools → Database / Secrets):

| Setting          | What it's for                                                            |
| ---------------- | ------------------------------------------------------------------------ |
| PostgreSQL       | Stores the guest list and RSVPs. Replit sets `DATABASE_URL` for you.     |
| `ADMIN_PASSWORD` | Password for `/rsvp/responses`, where you load guests and read replies.  |
| `SITE_URL`       | Your public address, e.g. `https://billyandbrenna.com`, for link previews |

### Keeping Replit in sync with GitHub

GitHub is the source of truth. Don't edit or commit code inside Replit; to pick up new changes,
run this in the Replit Shell:

```bash
git pull --ff-only && npm install
```

If Replit ever has commits of its own and the pull refuses, make it an exact copy of GitHub again
(this discards anything changed inside Replit):

```bash
git rebase --abort; git merge --abort
git fetch origin && git reset --hard origin/main && npm install
```

## Where things live

```
src/
  app/
    layout.tsx         Shared shell: fonts, background, nav, back-to-top
    page.tsx           Home page
    [slug]/page.tsx    "Coming soon" stand-in for pages not migrated yet
    globals.css        All site styles
  components/          Header, splash intro, countdown, photo stack, hotel tile
  content/             Editable text: date/venue, nav links, hotels, FAQs
public/images/         Photos and logo (downloaded from Webflow, resized, GPS data stripped)
```

To change the date, venue, hotels, or FAQ answers, edit the files in `src/content/` — the pages
read from there.

Adding a real page: create a folder such as `src/app/details/page.tsx`. It automatically takes
over from the "coming soon" stand-in for that URL.
