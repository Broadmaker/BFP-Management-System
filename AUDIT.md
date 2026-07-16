# System Audit — BFP Station Management System

## 🔴 Critical

### 1. Reports API returns wrong data shape (runtime crash)
**Files:** `apps/api/src/routes/reports.ts:31-50` vs frontend report pages

The API endpoints `/reports/incidents`, `/reports/inspections`, `/reports/personnel` return **aggregated/breakdown data** (e.g., `{ typeBreakdown: [...], severityBreakdown: [...] }`), but the frontend treats them as **arrays of raw records** calling `.filter()` on fields like `.severity`, `.status`. This will throw a runtime error — `.filter` doesn't exist on objects.

**Fix:** Change the API to return raw records, or add dedicated list endpoints (`GET /api/incidents`, `GET /api/inspections`, `GET /api/personnel`) to the web lib and use those instead of `ReportsApi`.

### 2. No authentication or authorization
**Files:** All routes in `apps/api/src/routes/`

Every endpoint — including DELETE, PATCH, POST — is fully public. Anyone who knows the URL can read/write all data. The login page just checks env vars client-side; there's no token, session, or middleware.

**Fix:** Add JWT-based auth middleware. Issue tokens on login, validate on every protected route.

### 3. Login is fake — hardcoded env credentials
**File:** `apps/web/src/auth/Login.tsx:15-18`

```ts
if (email === import.meta.env.VITE_ADMIN_EMAIL && password === import.meta.env.VITE_ADMIN_PASSWORD) {
  navigate('/admin/dashboard');
}
```

Credentials are compile-time env vars exposed to the client (visible in browser devtools). No server-side verification.

**Fix:** Remove client-side env credentials. Post email+password to `/api/auth/login`, verify against DB with bcrypt, return a JWT.

---

## 🟠 High

### 4. Passwords stored in plaintext
**File:** `apps/api/src/routes/users.ts:34`

```ts
passwordHash: body.password || 'changeme123',
```

No hashing (bcrypt/argon2) anywhere.

**Fix:** Hash passwords with bcryptjs on create and login.

### 5. No input validation on any endpoint
**Files:** All POST/PATCH handlers in `apps/api/src/routes/`

Every handler spreads `await c.req.json()` directly into the DB. A malicious request could set arbitrary fields including `id`, `createdAt`, `passwordHash`.

**Fix:** Use zod to define and validate request schemas per endpoint.

### 6. CORS is wide open
**File:** `apps/api/src/index.ts:19`

```ts
app.use('/*', cors());
```

Accepts any origin, any method, any header.

**Fix:** Restrict to the actual frontend domain(s).

---

## 🟡 Medium

### 7. Audit total count is wrong
**File:** `apps/api/src/routes/audit.ts:31`

```ts
return c.json({ items, total: items.length });
```

`total` should be a separate `COUNT(*)` query, not the length of the limited page.

**Fix:** Run a separate count query before applying LIMIT.

### 8. No pagination on list endpoints
Most `GET /` handlers return all records without `LIMIT`/`OFFSET`. Will become slow with real-world volumes.

**Fix:** Add `?limit=&offset=` query params.

### 9. No error boundaries on frontend
If an API call throws, most components just show nothing or crash the entire admin panel.

**Fix:** Add a React error boundary at the router level.

### 10. Inconsistent delete confirmation
Some components use `confirm()`, others have no confirmation at all.

**Fix:** Standardize on a modal-based confirmation component.

### 11. Reports `/personnel` endpoint too thin
**File:** `apps/api/src/routes/reports.ts:45-50`

Returns only `{ total, active }`. `PersonnelReports.tsx` also needs attendance, leave, and rank data.

**Fix:** Return richer aggregate data or have the frontend call raw list APIs.

---

## 🟢 Low

### 12. `.js` backup files mixed with `.tsx` sources
Old `.js` files remain in source directories alongside `.tsx` files. Not in `.gitignore`.

**Fix:** Delete the `.js` files or add to `.gitignore`.

### 13. Unused `R2` binding in every route
Every route declares `R2: R2Bucket` but it's never used.

**Fix:** Remove R2 from routes that don't use it.

### 14. Program participants have `email` but form doesn't use it
**Fix:** Add email field to SeminarRegistrations or drop the column.

### 15. `/auth/register` and `/auth/forgot` link to nowhere
Login page has dead links.

**Fix:** Implement or remove those routes.
