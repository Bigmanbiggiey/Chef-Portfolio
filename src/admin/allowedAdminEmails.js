// UX-only allowlist — controls which screen renders (sign-in / not-authorized /
// dashboard). NOT the security boundary; the real enforcement is the RLS
// policies in supabase/schema.sql (auth.jwt() ->> 'email' in (...)).
// Keep both lists in sync manually.
export const ADMIN_EMAILS = ['ndiranguh02@gmail.com', 'meshackmashua@gmail.com'];
