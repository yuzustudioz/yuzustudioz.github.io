# BUILDO — Dawbu-style GitHub Pages Store

A static ecommerce storefront inspired by the general layout and shopping flow of Dawbu.com.

## Included

- Responsive homepage
- Announcement bar
- Sticky navigation
- Category navigation
- Product grids
- Product filtering
- Search overlay
- Shopping bag/cart
- `localStorage` cart persistence
- Mobile navigation
- Newsletter interaction
- WhatsApp checkout with customer details
- No backend required

## Run locally

Just open `index.html` in a browser.

For a more accurate local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages

1. Create a GitHub repository.
2. Upload everything inside this folder.
3. Go to **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save.

Your website will be available at your GitHub Pages URL.

## Changing content

Most content is in:

- `index.html` — sections, navigation, text
- `assets/js/app.js` — product catalog, prices, cart
- `assets/css/style.css` — colors, spacing, layout

Replace the placeholder emoji product visuals with your own images later.

## Important

This is an original implementation inspired by the general shopping structure and visual feel of Dawbu. It does not copy Dawbu's source code, branding, proprietary assets, or product photography.


## WhatsApp orders

The checkout button opens WhatsApp with a pre-filled order message containing the cart contents, subtotal, customer name, phone and delivery address.

The configured WhatsApp destination is the number supplied for this site. To change it later, edit `whatsappNumber` in `assets/js/app.js`.

For production, consider adding server-side order validation, payment confirmation and a privacy policy before accepting large volumes of orders.
