# Vitravels

Vitravels is a campus-tailored ride-sharing and carpooling platform designed for students and commuters to find, organize, and share journeys between campus and major transit hubs. By connecting travelers heading along the same corridors, Vitravels reduces travel expenses, simplifies logistics, and promotes sustainable commuting.

---

## Key Features

### 🎓 Verified Campus Community
- **Domain-Restricted Access**: Registration is restricted to verified university emails (`@vitbhopal.ac.in`) to ensure trust and safety across co-travelers.
- **Two-Step OTP Authentication**: 6-digit one-time password verification protects account registration and password recovery.
- **Customizable Profiles**: In-app display name editing so companions always know who they are sharing a ride with.

---

### 🔍 Dynamic Ride Discovery & Smart Filtering
- **Popular Regional Hubs**: Quick selection across prominent regional routes, including Bhopal Junction, Rani Kamlapati (RKMP), Bhopal Airport, Indore Airport, Sehore, Astha, and campus gates.
- **Multi-Parametric Search**: Filter journeys by origin, destination, calendar date, minimum available seats, and price ranges.
- **Stutter-Free Draft Filtering**: Filter criteria are adjusted locally and sent on-demand upon clicking **Apply filters**, preventing redundant network requests and lag during selection.
- **At-a-Glance Route Cards**: Cards display departure schedules, price per seat, remaining seats, driver identity, and journey status (`active`, `completed`, `cancelled`).

---

### 🚗 Ride Publishing & Host Tools
- **Simple Ride Creation**: Post empty seats in seconds with scheduled departure times (15-minute intervals), per-seat pricing, and capacity caps (1–8 seats).
- **Route Validation**: Enforces distinct origins and destinations with real-time form checks.
- **Host Dashboard ("My Rides")**:
  - Live capacity visualization tracking occupied vs. total seats.
  - In-place ride editing to modify timings, prices, or seat allocations.
  - One-click ride cancellation with automated cache synchronization.

---

### 🎟️ Frictionless Seat Booking & Reservation
- **One-Click Booking**: Reserve open seats instantly with immediate capacity reduction.
- **Duplicate Booking Prevention**: Restricts riders from creating overlapping or duplicate bookings for the same trip.
- **Passenger Hub ("My Bookings")**: Centralized view of all confirmed trips with self-service cancellation, instantly returning seats to the pool for other travelers.

---

### 💬 Real-Time Group Chat (OueChat)
- **Ride-Specific Chat Rooms**: Every active ride automatically provisions an isolated real-time chat room powered by Socket.IO.
- **Secure Token Handshake**: Uses short-lived session tokens issued by the authentication service before establishing socket connections.
- **Effortless Coordination**: Connect with drivers and co-passengers to align on exact pickup spots, luggage volume, and travel delays without sharing personal phone numbers.
- **Smooth Messaging Experience**: Auto-scrolling message streams, connection state indicators, and sender name attribution.

---

### 🎨 Modern UI & Responsive Experience
- **Adaptive Theme Engine**: Seamless switching between Light and Dark modes with OKLCH color palettes and clean contrast.
- **Mobile-First Layout**: Fully responsive drawer navigation, backdrop blur effects, and touch-optimized controls.
- **Interactive Feedback**: Instant user feedback via toast notifications, shimmer actions, and animated shine borders.
