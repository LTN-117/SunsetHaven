-- Update events table to support multiple price tiers
-- Run this in Supabase SQL Editor

-- Add pricing_tiers column (JSONB array)
ALTER TABLE events
ADD COLUMN IF NOT EXISTS pricing_tiers JSONB DEFAULT '[]'::jsonb;

-- Example pricing_tiers structure:
-- [
--   {"label": "Early Bird", "price": 30000},
--   {"label": "Regular", "price": 40000},
--   {"label": "VIP", "price": 60000}
-- ]

-- Keep the cost column for backward compatibility
-- It will store the lowest/starting price

-- Success message
SELECT 'Event pricing update completed successfully!' as message;
