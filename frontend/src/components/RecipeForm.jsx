import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../services/api';
import {
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  List,
  ListItem
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AccessTime as TimeIcon,
  Restaurant as ServingsIcon
} from '@mui/icons-material';

function RecipeForm({ recipeId }) {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: [''],
    instructions: '',
    cooking_time: '',
    servings: '',
    thumbnail_uri: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If recipeId is provided, we're editing an existing recipe
    if (recipeId) {
      setIsEditing(true);
      const fetchRecipe = async () => {
        try {
          setLoading(true);
          const recipe = await recipeService.getRecipeById(recipeId);
          setFormData({
            title: recipe.title || '',
            ingredients: recipe.ingredients.length ? recipe.ingredients : [''],
            instructions: recipe.instructions || '',
            cooking_time: recipe.cooking_time || '',
            servings: recipe.servings || '',
            thumbnail_uri: recipe.thumbnail_uri || ''
          });
        } catch (err) {
          setError('Fehler beim Abrufen der Rezeptdetails. Bitte versuchen Sie es später erneut.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchRecipe();
    }
  }, [recipeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = value;
    setFormData({
      ...formData,
      ingredients: updatedIngredients
    });
  };

  const addIngredientField = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, '']
    });
  };

  const removeIngredientField = (index) => {
    if (formData.ingredients.length > 1) {
      const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        ingredients: updatedIngredients
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      setError('Rezepttitel ist erforderlich');
      return;
    }
    
    // Filter out empty ingredients
    const filteredIngredients = formData.ingredients.filter(ing => ing.trim() !== '');
    if (filteredIngredients.length === 0) {
      setError('Mindestens eine Zutat ist erforderlich');
      return;
    }
    
    if (!formData.instructions.trim()) {
      setError('Anleitung ist erforderlich');
      return;
    }
    
    // Prepare data for submission
    const recipeData = {
      ...formData,
      ingredients: filteredIngredients,
      cooking_time: parseInt(formData.cooking_time) || 0,
      servings: parseInt(formData.servings) || 1
    };
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditing) {
        await recipeService.updateRecipe(recipeId, recipeData);
      } else {
        await recipeService.createRecipe(recipeData);
      }
      
      setSuccess(true);
      
      // Reset form if creating a new recipe
      if (!isEditing) {
        setFormData({
          title: '',
          ingredients: [''],
          instructions: '',
          cooking_time: '',
          servings: '',
          thumbnail_uri: ''
        });
      }
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      setError(`Fehler beim ${isEditing ? 'Aktualisieren' : 'Erstellen'} des Rezepts. Bitte versuchen Sie es später erneut.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        {isEditing ? 'Rezept bearbeiten' : 'Neues Rezept hinzufügen'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>
        Rezept erfolgreich {isEditing ? 'aktualisiert' : 'erstellt'}! Weiterleitung...
      </Alert>}
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Rezepttitel"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="z.B. Pfannkuchen"
              required
              variant="outlined"
              margin="normal"
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Thumbnail URI"
              id="thumbnail_uri"
              name="thumbnail_uri"
              value={formData.thumbnail_uri}
              onChange={handleChange}
              placeholder="z.B. https://example.com/image.jpg"
              variant="outlined"
              margin="normal"
              helperText="Geben Sie eine URL für das Rezeptbild ein (optional)"
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Zutaten
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List disablePadding>
              {formData.ingredients.map((ingredient, index) => (
                <ListItem 
                  key={index} 
                  disablePadding 
                  sx={{ mb: 1 }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="remove ingredient"
                      onClick={() => removeIngredientField(index)}
                      disabled={formData.ingredients.length <= 1}
                      color="error"
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>
                  }
                >
                  <TextField
                    fullWidth
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder="z.B. 2 Tassen Mehl"
                    variant="outlined"
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
            
            <Button 
              startIcon={<AddIcon />}
              onClick={addIngredientField}
              variant="outlined"
              color="primary"
              sx={{ mt: 1 }}
            >
              Zutat hinzufügen
            </Button>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Anleitung"
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Schritt-für-Schritt-Anleitung zur Zubereitung des Rezepts"
              required
              variant="outlined"
              multiline
              rows={6}
              margin="normal"
            />
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kochzeit (Minuten)"
                id="cooking_time"
                name="cooking_time"
                type="number"
                value={formData.cooking_time}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0 }}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Portionen"
                id="servings"
                name="servings"
                type="number"
                value={formData.servings}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ServingsIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 1 }}
                variant="outlined"
              />
            </Grid>
          </Grid>
          
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/')}
            >
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Speichern...' : (isEditing ? 'Rezept aktualisieren' : 'Rezept erstellen')}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default RecipeForm;