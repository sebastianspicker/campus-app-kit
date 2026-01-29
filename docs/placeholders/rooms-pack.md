# Placeholder: Public room data

**Why this is missing**
- `/rooms` and `today.rooms` currently return `[]`. A public template should include a basic public room list (availability can remain private).

**TODO**
- Extend the institution pack schema with optional `publicRooms` (name, campusId, labels).
- Serve `/rooms` and `/today` rooms from the pack (availability stays private).
- Update fixtures/tests so the UI shows real content.
