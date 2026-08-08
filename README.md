# LOREM — GitHub Pages Storefront

A static ecommerce-style storefront inspired by the general feel of modern cute lifestyle/gifting stores.

## Features
- Responsive homepage
- Shop/category filtering
- Product detail pages
- Search
- Shopping cart using localStorage
- WhatsApp order flow
- No backend required
- GitHub Pages compatible

## Publish on GitHub Pages
1. Create a new GitHub repository.
2. Upload all files/folders from this project.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save and wait for GitHub Pages to publish.

## Important customizations
### WhatsApp
Open `js/cart.js` and replace:
`919876543210`
with your WhatsApp number including country code, without `+`.

### Products
Edit `js/products.js`. Each product has:
- id
- name
- price
- category
- tags
- emoji
- background class
- description

### Branding
Change `LOREM` in the HTML files and update colors/fonts in `css/style.css`.

### Real product images
The demo uses emoji artwork so it works immediately without copyrighted/product images. Replace the `.product-image` contents with `<img>` elements when you have your own product photos.

## Payment
This version intentionally uses WhatsApp ordering. GitHub Pages is static hosting and does not itself process payments or store orders. A payment gateway/backend can be added later.
