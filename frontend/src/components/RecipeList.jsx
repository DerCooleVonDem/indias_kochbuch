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
  Fab,
  TextField,
  InputAdornment,
  Paper
} from '@mui/material';
import { 
  AccessTime as TimeIcon, 
  Restaurant as ServingsIcon, 
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Filter recipes based on search term
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          gap: 2,
          mb: 3 
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ mb: { xs: 1, sm: 2 } }}
        >
          Alle Rezepte
        </Typography>
        
        <Paper 
          elevation={1}
          component="form"
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            width: { xs: '100%', sm: 300 },
            alignSelf: { xs: 'stretch', sm: 'flex-start' }
          }}
        >
          <TextField
            fullWidth
            placeholder="Rezepte oder Zutaten suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="standard"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              disableUnderline: true
            }}
            sx={{ ml: 1, flex: 1 }}
          />
        </Paper>
      </Box>
      
      {recipes.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          Keine Rezepte gefunden. Fügen Sie ein neues Rezept hinzu, um zu beginnen!
        </Alert>
      ) : filteredRecipes.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          Keine Rezepte gefunden, die Ihrer Suche entsprechen.
        </Alert>
      ) : (
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 2 }}>
          {filteredRecipes.map(recipe => (
            <Grid item xs={12} md={4} key={recipe.id} sx={{ width: '100%', px: { xs: 0.5, sm: 1, md: 2 } }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100%' }}>
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
                <CardActions 
                  sx={{ 
                    p: 2, 
                    pt: 0,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: { xs: 'flex-start', sm: 'space-between' },
                    gap: 1
                  }}
                >
                  <Button 
                    size="small" 
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    sx={{ 
                      flex: { sm: 1 },
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: 'center'
                    }}
                  >
                    Details
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/recipe/edit/${recipe.id}`)}
                    sx={{ 
                      flex: { sm: 1 },
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: 'center'
                    }}
                  >
                    Bearbeiten
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(recipe.id)}
                    sx={{ 
                      flex: { sm: 1 },
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: 'center'
                    }}
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