import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Pagination,
  Paper,
  Grid2 as Grid,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import BlogList from '../components/BlogList';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import debounce from 'lodash.debounce';

const ITEMS_PER_PAGE = 5;

const categories = [
  'Technology',
  'Programming',
  'Web Development',
  'Machine Learning',
  'Data Science',
  'Mobile Development'
];

const Home = () => {
  const { user } = useAuth();
  const {
    blogs,
    loading,
    error,
    currentPage,
    totalBlogs,
    fetchBlogs,
    selectedCategory,
    handleCategorySelect,
    handleSearch,
    searchQuery
  } = useBlog();

  useEffect(() => {
    fetchBlogs(1, ITEMS_PER_PAGE);
  }, []);

  const handlePageChange = (event, page) => {
    fetchBlogs(page, ITEMS_PER_PAGE);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(totalBlogs / ITEMS_PER_PAGE);

  // Sort blogs based on views for popular blogs section
  const popularBlogs = [...blogs].sort((a, b) => b.views - a.views).slice(0, 5);

  // Add debounce for search
  const debouncedSearch = useCallback(
    debounce((query) => {
      handleSearch(query);
    }, 500),
    []
  );

  const handleSearchChange = (event) => {
    console.log(event.target.value);
    
    debouncedSearch(event.target.value);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        {user ? (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Left Side - Blog List */}
            <Box sx={{ flex: { md: '0 0 66.666667%' } }}>
              {/* Search Bar */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search blogs..."
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={handleSearchChange}
              />

              <Typography variant="h4" component="h1" gutterBottom>
                {selectedCategory ? `${selectedCategory} Blogs` : 'Latest Blogs'} 
                {searchQuery && ` • Search: "${searchQuery}"`}
                ({totalBlogs} total)
              </Typography>

              {loading && <Typography>Loading blogs...</Typography>}
              {error && <Typography color="error">{error}</Typography>}

              <BlogList blogs={blogs} />

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </Box>

            {/* Right Side - Categories and Popular Blogs */}
            <Box 
              sx={{ 
                flex: { md: '0 0 33.333333%' },
                position: { md: 'sticky' },
                top: '100px',
                height: 'fit-content',
                alignSelf: 'flex-start'
              }}
            >
              {/* Categories Section */}
              <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <LabelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Categories
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => handleCategorySelect(category)}
                      color={selectedCategory === category ? "primary" : "default"}
                      sx={{
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white'
                        }
                      }}
                    />
                  ))}
                </Stack>
              </Paper>

              {/* Popular Blogs Section */}
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <WhatshotIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Popular Blogs
                </Typography>
                <List>
                  {popularBlogs.map((blog, index) => (
                    <React.Fragment key={blog._id}>
                      <ListItem
                        button
                        component={RouterLink}
                        to={`/blog/${blog.slug}`}
                        sx={{ px: 0 }}
                      >
                        <ListItemText
                          primary={blog.title}
                          secondary={`By ${blog.author?.username} • ${format(new Date(blog.createdAt), 'MMM dd, yyyy')} • ${blog.views || 0} views`}
                          primaryTypographyProps={{
                            variant: 'subtitle2',
                            color: 'primary'
                          }}
                        />
                      </ListItem>
                      {index < popularBlogs.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 2
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome to BlogForge
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Please sign in to view and interact with blogs.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;
