# JoiHealth HMS

Hospital / clinic management system for **Joi Health Polyclinics** (Lagos and Port Harcourt, Nigeria). It covers patient records, treatment plans, clinical notes, EMR, billing, laboratory, inventory, appointments, referrals, clinical meetings, weekly reports, a patient portal, an AI clinician assistant, and an AI and ML cardiac / PM&R rehabilitation module.

- **Production app:** https://hms.joihealth.ng (also reachable at https://joihealth-hms-frontend.vercel.app)
- **API:** `joihealth-hms-api` on Google Cloud Run, region `europe-west1`
- **Standby API:** `joihealth-hms` on Render (Frankfurt, free plan)
- **Landing page:** separate project, `joihealth-landing` (Next.js on Vercel)

> Status as of 27 October 2026. Everything below marked "in progress" is not yet in production.

---

## 1. Architecture

```
Browser
  |
Vercel (Next.js frontend, joihealth-hms-frontend)
  |   NEXT_PUBLIC_API_URL
Google Cloud Run (FastAPI, joihealth-hms-api)  <-- standby: Render (joihealth-hms)
  |                     |
Supabase (Postgres,     Vertex AI / Gemini (AI assistant, AI summaries,
Auth, RLS)              code suggestions)
  |
Google Cloud Storage: joihealth-hms-backups (nightly dumps), joihealth-hms-lab-results
```

Key rules of the design:

- The frontend talks **only** to the backend, through `API_BASE = process.env.NEXT_PUBLIC_API_URL` in `lib/api.ts`. There are no direct `supabase.from(...)` calls in the frontend.
- The backend acts as the signed-in user: every request builds a Supabase client from the caller's JWT, so **Row Level Security (RLS) is the real permission layer**.
- Money and derived totals (invoice totals, balances, low stock, requisition totals) are always computed on read, never stored.
- Clinical records are mostly **write-once** (a correction is a new entry). Deletes are admin-only and, for rehab records, logged with a reason.

### Repositories and folders

| Part | Folder (Cloud Shell) | Hosting |
|---|---|---|
| Backend (FastAPI) | `/home/joihealthpolyclinics/joihealth-backend-deploy/joihealth-backend` | Cloud Run (main), Render (standby) |
| Frontend (Next.js 14, App Router, TypeScript) | `/home/joihealthpolyclinics/joihealth-hms-frontend` | Vercel |
| Landing page (Next.js) | `~/joihealth-landing-deploy/joihealth-landing` | Vercel |

The backend is a git repo (private GitHub repo `gbohigbaradc/joihealth-hms-backend`, branch `main`), which Render deploys from.

---

## 2. Modules

### Clinical and operations

| Module | What it does |
|---|---|
| **Overview dashboard** | Loads automatically after login. Role-aware KPI cards and charts (clinical, rehab, appointments per day, overdue appointments, per-branch comparison for admins, finance and inventory for admins and records officers). `GET /dashboard/summary` |
| **Patients** | 17-field registration, HMO plan with "Other" fallback, search, PDF export, delete |
| **Treatment plans** | Rich-text plan (TipTap editor), ICD / ICF / CPT / HCPCS codes, draft autosave, PDF |
| **Clinician notes** | Immutable, create-only, linked to treatment plans |
| **EMR** | Five write-once record types (vitals, diagnoses, allergies, immunizations, medical history), vitals range checks, medications, PDF with optional date range, admin-only entry delete |
| **Appointments, Referrals, Doctors** | Scheduling, write-once referrals, doctor directory (delete refused if the doctor has appointments or referrals) |
| **Laboratory** | Lab orders, result files in their own bucket, order sheet PDF |
| **Billing** | Invoices, line items (edit / delete), payments, CPT / HCPCS per line, overpayment block, "Overpaid (credit)" label, invoice PDF, admin-only invoice delete |
| **Inventory and Requisitions** | Stock movements, low-stock flags, report PDF, requisitions with PDF |
| **Clinical meetings** | Minutes with attendees, previous-minutes link, patient cases, action items, autosave, finalise / reopen lock, minutes PDF |
| **Weekly reports** | Patient weekly progress reports and staff weekly reports (one per person per week), PDF, edit stamps |
| **Admin Panel** | Staff roles, deactivate / reactivate, bulk deactivate-all (except admin), reset password, permanent access removal for former staff, patient login list and removal, research datasets, legacy register |

### Patient portal (view-only)

Patients get their own login. Staff switch access on per patient (`patients.portal_enabled` plus `portal_user_id`, admin-only). Patients see only their own rows through `my_patient_id()` read policies on a limited set of tables. Clinician notes, rehab and AI records, and consent records stay staff-only. Staff-only API routes require an active `staff` row; patient routes live under `/portal`.

### AI and ML

| Piece | Notes |
|---|---|
| **AI clinician assistant** (`/chat`) | Vertex AI Gemini with tool calling. Uses the clinician's own JWT for every read. AI drafts are saved only on an explicit click. Gated by `ai_assisted_care` consent, patient field allowlist, phone and email scrubbing, per-clinician rate limit, capped output tokens |
| **Rehab rules engine** (`app/rehab_rules.py`, v1.1.x) | Pure functions: pre-session screening (green / amber / red / incomplete), exercise-response flags, Karvonen target zone with beta-blocker, pacemaker and AF handling, treadmill and cycle METs. Each result carries a plain-language "why" and the readings checked. **All thresholds are defaults pending clinical-lead confirmation** |
| **Rehab records** | Medications, exercise sessions (stores engine version and flags), FITT prescriptions with 30-day ITP review, programme outcomes, care episodes, outcome measures (12 free-to-use measures), data-use consents, rehab PDF, admin delete with a logged reason |
| **AI plain-language summary** | `POST /rehab/ai-summary` re-runs the engine server-side and sends only the engine result to Gemini (no patient identifiers). Text is withheld if it contains a figure the engine did not produce. Advisory only, never changes the engine status |
| **Code suggestion assistant** | `POST /codes/suggest`: suggests ICD / ICF / CPT / HCPCS from a clinical note, requires an evidence quote, checks codes against reference lists, flags "did you mean" corrections. Nothing is added until a clinician clicks. CPT is always marked "verify" |
| **Research datasets** | Admin-only, consent-filtered, de-identified Excel exports (episodes, outcome scores, sessions) with data dictionary. HMAC study codes, 5-year age bands, no free text, every download logged |

**Safety principle:** the rules engine decides; the LLM only explains or suggests. A red or incomplete screen needs a written override reason before a session can go ahead.

---

## 3. Roles and access

| Role | Access |
|---|---|
| `admin` | Everything, including deletes, Admin Panel, research exports |
| `records_officer` | Location-scoped create / edit / delete for appointments, billing, inventory, requisitions, referrals, patients |
| `clinician` | Clinical modules, can read across patients, no destructive deletes |
| Patient (portal) | Read-only view of own records |

Deactivated or removed staff cannot use the HMS. Removed staff keep their name on records they authored (the staff row is kept, the sign-in is banned).

---

## 4. Backend

FastAPI app in `app/`. Routers live in `app/routers/`.

**Auth pattern** (check an existing router, e.g. `inventory.py`, before writing a new one):

```python
from app.auth import AuthedRequest, get_current_clinician

auth: AuthedRequest = Depends(get_current_clinician)
auth.client.table("...")   # RLS applies as the caller
auth.user_id
```

`get_current_clinician` also requires an active staff row. Patient routes use `get_current_patient`.

**RLS helpers** (SECURITY DEFINER, required to avoid Postgres `42P17` recursion; reuse them, never inline subqueries): `is_admin(uid)`, `is_records_officer_for(uid, loc)`, `is_active_records_officer(uid)`, `is_active_staff(uid)`, `my_patient_id()`.

**Conventions**

- Delete endpoints return `{"deleted": true}` (never 204).
- Routers that use `model_dump(mode="json")` pass new schema fields through automatically.
- PDFs use reportlab and Pillow. Logo: `app/assets/logo.jpg`. Shared footer: `app/pdf_footer.py` (`draw_footer`, `FOOTER_BOTTOM_MARGIN`). Currency prints as `NGN 12,345.00` because Helvetica has no naira sign. Section headings use `keepWithNext` so they are not stranded at the foot of a page.
- Rehab and care-record deletes need `?reason=` (3+ characters) and write a snapshot to `rehab_deletion_log` first. Consent records are deliberately not deletable.

**Environment variables**

| Variable | Required | Notes |
|---|---|---|
| `SUPABASE_URL` | yes | |
| `SUPABASE_ANON_KEY` | yes | |
| `GOOGLE_CLOUD_PROJECT` | yes (Cloud Run) | Not set on the Render standby |
| `SUPABASE_SERVICE_ROLE_KEY` | optional | Admin user management. Note the exact name, not `SUPABASE_SERVICE_KEY` |
| `GOOGLE_CLOUD_LOCATION` | optional | `europe-west1` in production |
| `ALLOWED_ORIGINS` | optional | Comma-separated: localhost, the Vercel URL and `https://hms.joihealth.ng`. Set with an alternate delimiter (`^@^`) because the value contains commas |
| `RESEARCH_STUDY_KEY` | for research exports | HMAC secret for study codes. Keep it in a password manager (Secret Manager is the planned home) |
| `AI_CONSENT_ENFORCED` | optional | `true` in production |

Never commit keys or token files (`.gitignore` excludes token files, PDFs and `.bak` files).

---

## 5. Frontend

Next.js 14 (App Router), TypeScript, recharts for charts, TipTap for rich text.

- `lib/api.ts` is the single API layer: `authedFetch` (adds the bearer token, surfaces string and FastAPI 422 array `detail` errors, returns `null` on 204), `authedDownload` for PDFs and Excel files, `authedUpload` for imports.
- New API methods are inserted after an existing method using an exact-match anchor.
- Rich text is stored as HTML and shown through `RichTextViewer.tsx` (sanitised with DOMPurify).
- Medical code pickers: `CodeMultiSelect.tsx` (ICD, ICF, HCPCS, datasets in `public/data/*.json`) and `ManualCodeInput.tsx` (CPT, manual because CPT is AMA-copyrighted).
- Role gating in the UI is a convenience only; the backend and RLS enforce it.

Local build note: `npm run build` always fails while prerendering `/login` locally (no Supabase env vars). That is harmless if "Compiled successfully" appears first:

```bash
cd /home/joihealthpolyclinics/joihealth-hms-frontend && npm run build 2>&1 | grep -E "Compiled successfully|Failed to compile|Type error"
```

---

## 6. Deploying

Cloud Shell keeps files and git state between sessions but **not** installs, environment variables or CLI logins. Start every session with `cd`, and log in again where needed.

**Backend (Cloud Run)**: always list services first and never assume the service name from the folder name.

```bash
cd /home/joihealthpolyclinics/joihealth-backend-deploy/joihealth-backend && gcloud run services list
```

```bash
cd /home/joihealthpolyclinics/joihealth-backend-deploy/joihealth-backend && gcloud run deploy joihealth-hms-api --source . --region europe-west1 --quiet
```

**Frontend (Vercel)**

```bash
cd /home/joihealthpolyclinics/joihealth-hms-frontend && npx vercel login && npx vercel link
```

```bash
cd /home/joihealthpolyclinics/joihealth-hms-frontend && npx vercel --prod
```

Retry once on "fetch failed". The "Deployment Protection is on" note is harmless (it only affects command-line `curl`).

**Standby on Render**: Google stays the main system. To update the standby, commit and push the backend repo (short-lived fine-grained GitHub token, delete it afterwards); Render redeploys automatically.

```bash
cd /home/joihealthpolyclinics/joihealth-backend-deploy/joihealth-backend && git status
```

**Switching the frontend to the standby** (about a minute each way):

```bash
cd /home/joihealthpolyclinics/joihealth-hms-frontend && npx vercel --prod --build-env NEXT_PUBLIC_API_URL=https://joihealth-hms.onrender.com
```

```bash
cd /home/joihealthpolyclinics/joihealth-hms-frontend && npx vercel --prod
```

On the standby the AI features show "temporarily unavailable" by design (no Google credentials). Everything else works against the same Supabase database.

---

## 7. Editing conventions

- Make edits with self-verifying Python scripts run from a Cloud Shell heredoc, asserting `content.count(anchor) == 1` before replacing. Do not paste edits into nano.
- Appended backend endpoints go at the end of the router file; extra imports mid-file need `# noqa: E402`.
- Back up before patching (`~/rehab-backups`, `.bak_*`).
- Work in small steps with a quick check after each. Run each pasted block once and wait for the output.

---

## 8. Backups and data safety

- **Nightly backups:** Cloud Run Job plus Cloud Scheduler (02:00 UTC) writes to the GCS bucket `joihealth-hms-backups` (versioning on, 90-day lifecycle).
- **Lab results:** bucket `joihealth-hms-lab-results` (no deletion lifecycle).
- **Offsite copies:** take periodic downloads of both buckets from Cloud Shell.
- **Cost guardrails:** Cloud Run `maxScale` 3, min instances 0; Gemini output tokens capped; per-clinician chat rate limit; a $1 monthly budget alert exists (alert only, not a spend cap).
- **Privacy:** NDPA applies. The LLM calls send de-identified engine results or scrubbed text only; AI features require the patient's `ai_assisted_care` consent; research exports include only patients with a current `model_development` consent.

---

## 9. Testing

Use the dedicated "Test Patient" record and the three test accounts (admin, records officer, plain clinician) for every production check. Test entries carry notes starting with `TEST ENTRY`. Browser-check each change as a plain clinician and as an admin. Credentials are kept in a password manager, not in this repository.

---

## 10. Known open items

- Revoke any leaked GitHub and Vercel tokens; move `RESEARCH_STUDY_KEY` to Secret Manager.
- Delete the orphaned duplicate `joihealth-backend` Cloud Run service (us-central1, already locked).
- Upgrade Next.js (14.2.15 has a published vulnerability; the fix is a major-version upgrade).
- Clinical lead to confirm rehab thresholds and privacy steps before real patients are entered.
- Full ICD-10 / ICF code sets still to source (ICD-10 edition not yet chosen). The full CMS HCPCS set (about 7,400 active codes) is built and **in progress**, not yet deployed.
- Planned next LLM pieces: billing validator (rules first, LLM only explains flags), then SOAP / session note drafting.
- Rehab screens not yet in the UI: consent already exists; still to confirm every create form (medications, prescription, outcome, episode) is verified end to end by clinicians.
- Billing account hardening on Google Cloud: second billing admin and a backup payment method.
- Doctor edits should be admin-only; old singular code columns (`icd_code`, `icf_code`, `hcpcs_code`) can be dropped once the new ones are confirmed.
- Some Cloud Shell and browser oddities seen with extensions (duplicate "Today session" cards, a parked exercise AI button) are unresolved; test in a private window first.

---

## 11. Maintainer

Built and maintained by **Gboh-Igbara D. Charles** (Information Officer, Data & Analytics, JoiHealth Polyclinics).

Project documents: *Engine Room* (technical blueprint) and *Business Suit* (business proposal).
