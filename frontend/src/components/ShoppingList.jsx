import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  TextField,
  Button,
  IconButton,
  Divider,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { shoppingListService } from '../services/api';

function ShoppingList() {
  // State for shopping list items
  const [items, setItems] = useState([]);
  // State for new item input
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load items from database on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await shoppingListService.getAllItems();
        setItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching shopping list items:', err);
        setError('Fehler beim Laden der Einkaufsliste. Bitte versuchen Sie es später erneut.');
        
        // Fallback to localStorage if API fails
        const savedItems = localStorage.getItem('shoppingList');
        if (savedItems) {
          setItems(JSON.parse(savedItems));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Save items to localStorage as backup
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  // Handle adding a new item
  const handleAddItem = async () => {
    if (newItem.name.trim() === '') return;
    
    const item = {
      name: newItem.name.trim(),
      quantity: newItem.quantity || '1',
      unit: newItem.unit || '',
      checked: false
    };
    
    try {
      const addedItem = await shoppingListService.addItem(item);
      setItems([...items, addedItem]);
      setNewItem({ name: '', quantity: '', unit: '' });
      setError(null);
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Fehler beim Hinzufügen des Artikels. Bitte versuchen Sie es später erneut.');
    }
  };

  // Handle toggling item checked status
  const handleToggleCheck = async (id) => {
    try {
      const itemToUpdate = items.find(item => item.id === id);
      const updatedItem = { ...itemToUpdate, checked: !itemToUpdate.checked };
      
      await shoppingListService.updateItem(id, updatedItem);
      
      setItems(items.map(item => 
        item.id === id ? updatedItem : item
      ));
      setError(null);
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Fehler beim Aktualisieren des Artikels. Bitte versuchen Sie es später erneut.');
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async (id) => {
    try {
      await shoppingListService.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Fehler beim Löschen des Artikels. Bitte versuchen Sie es später erneut.');
    }
  };

  // Handle clearing all checked items
  const handleClearChecked = async () => {
    try {
      await shoppingListService.deleteCheckedItems();
      setItems(items.filter(item => !item.checked));
      setError(null);
    } catch (err) {
      console.error('Error clearing checked items:', err);
      setError('Fehler beim Löschen der gekauften Artikel. Bitte versuchen Sie es später erneut.');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ShoppingCartIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h2">
          Einkaufsliste
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Neuen Artikel hinzufügen
        </Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Artikel"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              fullWidth
              label="Menge"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Einheit"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              variant="outlined"
              size="small"
              placeholder="g, kg, Stück..."
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
            >
              Hinzufügen
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : items.length > 0 ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Einkaufsliste ({items.length} Artikel)
            </Typography>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleClearChecked}
              disabled={!items.some(item => item.checked)}
            >
              Gekaufte Artikel entfernen
            </Button>
          </Box>
          
          <Paper elevation={1}>
            <List>
              {items.map((item, index) => (
                <Box key={item.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleDeleteItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={item.checked}
                        onChange={() => handleToggleCheck(item.id)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            textDecoration: item.checked ? 'line-through' : 'none',
                            color: item.checked ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {item.name}
                        </Typography>
                      }
                      secondary={item.quantity && `${item.quantity} ${item.unit}`}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Paper>
        </>
      ) : (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Ihre Einkaufsliste ist leer. Fügen Sie Artikel hinzu, um zu beginnen.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default ShoppingList;