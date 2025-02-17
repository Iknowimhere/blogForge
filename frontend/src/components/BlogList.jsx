import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  Divider,
  Stack
} from '@mui/material';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react';

const BlogList = ({ blogs }) => {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {blogs.map((blog, index) => (
        <React.Fragment key={blog._id}>
          <ListItem 
            alignItems="flex-start"
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            {/* Blog Image */}
            {blog.featuredImage && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <Box
                  component="img"
                  src={blog.featuredImage}
                  alt={blog.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 1
                  }}
                />
              </Box>
            )}

            {/* Blog Content */}
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Typography variant="h5" color="primary">
                <RouterLink to={`/blog/${blog.slug}`} sx={{textDecoration:"none"}}>{blog.title}</RouterLink>
              </Typography>

              <Typography variant="body1" color="text.secondary">
                {blog.content.substring(0, 200)}...
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="caption" color="text.secondary">
                  By {blog.author?.username || 'Unknown'} • 
                  {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                </Typography>

                <Box>
                  <Button
                    size="small"
                    startIcon={<FavoriteIcon />}
                    sx={{ mr: 1 }}
                  >
                    {blog.likes?.length || 0}
                  </Button>
                  <Button
                    component={RouterLink}
                    to={`/blog/${blog.slug}`}
                    size="small"
                    variant="outlined"
                  >
                    Read More
                  </Button>
                </Box>
              </Box>
            </Stack>
          </ListItem>
          {index < blogs.length - 1 && (
            <Divider component="li" />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default BlogList;
