import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button,
  Paper,
  Link as MuiLink
} from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import theme from './theme'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import RecipeForm from './components/RecipeForm'
import PancakeExample from './components/PancakeExample'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static" color="primary" elevation={4}>
            <Toolbar>
              <RestaurantMenuIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                India's Kochbuch
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Rezepte
              </Button>
              <Button color="inherit" component={Link} to="/recipe/new">
                Neues Rezept
              </Button>
              <Button color="inherit" component={Link} to="/example">
                Beispiel
              </Button>
            </Toolbar>
          </AppBar>
          
          <Container component="main" sx={{ flexGrow: 1, py: 4, mt: 2 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Routes>
                <Route path="/" element={<RecipeList />} />
                <Route path="/recipe/:id" element={<RecipeDetailWrapper />} />
                <Route path="/recipe/new" element={<RecipeForm />} />
                <Route path="/recipe/edit/:id" element={<RecipeEditWrapper />} />
                <Route path="/example" element={<PancakeExample />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Paper>
          </Container>
          
          <Box component="footer" sx={{ 
            py: 3, 
            px: 2, 
            mt: 'auto', 
            backgroundColor: theme.palette.grey[100],
            textAlign: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} India's Kochbuch
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <MuiLink component={Link} to="/example" color="primary">
                Beispielrezept erstellen
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  )
}

// Wrapper components to extract URL parameters
function RecipeDetailWrapper() {
  const id = window.location.pathname.split('/').pop();
  return <RecipeDetail id={id} />;
}

function RecipeEditWrapper() {
  const id = window.location.pathname.split('/').pop();
  return <RecipeForm recipeId={id} />;
}

export default App