# 🍕 ItaliaFire – Custom Pizza Ordering App

A full-stack mobile-friendly web ordering system built with **Next.js 14**, **AWS Amplify Gen 2**, and **Square Payments API**. Designed for food trucks and pop-up kitchens needing custom menus, modifiers, and smooth checkout.

---

## 🔧 Tech Stack

- **Frontend**: Next.js App Router, Tailwind CSS, Amplify UI
- **Backend**: AWS Amplify Gen 2 (`@aws-amplify/backend`), Lambda (API routes)
- **Data**: Amplify Data models (Menu, MenuItem, CatalogItem), S3 for images
- **Payments**: Square Payment Links API (with tipping, taxes, and item metadata)
- **Hosting**: Vercel (frontend), Amplify-managed backend

---

## ✅ Key Features

- 🧺 **Smart Cart System**
  - Custom modifiers (toppings) with pricing
  - Deduping logic (same item + toppings = increase quantity)
  - Persistent cart via `localStorage`

- 🧾 **Square Integration**
  - Item sync from Square catalog
  - Checkout via hosted Square Payment Link
  - Optional tipping, non-taxable tips via `allowTipping`
  - Line-item taxes via `LINE_ITEM` scoped tax settings

- 📱 **Mobile-Optimized UI**
  - Fast menu browsing with custom names/images
  - Cart review, tipping, and checkout in under 2 taps
  - Back-link routing preserved via localStorage

- 📷 **Image Uploads**
  - Admin S3-backed image uploader for menu customization
  - Automatic naming with catalogItemId

---

## 🚧 Status

> This app was originally developed as a custom client project. The client opted to use Square's hosted website product. The codebase remains fully functional and is ready to adapt as a white-label solution for:
- Food trucks
- Ghost kitchens
- Custom catering menus
- Pop-up events with mobile ordering

---

## 💡 Reuse Ideas

- Add multi-location support (`/menu/[loc]`)
- Support delivery zones or pickup scheduling
- Extend catalog sync to pull modifiers from Square
- Add Stripe as an alternative checkout provider
- Connect to marketing or SMS for promo campaigns