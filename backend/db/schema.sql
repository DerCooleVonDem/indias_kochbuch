-- Drop tables if they exist
DROP TABLE IF EXISTS recipes;

-- Create recipes table
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT NOT NULL,
  cooking_time INTEGER,
  servings INTEGER,
  thumbnail_uri VARCHAR(1024),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on title for faster searches
CREATE INDEX idx_recipes_title ON recipes(title);

-- Insert some sample data
INSERT INTO recipes (title, ingredients, instructions, cooking_time, servings)
VALUES 
  (
    'Butter Chicken', 
    ARRAY['500g chicken breast', '2 tbsp butter', '1 onion', '2 cloves garlic', '1 tbsp garam masala', '1 tsp turmeric', '1 cup tomato sauce', '1/2 cup cream'], 
    'Marinate chicken with spices. Cook onions and garlic in butter. Add chicken and cook until browned. Add tomato sauce and simmer. Finish with cream.',
    45,
    4
  ),
  (
    'Palak Paneer',
    ARRAY['250g paneer', '500g spinach', '1 onion', '2 cloves garlic', '1 tsp cumin', '1 tsp garam masala', '1/2 cup cream'],
    'Blanch spinach and blend to a puree. Cook onions and garlic with spices. Add spinach puree and simmer. Add paneer cubes and cream.',
    30,
    3
  );