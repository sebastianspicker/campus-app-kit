# Public room data

Public rooms are part of the institution pack (`publicRooms`).

## Schema

- `publicRooms?: Array<{ id, name, campusId }>`

## Where it is used

- BFF: `/rooms` and `/today` derive rooms from `institution.publicRooms`
- Mobile: rooms list renders data returned by the BFF
