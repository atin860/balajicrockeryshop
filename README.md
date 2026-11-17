# Shri Balaji Dona Pattal Store — Website

**मै० श्री बालाजी दोना पत्तल स्टोर** · Opposite TVS Agency, Gola Road, Bilsanda, Pilibhit (U.P.)
Proprietor: **Sunil Sharma** · 📞 +91 84450 09955 · +91 93689 05883

A fast, bilingual (हिंदी / English) catalogue website for a wholesale & retail disposable-crockery shop:
dona, pattal, bhojan thali, disposable glasses, bowls, spoons, aluminium foil and party combo packs.

- **No prices anywhere** — customers browse products and designs, then **enquire on WhatsApp** or **call**; the shop replies with the best rate for their quantity.
- **Every WhatsApp button opens an enquiry form** (name, mobile, message) that opens WhatsApp with a ready message.
- **Tap-to-call** buttons everywhere (floating button, navbar, product pages).
- **Ordering (cart / checkout) is built but ON HOLD** — see [Turning ordering back on](#turning-ordering-back-on).

Built with React 18 + Vite, Tailwind CSS, Framer Motion, React Router and Lucide icons. No backend, no payment gateway.

---

## 1. Quick start

Requires **Node.js 18+** (20 recommended).

```bash
npm install        # install dependencies (first time only)
npm run dev        # start the site at http://localhost:5173
npm run build      # production build into the dist/ folder
npm run preview    # preview the production build at http://localhost:4173
npm test           # run the automated tests (71 tests)
npm run images     # create any missing placeholder images (never overwrites real photos)
```

---

## 2. Where to change things

| What | File |
|---|---|
| Shop name, owner, phone numbers, **WhatsApp number**, address, hours, delivery areas, About-page numbers, website address | `src/config/shop.js` |
| Products (names, sizes, packing, designs, descriptions, badges) | `src/data/products.js` |
| Design options (border colours, cup prints…) | `src/data/designs.js` |
| Categories | `src/data/categories.js` |
| FAQ questions & answers | `src/data/faqs.js` |
| Customer reviews (Home page) | `src/data/testimonials.js` — **these are samples, replace with real reviews** |
| Gallery photos | `src/data/gallery.js` |
| Party pack calculator (which products, set styles) | `src/data/partyPacks.js` |
| All website text in Hindi & English | `src/i18n/hi.js`, `src/i18n/en.js` (same keys in both) |
| Colours & fonts | `tailwind.config.js`, `src/main.jsx` |

### Change the WhatsApp number
In `src/config/shop.js` set `whatsappNumber` — country code + number, **no `+`, no spaces**, e.g. `'918445009955'`.

### Change phone numbers
In `src/config/shop.js` → `phones`. `tel` is used for the call link (`+91…`, no spaces), `display` is what people see. The **first** number is used by the floating call button and the navbar call icon.

### Prices
The website intentionally shows **no prices** — rates are shared on WhatsApp/phone. There are no price fields in the data (a test checks this).

### Add or edit a product
Open `src/data/products.js` and copy an existing `product({ ... })` block. Give it a unique `slug` (lowercase, dashes),
both names, a `category` id, size, packing (`...PACKET(50)`), optional `designs`, and descriptions in both languages.
Then run `npm run images` to create placeholder photos for it, or add real photos (below).

### About-page numbers & owner photo
- `shop.stats` in `src/config/shop.js` — **sample figures**, please replace with real ones.
- Owner photo: replace **`public/images/about/owner.webp`** with a real portrait of Sunil Sharma (about 800 × 1000 px).

### Website address (after you deploy)
Set `siteUrl` in `src/config/shop.js` (e.g. `https://www.shribalajidonapattal.in`). It is used for Google
(canonical links, sitemap.xml, robots.txt, business info) and social-media previews. Also fill `postalAddress.postalCode`.

---

## 3. Turning ordering back on

The full ordering system — cart (saved in the browser), cart drawer, checkout with validation, WhatsApp order
message with order ID (`SBD-YYYYMMDD-XXXX`), order-success page, party-pack "add to cart" — is **already built and
tested** but switched off. In `src/config/shop.js`:

```js
features: {
  ordering: true, // was false
},
```

Search the code for `ORDERING ON HOLD` to see every place this switch controls.

---

## 4. Images

All images live in `public/images/` as **WebP**. The project ships with **clean illustrated placeholders** so the site
looks finished; replace them with real photos of your shop and products **using the same file name** and they appear
automatically. (`npm run images` only creates *missing* files — it never overwrites your photos.)

**Photo tips:** product photos square (800 × 800), on a white or cream background, good light, same style for all.
Convert JPG/PNG to WebP with any free online converter (or keep the `.webp` name — most tools can export WebP).

### Hero, categories, occasions, about, banners, logo

| File | Size | What it should show (also used as alt text) | Search keywords for free stock photos |
|---|---|---|---|
| `hero/hero-1.webp` | 1600×900 | Elegant table setting with silver-coated disposable plates, dona and paper cups | silver paper plates table setting, disposable dinner set |
| `hero/hero-2.webp` | 1600×900 | Stacks of green leaf pattal and dona, eco-friendly look | leaf plates, sal leaf plate stack, eco friendly plates |
| `hero/hero-3.webp` | 1600×900 | Wedding buffet setup with compartment thali and disposable glasses | buffet table setting, wedding buffet disposable |
| `categories/dona.webp` | 600×600 | Stack of silver and leaf dona bowls | silver dona, leaf bowl, disposable bowl |
| `categories/pattal.webp` | 600×600 | Stack of round silver-coated paper plates and leaf plates | paper plates white background, leaf plates |
| `categories/thali.webp` | 600×600 | Grey/white 5-compartment disposable meal thali | compartment plate, divided meal tray |
| `categories/glasses.webp` | 600×600 | Colourful printed paper cups and clear plastic glasses | disposable cups, paper cups, plastic glasses |
| `categories/foil.webp` | 600×600 | Aluminium foil roll and foil containers with lids | aluminium foil container, foil roll |
| `categories/bowls.webp` | 600×600 | White paper bowls and plastic katori | paper bowls white, disposable bowls |
| `categories/spoons.webp` | 600×600 | Plastic and wooden disposable spoons | wooden spoons disposable, plastic spoons |
| `categories/combo.webp` | 600×600 | Complete party pack: plate, dona, glass, spoon arranged neatly | party tableware set, disposable dinner set |
| `occasions/wedding.webp` | 800×600 | Decorated Indian wedding buffet | indian wedding buffet, shaadi decoration |
| `occasions/namkaran.webp` | 800×600 | Naming ceremony table with sweets | naming ceremony india, namkaran |
| `occasions/bhandara.webp` | 800×600 | Bhandara / langar rows with leaf pattal | langar, bhandara, community meal india |
| `occasions/birthday.webp` | 800×600 | Birthday party with printed plates and cups | birthday party table, paper plates party |
| `occasions/puja.webp` | 800×600 | Puja thali with diya and flowers | puja thali, diya, pooja |
| `occasions/catering.webp` | 800×600 | Catering buffet with stacks of plates and glasses | catering buffet setup |
| `gallery/gallery-1…12.webp` | mixed | Products, events and shop photos (titles in `src/data/gallery.js`) | your own shop & event photos |
| `about/owner.webp` | 800×1000 | **Portrait of Sunil Sharma** at the shop | (use a real photo) |
| `about/shop-front.webp` | 1200×800 | Shop front on Gola Road, Bilsanda | (use a real photo) |
| `about/team.webp` | 1200×800 | Shop counter with stacks of plates and dona | (use a real photo) |
| `about/stock.webp` | 1200×800 | Shelves stocked with pattal, dona, cups and foil rolls | (use a real photo) |
| `banners/page-header.webp` | 1600×500 | Soft pattern of plates (top banner of inner pages) | paper plates flat lay, tableware flat lay |
| `banners/bulk-order.webp` | 1600×500 | Bulk stock of plates and dona | stacks of plates, wholesale tableware |
| `logo/logo.svg` | vector | Shop logo | — |
| `logo/favicon.png`, `apple-touch-icon.png`, `icon-512.png` | 64 / 180 / 512 px | App & browser icons (from the logo) | — |
| `logo/og-image.jpg` | 1200×630 | Picture shown when the site is shared on WhatsApp/Facebook | — |

Free stock photo sites: [Unsplash](https://unsplash.com), [Pexels](https://www.pexels.com) — but **real photos of
your own shop and stock work best** for customers.

### Product photos (`public/images/products/`)

Each product has two photos: `<slug>-1.webp` (main) and `<slug>-2.webp` (shown on hover). 800 × 800, white/cream background.

| File | Product | Search keywords |
|---|---|---|
| `products/silver-dona-small-1.webp`, `-2.webp` | Silver Dona Small / सिल्वर दोना छोटा (4 inch, Packet of 100) | silver dona bowl, leaf dona, paper dona, disposable bowl white background |
| `products/silver-dona-medium-1.webp`, `-2.webp` | Silver Dona Medium / सिल्वर दोना मध्यम (5 inch, Packet of 100) | silver dona bowl, leaf dona, paper dona, disposable bowl white background |
| `products/silver-dona-large-1.webp`, `-2.webp` | Silver Dona Large / सिल्वर दोना बड़ा (6 inch, Packet of 50) | silver dona bowl, leaf dona, paper dona, disposable bowl white background |
| `products/sal-leaf-dona-1.webp`, `-2.webp` | Sal Leaf Dona / साल पत्ते का दोना (5 inch, Packet of 100) | silver dona bowl, leaf dona, paper dona, disposable bowl white background |
| `products/printed-paper-dona-1.webp`, `-2.webp` | Printed Paper Dona / प्रिंटेड पेपर दोना (4 inch, Packet of 100) | silver dona bowl, leaf dona, paper dona, disposable bowl white background |
| `products/silver-pattal-10-inch-1.webp`, `-2.webp` | Silver Pattal 10 inch / सिल्वर पत्तल 10 इंच (10 inch, Packet of 50) | silver coated paper plate, sal leaf plate, areca leaf plate, paper plates white background |
| `products/silver-pattal-12-inch-1.webp`, `-2.webp` | Silver Pattal 12 inch / सिल्वर पत्तल 12 इंच (12 inch, Packet of 50) | silver coated paper plate, sal leaf plate, areca leaf plate, paper plates white background |
| `products/sal-leaf-pattal-1.webp`, `-2.webp` | Sal Leaf Pattal / साल पत्ते की पत्तल (12 inch, Packet of 50) | silver coated paper plate, sal leaf plate, areca leaf plate, paper plates white background |
| `products/paper-plate-9-inch-1.webp`, `-2.webp` | Paper Plate 9 inch / पेपर प्लेट 9 इंच (9 inch, Packet of 100) | silver coated paper plate, sal leaf plate, areca leaf plate, paper plates white background |
| `products/areca-leaf-plate-1.webp`, `-2.webp` | Areca Leaf Plate / सुपारी पत्ते की प्लेट (10 inch, Packet of 25) | silver coated paper plate, sal leaf plate, areca leaf plate, paper plates white background |
| `products/sugarcane-plate-1.webp`, `-2.webp` | Sugarcane Bagasse Plate / गन्ने की खोई की प्लेट (10 inch, Packet of 50) | silver coated paper plate, sal leaf plate, areca leaf plate, paper plates white background |
| `products/thali-5-compartment-1.webp`, `-2.webp` | 5-Compartment Bhojan Thali / 5 खाने वाली भोजन थाल (12 inch, Packet of 50) | compartment plate disposable, 5 compartment meal tray, divided plate |
| `products/thali-4-compartment-1.webp`, `-2.webp` | 4-Compartment Bhojan Thali / 4 खाने वाली भोजन थाल (11 inch, Packet of 50) | compartment plate disposable, 5 compartment meal tray, divided plate |
| `products/thali-6-compartment-eco-1.webp`, `-2.webp` | Eco 6-Compartment Thali / इको 6 खाने वाली थाली (13 inch, Packet of 25) | compartment plate disposable, 5 compartment meal tray, divided plate |
| `products/silver-compartment-thali-1.webp`, `-2.webp` | Silver Compartment Thali / सिल्वर खाने वाली थाली (12 inch, Packet of 50) | compartment plate disposable, 5 compartment meal tray, divided plate |
| `products/paper-tea-cup-150ml-1.webp`, `-2.webp` | Paper Tea Cup 150 ml / पेपर चाय कप 150 ml (150 ml, Packet of 100) | disposable paper cups, printed paper cup, clear plastic glass, tea cup disposable |
| `products/paper-glass-250ml-1.webp`, `-2.webp` | Paper Glass 250 ml / पेपर गिलास 250 ml (250 ml, Packet of 50) | disposable paper cups, printed paper cup, clear plastic glass, tea cup disposable |
| `products/plastic-glass-200ml-1.webp`, `-2.webp` | Plastic Glass 200 ml / प्लास्टिक गिलास 200 ml (200 ml, Packet of 100) | disposable paper cups, printed paper cup, clear plastic glass, tea cup disposable |
| `products/plastic-glass-300ml-1.webp`, `-2.webp` | Plastic Glass 300 ml / प्लास्टिक गिलास 300 ml (300 ml, Packet of 50) | disposable paper cups, printed paper cup, clear plastic glass, tea cup disposable |
| `products/kulhad-style-cup-1.webp`, `-2.webp` | Kulhad Style Paper Cup / कुल्हड़ स्टाइल पेपर कप (100 ml, Packet of 100) | disposable paper cups, printed paper cup, clear plastic glass, tea cup disposable |
| `products/lassi-glass-400ml-1.webp`, `-2.webp` | Lassi Glass 400 ml / लस्सी गिलास 400 ml (400 ml, Packet of 50) | disposable paper cups, printed paper cup, clear plastic glass, tea cup disposable |
| `products/foil-roll-9m-1.webp`, `-2.webp` | Aluminium Foil Roll 9 m / अल्मोनियम फाइल रोल 9 मीटर (9 metre, 1 roll) | aluminium foil roll, aluminium foil container with lid |
| `products/foil-roll-72m-1.webp`, `-2.webp` | Aluminium Foil Roll 72 m / अल्मोनियम फाइल रोल 72 मीटर (72 metre, 1 roll) | aluminium foil roll, aluminium foil container with lid |
| `products/foil-container-250ml-1.webp`, `-2.webp` | Foil Container with Lid 250 ml / ढक्कन वाला फाइल डिब्बा 250 ml (250 ml, Packet of 100) | aluminium foil roll, aluminium foil container with lid |
| `products/foil-container-750ml-1.webp`, `-2.webp` | Foil Container with Lid 750 ml / ढक्कन वाला फाइल डिब्बा 750 ml (750 ml, Packet of 50) | aluminium foil roll, aluminium foil container with lid |
| `products/paper-bowl-180ml-1.webp`, `-2.webp` | Paper Bowl 180 ml / पेपर कटोरी 180 ml (180 ml, Packet of 100) | paper bowl white, disposable katori, plastic bowl |
| `products/plastic-katori-1.webp`, `-2.webp` | Plastic Katori / प्लास्टिक कटोरी (150 ml, Packet of 100) | paper bowl white, disposable katori, plastic bowl |
| `products/silver-katori-1.webp`, `-2.webp` | Silver Katori / सिल्वर कटोरी (150 ml, Packet of 100) | paper bowl white, disposable katori, plastic bowl |
| `products/plastic-spoon-1.webp`, `-2.webp` | Plastic Spoon / प्लास्टिक चम्मच (6 inch, Packet of 100) | disposable plastic spoon, wooden spoon disposable, plastic fork |
| `products/wooden-spoon-1.webp`, `-2.webp` | Wooden Spoon / लकड़ी का चम्मच (6 inch, Packet of 100) | disposable plastic spoon, wooden spoon disposable, plastic fork |
| `products/plastic-fork-1.webp`, `-2.webp` | Plastic Fork / प्लास्टिक काँटा (6 inch, Packet of 100) | disposable plastic spoon, wooden spoon disposable, plastic fork |
| `products/party-pack-50-guests-1.webp`, `-2.webp` | Party Combo Pack – 50 Guests / पार्टी कॉम्बो पैक – 50 मेहमान (50 guests, 1 pack) | party tableware set, disposable plate cup spoon set, buffet disposable set |
| `products/party-pack-100-guests-1.webp`, `-2.webp` | Party Combo Pack – 100 Guests / पार्टी कॉम्बो पैक – 100 मेहमान (100 guests, 1 pack) | party tableware set, disposable plate cup spoon set, buffet disposable set |
| `products/party-pack-250-guests-1.webp`, `-2.webp` | Party Combo Pack – 250 Guests / पार्टी कॉम्बो पैक – 250 मेहमान (250 guests, 1 pack) | party tableware set, disposable plate cup spoon set, buffet disposable set |
| `products/party-pack-500-guests-1.webp`, `-2.webp` | Party Combo Pack – 500 Guests / पार्टी कॉम्बो पैक – 500 मेहमान (500 guests, 1 pack) | party tableware set, disposable plate cup spoon set, buffet disposable set |

---

## 5. Deploy for free

The build output is a static site in `dist/`. Both Netlify and Vercel host it free.

### Netlify
1. Push this project to GitHub (or drag-and-drop the `dist` folder at app.netlify.com/drop after `npm run build`).
2. New site → import the repository. Settings are read from `netlify.toml` (build `npm run build`, publish `dist`).
3. `public/_redirects` makes page links like `/products/dona` work on refresh.

### Vercel with GitHub Actions auto-deploy (set up in this project)
`.github/workflows/deploy.yml` tests, builds and deploys on every push to `main` (production) and on every
pull request (preview link in the run summary). Vercel's own Git deploys are switched off in `vercel.json`
so each push deploys exactly once. One-time setup:

1. Create a Vercel account and link the project from this folder: `npx vercel login`, then `npx vercel link`
   (creates `.vercel/project.json`, which is git-ignored).
2. Create a token at https://vercel.com/account/tokens.
3. In GitHub → repository **Settings → Secrets and variables → Actions**, add:
   `VERCEL_TOKEN` (the token), `VERCEL_ORG_ID` (`orgId` from `.vercel/project.json`),
   `VERCEL_PROJECT_ID` (`projectId` from `.vercel/project.json`).
4. Push to `main` (or open **Actions → Deploy to Vercel → Run workflow**).

After deploying, set `siteUrl` in `src/config/shop.js` to your real address and deploy again.
Then add the site to **Google Search Console** and submit `https://your-domain/sitemap.xml`, and link it from your
**Google Business Profile**.

---

## 6. What's inside

- **Pages:** Home · Products & category pages (search in Hindi/English/Hinglish, filters, sort) · Product detail (photo zoom, design picker) · Party Packs (guest-count calculator) · Bulk Order (quote form) · Gallery (masonry + lightbox) · About (owner, animated stats) · FAQ · Contact (form, Google Map, directions) · 404.
- **WhatsApp:** enquiry pop-up form (`src/components/enquiry/EnquiryModal.jsx`), bulk-quote and contact forms; message builders in `src/utils/whatsapp.js` (opens the WhatsApp app on phones, WhatsApp Web on computers).
- **Language:** EN / हिं toggle in the navbar, saved in the browser, Hindi by default.
- **SEO:** unique title/description per page, Open Graph images, Google business info (LocalBusiness JSON-LD), product / FAQ / breadcrumb structured data, `sitemap.xml` and `robots.txt` generated on every build (`scripts/seo-plugin.js`).
- **Accessibility:** keyboard-friendly drawers, forms and lightbox, skip link, focus outlines, screen-reader labels, respects "reduce motion".
- **Performance:** route code-splitting, lazy images, self-hosted fonts, deferred rendering of off-screen sections. Lighthouse: **Desktop 99–100** in all categories; **Mobile** Performance 84–91, Accessibility 96–100, Best Practices 100, SEO 100.

### Folder structure
```
public/images/        photos (see section 4) · public/_redirects (Netlify routing)
scripts/              generate-placeholders.mjs (images) · seo-plugin.js (JSON-LD, sitemap, robots)
src/config/shop.js    all shop settings
src/data/             products, designs, categories, FAQs, gallery, testimonials, occasions, party packs
src/i18n/             hi.js, en.js (all text) + translation helpers
src/components/       ui/, layout/, home/, product/, cart/, gallery/, enquiry/
src/context/          language, cart, toast, enquiry providers
src/pages/            one file per page
src/utils/            whatsapp, cart, search, validation, formatting (+ __tests__)
```

---

## Credits

**Designed & Developed by Vsafe Softwares Pvt. Ltd. – https://vsafesoftwares.com/**
