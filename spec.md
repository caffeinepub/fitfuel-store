# FitFuel Store — Full Rebuild (Version 6)

## Current State
Existing FitFuel Store with Pintola products, cart, WhatsApp integration, discount coupons. Being fully rebuilt with new product set, pricing, payment flow, and address/checkout system.

## Requested Changes (Diff)

### Add
- Complete checkout flow: Cart → Address Form → Payment → Order Success
- UPI payment with QR code (UPI ID: 9549958286@fam) + manual UPI ID entry
- COD (Cash on Delivery) payment option
- Address form with static map placeholder + browser GPS "Detect My Location" + manual entry
- Address fields: type (Home/Work/Hotel/Other), Flat/House/Building, Floor, Area/Locality, Landmark, Name, Phone
- Delivery charge logic: ₹30 for 1–2 items in cart; FREE for 3+ items
- Discount % badges on all product cards and product pages
- Search bar in navbar
- WhatsApp order dispatch on order success (number: 9549958286)
- Slogan: "Fuel Your Strength"

### Modify
- Replace ALL existing products with exactly 4 products (with size variants):
  1. Pintola High Protein Oats — 1kg (MRP ₹620, SP ₹500, 19% off) & 400g (MRP ₹310, SP ₹250, 19% off)
  2. Pintola High Protein Muesli — 1kg (MRP ₹710, SP ₹600, 15% off) & 400g (MRP ₹325, SP ₹275, 15% off)
  3. Pintola High Protein Peanut Butter — 1kg (MRP ₹665, SP ₹500, 25% off) & 510g (MRP ₹355, SP ₹300, 15% off)
  4. Pintola Performance Peanut Butter — 1kg only (MRP ₹575, SP ₹450, 22% off)
- WhatsApp number updated to 9549958286
- Cart now shows: per-item price, delivery charges (dynamic), total savings, grand total

### Remove
- Old discount coupon system (SHAH10–SHAH30)
- All old products not in the new list
- Old checkout placeholder

## Implementation Plan
1. Backend: store orders with product, size, quantity, address, payment method, status
2. Frontend pages: Home, Products, Product Detail, Cart, Checkout (Address), Payment, Order Success
3. Product data: hardcoded in frontend with Pintola CDN images, descriptions, discount badges
4. Cart: React context/state, item count drives delivery fee (₹30 if <3 items, ₹0 if 3+)
5. Address form: static map SVG placeholder + navigator.geolocation for GPS fill
6. Payment: two-tab UI — UPI (QR code for 9549958286@fam + UPI ID entry) and COD
7. Order success: display summary + trigger WhatsApp link to 9549958286 with full order details
8. Search: filter products by name in real time
9. Discount badges: show calculated % on every product card
