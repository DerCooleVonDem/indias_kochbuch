import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../services/api';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box, 
  CircularProgress, 
  Alert,
  Divider,
  Fab
} from '@mui/material';
import { 
  AccessTime as TimeIcon, 
  Restaurant as ServingsIcon, 
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await recipeService.getAllRecipes();
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError('Fehler beim Abrufen der Rezepte. Bitte versuchen Sie es später erneut.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Rezept löschen möchten?')) {
      try {
        await recipeService.deleteRecipe(id);
        setRecipes(recipes.filter(recipe => recipe.id !== id));
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

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Alle Rezepte
      </Typography>
      
      {recipes.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          Keine Rezepte gefunden. Fügen Sie ein neues Rezept hinzu, um zu beginnen!
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {recipes.map(recipe => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {recipe.thumbnail_uri && (
                  <Box 
                    sx={{ 
                      height: 140, 
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: 'grey.100'
                    }}
                  >
                    <img
                      src={recipe.thumbnail_uri}
                      alt={recipe.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {recipe.title}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TimeIcon color="action" sx={{ mr: 1 }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.cooking_time} Minuten
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ServingsIcon color="action" sx={{ mr: 1 }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.servings} Portionen
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    startIcon={<ViewIcon />}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    Details
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/recipe/edit/${recipe.id}`)}
                  >
                    Bearbeiten
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(recipe.id)}
                  >
                    Löschen
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Box sx={{ position: 'fixed', bottom: 30, right: 30 }}>
        <Fab 
          color="primary" 
          aria-label="add recipe"
          onClick={() => navigate('/recipe/new')}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
}

export default RecipeList;