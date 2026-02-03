-- Execute this SQL in your Supabase Dashboard -> SQL Editor
-- This is required because the automatic migration failed due to permission/connection issues.

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price numeric DEFAULT 0;
ALTER TABLE public.product_options ADD COLUMN IF NOT EXISTS cost_price numeric DEFAULT 0;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'cost_price';
