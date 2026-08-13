# NextSpot language and privacy contract

NextSpot is a public-registration, private-by-default travel journal. Signed-in users can only read and change their own travel data; there is no public journal, sharing, or social feed.

## Ubiquitous language

- **Place**: a destination saved by its owner, including location, optional address/cost, and URL-based photos. Persisted as `Spots` and served under `/api/spots` for compatibility.
- **Stay**: arrival and departure dates attached to an owned Place. Persisted as `Bookings` and served under `/api/bookings`.
- **Memory**: a note and 1–5 rating attached to an owned Place. Persisted as `Reviews` and served under `/api/reviews`.
- **Collection**: an owner-defined group of owned Places. Persisted as `Wishlists`/`Wishspots` and served under `/api/wishlists` and `/api/wishspots`.

The authenticated session is the only authorization identity. Legacy `userId`, `username`, and `spotName` request values are not trusted. Dashboard status is derived from Stay dates: a Place with a current/future Stay is Planned, one with only completed Stays is Visited, and one without Stays is Unscheduled.
