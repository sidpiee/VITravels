# Vitravels

Vitravels is a ride-sharing platform that helps users find, create, and manage shared journeys.

## What the site does

Users can sign up, log in, and browse active rides created by other users. Each ride shows the complete journey details, including:

- Starting point and destination
- Travel date and departure time
- Price per seat
- Available seats and total capacity
- Ride creator
- Ride status

Users can book an available seat on a ride and cancel their booking later. Ride creators can edit their ride details or cancel a ride when needed.

## Main areas

### Dashboard

The dashboard displays all currently available rides. Users can search for rides by:

- Starting location
- Destination
- Travel date
- Minimum available seats
- Minimum and maximum price

Filters are edited locally first and are applied only when the user clicks **Apply filters**. This keeps the page from sending a new request for every keystroke.

### My rides

The My Rides section contains rides created by the current user. From here, users can review, edit, or cancel their active rides.

### My bookings

The My Bookings section shows the rides booked by the current user. Confirmed bookings can be cancelled from this section.

## Ride experience

Rides are presented as detailed cards so users can quickly compare routes, timing, cost, remaining capacity, and creator information. The interface also indicates whether the current user has already booked a ride and prevents duplicate bookings.

Only active rides with available seats and a future departure time are shown as bookable rides.

## Filtering behavior

The dashboard sends the selected filters to the rides API only after they are applied. The available filters correspond to the ride search API:

```text
from
destination
date
availableSeats
minPrice
maxPrice
```

Location fields use searchable comboboxes, the date field uses a calendar popover, and numeric filters use compact input controls.

## Built with

Vitravels uses Next.js, React, TypeScript, TanStack Query, Tailwind CSS, shadcn-style UI components, and Lucide icons.
