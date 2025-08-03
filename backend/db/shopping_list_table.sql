-- Create shopping_list_items table
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity VARCHAR(50),
  unit VARCHAR(50),
  checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);