# Placeholder: Demo auth UX clarity

**Why this is missing**
- `/auth/login.tsx` contains a button without behavior. In a production-ready public template it must be obvious this is demo-only.

**TODO**
- Clearly label the screen as demo-only and either disable the button or route to a guest/demo flow.
- Ensure routing does not look like real authentication unless you implement private auth.
