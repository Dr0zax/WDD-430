# Admin setup

1. Run the SQL files in `supabase/migrations/` in numeric order in the Supabase SQL editor or through the Supabase CLI. If `001_admin_content.sql` and `002_questions_permissions.sql` were already applied, also run `003_content_permissions.sql`.
2. Create the first administrator in Supabase Authentication.
3. Set that user's `app_metadata` role to `admin` with the Supabase dashboard or an admin-only server script. The role must be in `app_metadata`, not user-editable metadata. The optional `SUPABASE_ADMIN_EMAIL` environment variable can also authorize one configured email address.
4. Configure `SUPABASE_URL` and `SUPABASE_KEY` in the deployment environment. `SUPABASE_KEY` should be the public anon key because the signed-in user session and database RLS policies authorize admin operations.
5. Start the app with `astro dev --background` and open `/admin/login`.

The admin routes use HTTP-only, same-site cookies for the Supabase access and refresh tokens. All admin pages check the authenticated user's admin role before querying or mutating content. Public question submissions should insert only `status = 'pending'`; administrators publish them from `/admin/questions`.
