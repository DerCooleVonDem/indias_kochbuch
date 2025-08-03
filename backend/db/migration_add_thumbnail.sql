-- Add thumbnail_uri column to recipes table
ALTER TABLE recipes ADD COLUMN thumbnail_uri VARCHAR(1024);

-- Update existing recipes with a default thumbnail (optional)
-- UPDATE recipes SET thumbnail_uri = 'https://via.placeholder.com/300x200?text=No+Image' WHERE thumbnail_uri IS NULL;