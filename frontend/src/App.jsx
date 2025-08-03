import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button,
  Paper,
  Link as MuiLink,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import CakeIcon from '@mui/icons-material/Cake'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import theme from './theme'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import RecipeForm from './components/RecipeForm'
import PancakeExample from './components/PancakeExample'
import ShoppingList from './components/ShoppingList'

// Navbar component with responsive design
function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { text: 'Rezepte', path: '/', icon: <HomeIcon /> },
    { text: 'Einkaufsliste', path: '/shopping-list', icon: <ShoppingCartIcon /> }
  ];
  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <RestaurantMenuIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
        <Typography variant="h6" component="div" color="primary">
          India's Kochbuch
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={isActive(item.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? theme.palette.primary.main : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={2}
      sx={{ 
        backgroundColor: 'white',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              color="primary"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RestaurantMenuIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              India's Kochbuch
            </Typography>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <>
            <RestaurantMenuIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              India's Kochbuch
            </Typography>
            {navItems.map((item) => (
              <Button 
                key={item.text}
                color="default"
                component={Link} 
                to={item.path}
                sx={{ 
                  mx: 1,
                  fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  backgroundColor: isActive(item.path) ? theme.palette.primary.light : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive(item.path) 
                      ? theme.palette.primary.light 
                      : theme.palette.action.hover,
                  }
                }}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          
          <Container 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              py: { xs: 2, sm: 4 }, 
              px: { xs: 1, sm: 2 },
              mt: 2 
            }}
            maxWidth="lg"
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 2 
              }}
            >
              <Routes>
                <Route path="/" element={<RecipeList />} />
                <Route path="/recipe/:id" element={<RecipeDetailWrapper />} />
                <Route path="/recipe/new" element={<RecipeForm />} />
                <Route path="/recipe/edit/:id" element={<RecipeEditWrapper />} />
                <Route path="/shopping-list" element={<ShoppingList />} />
                <Route path="/example" element={<PancakeExample />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Paper>
          </Container>
          
          <Box 
            component="footer" 
            sx={{ 
              py: { xs: 2, sm: 3 }, 
              px: { xs: 1, sm: 2 }, 
              mt: 'auto', 
              backgroundColor: theme.palette.grey[100],
              textAlign: 'center'
            }}
          >
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