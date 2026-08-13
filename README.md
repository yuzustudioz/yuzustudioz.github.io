# BUILDO — GitHub Pages + WhatsApp Store

This repository is a complete static ecommerce-style website inspired by the general layout and visual feel of modern playful Indian ecommerce stores.

## Included

- Responsive desktop and mobile layout
- Mobile navigation
- Product cards
- Category filtering
- Search overlay
- Shopping bag
- Persistent cart using localStorage
- WhatsApp checkout
- Customer name, phone and delivery address form
- WhatsApp destination: +91 9876543210
- No backend required
- GitHub Pages compatible

## WhatsApp checkout

The checkout flow is:

1. Add products to the bag.
2. Open the bag.
3. Press Checkout.
4. Enter name, phone and delivery address.
5. Press Continue to WhatsApp.
6. The browser opens:

`https://wa.me/919876543210?...`

The order message contains the products, quantities, prices, subtotal and customer details.

On mobile, supported browsers can hand the link to WhatsApp. On Windows/macOS, the link can use WhatsApp Web or the installed WhatsApp application.

## GitHub Pages deployment

Upload the entire repository contents to GitHub.

Then:

**Repository → Settings → Pages → Deploy from a branch → main → /(root) → Save**

The site is entirely static.

## Change the WhatsApp number

Open:

`assets/js/app.js`

Change:

```js
const WHATSAPP_NUMBER = "919876543210";
```

Use the international number without `+`, spaces or hyphens.

## Change products

Product data is near the top of:

`assets/js/app.js`

Each product has:

- `id`
- `name`
- `price`
- `old`
- `cat`
- `emoji`
- optional `badge`

Replace the placeholder products with your own products and later replace the emoji artwork with actual product images.

## Important

This is an original implementation using placeholder branding and content. Replace the content, product photography, logo and legal/business information with your own material before launch.


## Product detail pages

Every product now opens the same reusable product page:

`product.html?id=1`

The product page automatically displays the selected product's:
- name and pricing
- price-drop badge
- description
- quantity selector
- Add to Bag / Buy It Now
- dimensions
- material
- weight
- quantity included
- offers
- features
- related products

### Adding a new product

Add another object to the `products` array in `assets/js/app.js`. You do not need to create a new HTML file. The existing `product.html` handles every product automatically.

Product cards on the Home page and the Most Searched section link to the correct product detail page while their Add to Bag buttons continue to add directly to the persistent cart.
