const API_URL = 'http://217.154.206.172/api';

export const shoppingListService = {
  // Get all shopping list items
  getAllItems: async () => {
    try {
      const response = await fetch(`${API_URL}/shopping-list`);
      if (!response.ok) {
        throw new Error('Failed to fetch shopping list items');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching shopping list items:', error);
      throw error;
    }
  },

  // Add a new shopping list item
  addItem: async (item) => {
    try {
      const response = await fetch(`${API_URL}/shopping-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Failed to add shopping list item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding shopping list item:', error);
      throw error;
    }
  },

  // Update a shopping list item
  updateItem: async (id, item) => {
    try {
      const response = await fetch(`${API_URL}/shopping-list/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Failed to update shopping list item');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating shopping list item with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a shopping list item
  deleteItem: async (id) => {
    try {
      const response = await fetch(`${API_URL}/shopping-list/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete shopping list item');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting shopping list item with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete all checked items
  deleteCheckedItems: async () => {
    try {
      const response = await fetch(`${API_URL}/shopping-list/checked`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete checked shopping list items');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting checked shopping list items:', error);
      throw error;
    }
  },
};

export const recipeService = {
  // Get all recipes
  getAllRecipes: async () => {
    try {
      const response = await fetch(`${API_URL}/recipes`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },

  // Get a recipe by ID
  getRecipeById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching recipe with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new recipe
  createRecipe: async (recipeData) => {
    try {
      const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  },

  // Update a recipe
  updateRecipe: async (id, recipeData) => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating recipe with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a recipe
  deleteRecipe: async (id) => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting recipe with ID ${id}:`, error);
      throw error;
    }
  },
};