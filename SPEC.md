Here’s your draft rewritten as a properly formatted **`SPEC.md`** in Markdown style:

````markdown
# SPEC.md

## Data Model (Firestore Collections)

### `users` (per Firebase Auth `uid`)

**Example:**
```json
{
  "id": "authUid",
  "role": "vendor" | "customer" | "admin",
  "email": "x@y.com",
  "displayName": "Ramesh",
  "societies": ["soc_kanchan", "soc_symphony"],
  "vendorId": "vendor_ab12"
}
````

---

### `vendors`

**Example:**

```json
{
  "id": "vendor_ab12",
  "name": "Ramesh Veggies",
  "phone": "+91XXXXXXXXXX",
  "active": true,
  "societies": ["soc_kanchan", "soc_symphony"],
  "lastOnlineAt": 1699999999999,
  "vehicleType": "handcart"
}
```

---

### `societies`

**Example:**

```json
{
  "id": "soc_kanchan",
  "name": "Kanchan Ganga Apts",
  "area": "Kothrud"
}
```

---

### `routes` (planned runs; Phase 1 seeds for later ETA)

**Example:**

```json
{
  "id": "route_2025-08-22_vendor_ab12",
  "vendorId": "vendor_ab12",
  "societyIds": ["soc_kanchan", "soc_symphony"],
  "status": "planned"
}
```

---

### `inventories` (current defaults for vendor; embedded items)

**Example:**

```json
{
  "id": "inv_vendor_ab12",
  "vendorId": "vendor_ab12",
  "updatedAt": 1699999999999,
  "items": [
    { "sku": "tomato", "name": "Tomato", "price": 30, "unit": "kg", "avail": true },
    { "sku": "onion", "name": "Onion", "price": 25, "unit": "kg", "avail": true }
  ]
}
```

---

### `publicShare` (Phase 4 later; placeholder for schema)

**Example:**

```json
{
  "id": "share_ABC123",
  "type": "groupWatch",
  "routeId": "route_2025-08-22_vendor_ab12"
}
```

---

## Routes/Pages and Components (Phase 1)

### Pages

* `/auth` – phone/email sign-in
* `/onboarding` – select role, society, vendor onboarding
* `/home` – role-aware switch: vendor dashboard or customer browse
* `/vendor` – profile, societies list, inventory editor (basic)
* `/customer` – society select, vendor list, read-only inventory view
* `/settings` – privacy, notifications consent toggles
* `/offline` – offline status info

### Components

* `AuthPhoneForm`, `AuthEmailForm`
* `RoleGate`, `RequireAuth`
* `SocietySelect`
* `VendorCard`, `VendorList`
* `InventoryEditor` (vendor), `InventoryView` (customer)
* `PrivacyToggles`
* `OfflineBanner`
* `Loader`, `ErrorState`
* `PWAInstallPrompt`

---

## Service Worker Caching Plan

**Strategy:** Workbox or custom SW with:

* **App shell (HTML/CSS/JS):** precache at build.
* **Firestore SDK & Firebase Auth scripts:** cache-first with version busting.
* **API calls:** rely on Firestore SDK offline persistence; additionally cache vendor list and inventories as JSON snapshots in IndexedDB.
* **Images/icons:** stale-while-revalidate.
* **Offline queue:** Firestore handles writes; custom queue for non-Firestore endpoints (none in Phase 1).

### IndexedDB Stores

* `idb_app`:

  ```json
  {
    "key": "societies | vendors_snapshot | inventories_snapshot",
    "ts": 1699999999999
  }
  ```

### Background Sync

* `registerPeriodicSync` placeholder for future SMS/cron triggers (not used in Phase 1).

---

## Env Variables List and Sample `.env`

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_APP_ENV=development|staging|production
VITE_DEFAULT_CITY=Pune
```

**Example `.env.local`:**

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=1:xxxx:web:xxxx
VITE_FIREBASE_MEASUREMENT_ID=G-XXXX
```

---

## Firestore Security Rules Outline

* **Roles** derived from `users/{uid}.role`

### Access

* **users:** read/write self; admins read all; no public access.
* **vendors:** vendor read/write own; customers read vendors in their society; public deny.
* **societies:** public read; admin write only.
* **inventories:** vendor read/write own; customers read inventories for their selected society; public deny.
* **routes:** customers read if `route.societyIds` intersects `user.societies`; vendor read/write own; public deny.
* **publicShare:** read if valid & not expired; write admin only.

### Guardrails

* Validate field types, enums, array sizes.
* Prevent hot-doc abuse (inventories per vendor, not per-day heavy aggregation).

### Composite Indexes

* **vendors:** `array-contains societies + active true`
* **inventories:** `vendorId equality + updatedAt desc`
* **routes:** `vendorId equality + status`

---

## Test Plan

**Emulator tests** to verify role-based access, field validators, and denial by default.

**Cases:**

* Customer **cannot write** vendors, inventories, routes.
* Vendor **cannot modify** other vendor docs.
* Cross-society reads denied.
* `publicShare` readable only with valid `id` and unexpired.
