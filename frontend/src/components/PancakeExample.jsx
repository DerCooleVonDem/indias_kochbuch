import React from 'react';
import { Link } from 'react-router-dom';
import { recipeService } from '../services/api';
import {
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link as MuiLink
} from '@mui/material';
import {
  Cake as CakeIcon,
  FiberManualRecord as BulletIcon,
  AddCircle as AddIcon
} from '@mui/icons-material';

// This component is just for demonstration purposes
// It shows how to create a simple pancake recipe using the API

function PancakeExample() {
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState(null);
  
  // Sample pancake recipe data
  const ingredients = [
    '1 Tasse Mehl',
    '2 Esslöffel Zucker',
    '2 Teelöffel Backpulver',
    '1/2 Teelöffel Salz',
    '1 Tasse Milch',
    '2 Esslöffel geschmolzene Butter',
    '1 großes Ei',
    '1 Teelöffel Vanilleextrakt',
    'Butter oder Öl zum Braten'
  ];
  
  const instructions = `1. In einer großen Schüssel Mehl, Zucker, Backpulver und Salz vermischen.
2. In einer anderen Schüssel Milch, geschmolzene Butter, Ei und Vanilleextrakt verquirlen.
3. Die flüssigen Zutaten zu den trockenen Zutaten geben und nur so lange rühren, bis alles verbunden ist. Nicht zu viel rühren; ein paar Klümpchen sind in Ordnung.
4. Eine Pfanne oder beschichtete Pfanne bei mittlerer Hitze erhitzen. Eine kleine Menge Butter oder Öl hinzufügen.
5. Für jeden Pfannkuchen 1/4 Tasse Teig in die Pfanne gießen.
6. Kochen, bis sich Blasen auf der Oberfläche bilden und die Ränder fest aussehen, etwa 2-3 Minuten.
7. Wenden und die zweite Seite goldbraun braten, etwa 1-2 Minuten mehr.
8. Warm mit Ahornsirup, frischen Früchten oder Ihren Lieblingstoppings servieren.`;

  const pancakeRecipe = {
    title: 'Klassische Pfannkuchen',
    ingredients: ingredients,
    instructions: instructions,
    cooking_time: 20,
    servings: 4,
    thumbnail_uri: 'https://images.unsplash.com/photo-1565299543923-37dd37887442?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=828&q=80'
  };

  const createPancakeRecipe = async () => {

    try {
      setStatus('loading');
      const result = await recipeService.createRecipe(pancakeRecipe);
      setStatus('success');
      return result;
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CakeIcon sx={{ mr: 1 }} /> Beispiel-Pfannkuchenrezept
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="body1" paragraph>
          Klicken Sie auf die Schaltfläche unten, um ein Beispiel-Pfannkuchenrezept in der Datenbank zu erstellen.
          Dieses Rezept enthält alle notwendigen Informationen wie Zutaten, Anleitung, Kochzeit und Portionen.
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Zutaten:</Typography>
          <Divider sx={{ mb: 2 }} />
          <List dense disablePadding>
            {pancakeRecipe.ingredients.map((ingredient, index) => (
              <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <BulletIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={ingredient} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        {status === 'success' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>Erfolg!</AlertTitle>
            Pfannkuchenrezept erfolgreich erstellt! Gehen Sie zur <MuiLink component={Link} to="/">Rezeptliste</MuiLink>, um es zu sehen.
          </Alert>
        )}
        
        {status === 'error' && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Fehler</AlertTitle>
            Fehler beim Erstellen des Rezepts: {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="contained"
            color="primary"
            size="large"
            startIcon={status === 'loading' ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            onClick={createPancakeRecipe}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Wird erstellt...' : 'Pfannkuchenrezept erstellen'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default PancakeExample;