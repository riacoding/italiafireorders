# Prepeat Dev Branch – Multi-Vendor Setup Checklist

## ✅ Completed (Main branch additions)

* Square OAuth flow with JWT-based state
* Store Square access/refresh tokens in Merchant model
* Progress UI under `/admin/setup`
* Fetch and store locationIds
* Initial merchant created in `/square/callback`

---

## 🧱 Planned for `prepeat-dev`

### 🔐 Auth & Identity

* Refactor `Merchant` model:

  * `id: ID! @primaryKey`
  * `handle: String! @unique`
  * `userSub: String! @index(name: "byUserSub")`
* Create `postConfirmation` Lambda:

  * Create new `Merchant` on user signup
  * Assign Cognito `sub` to `userSub`
  * Generate placeholder `handle`

### ⚙️ Setup Flow

* Redirect to `/admin/setup` post-auth
* Build secure API routes:

  * `/api/syncCatalog`
  * `/api/setupWebhooks`
  * Use `user.sub` to securely resolve `merchant` server-side
* Create default menu automatically:

  * Name: "My First Menu"
  * Add one random item
* Replace debug UI in `/admin/setup` with real logic

### 🧠 Application Architecture

* Add `AdminProvider`:

  * Loads merchant once after login
  * Injects `squareClient` context
* Use context/DI for Square API access
* Avoid exposing or storing `handle` in localStorage
* Future proof for Stripe, Twilio, etc.

---

## 💤 Personal Note

You’re close to a clean MVP-ready foundation. Taking a break now ensures you don’t compromise long-term clarity for short-term motion. This branch will carry the vision while you recover your edge.

---

> Branch: `prepeat-dev`
> Purpose: Safe zone for breaking changes & proper SaaS scaffolding
> Outcome: Secure, testable, scalable multi-vendor MVP