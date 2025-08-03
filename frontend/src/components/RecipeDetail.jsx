import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../services/api';
import { 
  Typography, 
  Box, 
  Paper, 
  Chip, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Button, 
  Stack, 
  CircularProgress, 
  Alert,
  Grid
} from '@mui/material';
import { 
  AccessTime as TimeIcon, 
  Restaurant as ServingsIcon, 
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FiberManualRecord as BulletIcon
} from '@mui/icons-material';

function RecipeDetail({ id }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
        setError(null);
      } catch (err) {
        setError('Fehler beim Abrufen der Rezeptdetails. Bitte versuchen Sie es später erneut.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Rezept löschen möchten?')) {
      try {
        await recipeService.deleteRecipe(id);
        navigate('/');
      } catch (err) {
        setError('Fehler beim Löschen des Rezepts. Bitte versuchen Sie es später erneut.');
        console.error(err);
      }
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
  );
  
  if (!recipe) return (
    <Alert severity="warning" sx={{ my: 2 }}>Rezept nicht gefunden</Alert>
  );

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        {recipe.title}
      </Typography>
      
      {recipe.thumbnail_uri && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <img 
            src={recipe.thumbnail_uri} 
            alt={recipe.title}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px', 
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
        </Box>
      )}
      
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Kochzeit:</strong> {recipe.cooking_time} Minuten
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ServingsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Portionen:</strong> {recipe.servings}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          Zutaten
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List disablePadding>
          {recipe.ingredients.map((ingredient, index) => (
            <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <BulletIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={ingredient} />
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Anleitung
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {recipe.instructions}
        </Typography>
      </Box>
      
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button 
          variant="outlined" 
          startIcon={<BackIcon />}
          onClick={() => navigate('/')}
        >
          Zurück zu Rezepten
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/recipe/edit/${recipe.id}`)}
        >
          Rezept bearbeiten
        </Button>
        <Button 
          variant="contained" 
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Rezept löschen
        </Button>
      </Stack>
    </Box>
  );
}

export default RecipeDetail;