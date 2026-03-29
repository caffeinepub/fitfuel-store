# FitFuel Store — Version 9 Upgrade

## Current State

FitFuel Store is a working eCommerce site with:
- 4 Pintola products (Oats, Muesli, HP Peanut Butter, Performance PB)
- Cart with delivery logic (₹30 for 1-2 items, free for 3+)
- Checkout with address form + GPS detect location
- Payment via UPI or COD
- Order success page that sends order to WhatsApp
- Backend stores orders with address, products, payment method
- Floating WhatsApp button

## Requested Changes (Diff)

### Add
- **GPS-based delivery logic**: Use browser GPS on checkout page; calculate distance from store (Hasanpura, Jaipur: 26.9124°N, 75.8648°E). Within 5km = always free. Outside 5km = ₹30 for 1-2 items, free for 3+. CartContext needs to accept external deliveryCharge override.
- **User profile system**: At checkout, save user's Name + Phone + Address to backend. Profile page at `/profile` — user enters phone number to look up their saved profile and past orders.
- **Rule-based chatbot**: Floating "Need Help?" button. Handles order status, delivery, payment, FAQs with pre-written responses. "Request Callback" sends customer details to WhatsApp 9549956286.
- **Admin page at `/admin`**: Password protected (Fit@123). Shows all customers + orders. One-click Excel/CSV download. Hidden from navigation.
- **Backend user storage**: Store UserProfile (name, phone, address). Link orders to phone numbers. Admin can query all users and all orders.

### Modify
- **All WhatsApp numbers** updated to 9549956286 everywhere (FloatingWhatsApp, OrderSuccess, Footer, CartContext)
- **CartContext**: Add ability to override deliveryCharge externally (from GPS result)
- **Checkout page**: After form submission, save user profile to backend via phone number. Also compute GPS distance and update delivery charge.
- **OrderSuccess**: Use 9549956286 for WhatsApp link

### Remove
- Nothing removed

## Implementation Plan

1. **Backend (Motoko)**:
   - Add `UserProfile` type: `{ name: Text; phone: Text; address: DeliveryAddress }`
   - Add `saveUserProfile(profile: UserProfile)` — store by phone number
   - Add `getUserByPhone(phone: Text) : async ?UserProfile`
   - Add `getOrdersByPhone(phone: Text) : async [Order]` — filter orders by phone
   - Add `getAllUsers() : async [UserProfile]` — admin export
   - Modify `submitOrder` to accept optional phone for linking
   - Order type gets `customerPhone: Text` field

2. **Frontend**:
   - Update CartContext: accept `gpsDeliveryCharge` state; expose `setGpsDeliveryCharge`
   - Update Checkout: reverse-geocode GPS coordinates using Nominatim (free, no API key), calculate haversine distance to store, set delivery charge accordingly. Show message: "Free Delivery within 5 KM of our store (Hasanpura, Jaipur)"
   - After checkout form submit: call `saveUserProfile` backend API
   - Add `/profile` page: input phone → fetch profile + orders → show dashboard
   - Add `SupportChatbot` component: floating "Need Help?" button, chat bubble with rule-based answers and "Request Callback" button
   - Add `/admin` page: password gate (Fit@123), table of all users + orders, CSV export button
   - Update App.tsx with new routes: /profile, /admin
   - Update all WhatsApp numbers to 9549956286
