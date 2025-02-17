import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Divider,
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import Navbar from '../components/Navbar'; // Add this import

const BlogDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data } = await api.get(`/blog/${slug}`);
      setBlog(data);
      setIsLiked(data.likes.includes(user?._id));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/blog/${slug}/comments`);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/blog/${slug}/comments`, {
        content: comment
      });
      
      setComments([{
        ...data,
        user: {
          _id: user._id,
          username: user.username,
          photo: user.photo
        }
      }, ...comments]);
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // First check if user is authenticated and is comment owner
      const commentToDelete = comments.find(c => c._id === commentId);
      if (!user || user._id !== commentToDelete?.user?._id) {
        setFeedback({
          open: true,
          message: 'You are not authorized to delete this comment',
          severity: 'error'
        });
        return;
      }

      // Optimistically remove comment from UI
      setComments(prevComments => prevComments.filter(c => c._id !== commentId));

      // Make API call to delete comment
      await api.delete(`/blog/${slug}/comments/${commentId}`);
      
      setFeedback({
        open: true,
        message: 'Comment deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      // Revert the optimistic update if API call fails
      const { response } = error;
      console.error('Error deleting comment:', error);
      
      // Restore the comment in UI
      const commentToRestore = comments.find(c => c._id === commentId);
      if (commentToRestore) {
        setComments(prevComments => [...prevComments, commentToRestore]);
      }

      setFeedback({
        open: true,
        message: response?.data?.message || 'Failed to delete comment',
        severity: 'error'
      });
    }
  };

  const handleCloseFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  const handleLike = async () => {
    if (!user) {
      setFeedback({
        open: true,
        message: 'Please login to like this blog',
        severity: 'info'
      });
      return;
    }

    try {
      // Optimistically update UI
      const newIsLiked = !isLiked;
      const updatedLikes = newIsLiked 
        ? [...(blog.likes || []), user._id]
        : (blog.likes || []).filter(id => id !== user._id);

      // Update local state immediately for better UX
      setBlog(prev => ({
        ...prev,
        likes: updatedLikes
      }));
      setIsLiked(newIsLiked);

      // Make API call to toggle like
      await api.post(`/blog/${slug}/like`);
      
      setFeedback({
        open: true,
        message: newIsLiked ? 'Blog liked' : 'Blog unliked',
        severity: 'success'
      });
    } catch (error) {
      // Revert changes if request fails
      const revertedLikes = isLiked 
        ? [...(blog.likes || []), user._id]
        : (blog.likes || []).filter(id => id !== user._id);
      
      setBlog(prev => ({
        ...prev,
        likes: revertedLikes
      }));
      setIsLiked(!isLiked);
      
      setFeedback({
        open: true,
        message: 'Failed to update like',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ pt: 8 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Hero Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
              {blog.title}
            </Typography>

            {/* Author Info - Updated */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 2
              }}
            >
              <Avatar 
                src={blog.author?.photo} 
                alt={blog.author?.username}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  {blog.author?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {blog.author?.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Published on {format(new Date(blog.createdAt), 'MMM dd, yyyy')} • 
                  {blog.readTime || '5 min read'}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleLike}
                variant={isLiked ? "contained" : "outlined"}
                color={isLiked ? "error" : "primary"}
                size="small"
              >
                {blog.likes?.length || 0} {isLiked ? 'Liked' : 'Like'}
              </Button>
              <IconButton>
                <BookmarkIcon />
              </IconButton>
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Box>

            {/* Featured Image */}
            {blog.featuredImage && (
              <Box 
                component="img"
                src={blog.featuredImage}
                alt={blog.title}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 4
                }}
              />
            )}

            {/* Blog Content */}
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.2rem',
                lineHeight: 1.8,
                mb: 6
              }}
            >
              {blog.content}
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Comments Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Comments ({comments.length})
              </Typography>

              {user ? (
                <Box component="form" onSubmit={handleComment} sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained"
                    disabled={!comment.trim()}
                  >
                    Post Comment
                  </Button>
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Please login to comment
                </Typography>
              )}

              {/* Comments List */}
              <Box sx={{ mt: 4 }}>
                {comments.map((comment) => (
                  <Card key={comment._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start' 
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            src={comment.user?.photo} 
                            alt={comment.user?.username}
                            sx={{ width: 40, height: 40, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {comment.user?.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                            </Typography>
                          </Box>
                        </Box>
                        {user?._id === comment.user?._id && (
                          <IconButton 
                            size="small"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <DeleteIcon color="error" fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                      <Typography variant="body2">
                        {comment.content}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Snackbar 
        open={feedback.open} 
        autoHideDuration={6000} 
        onClose={handleCloseFeedback}
      >
        <Alert 
          onClose={handleCloseFeedback} 
          severity={feedback.severity}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BlogDetail;