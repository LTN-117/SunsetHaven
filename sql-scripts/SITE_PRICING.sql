-- Run once in the Sunset Haven Supabase project. The public site reads pricing
-- through a server route; only the service role can access this table directly.
CREATE TABLE IF NOT EXISTS public.site_pricing (
  id integer PRIMARY KEY CHECK (id = 1),
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_pricing ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_pricing FROM anon, authenticated;
-- The initial values are supplied by the app's pricing API until an admin saves
-- them. No existing production data is modified by this migration.
