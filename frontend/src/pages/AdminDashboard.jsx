import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid2 as Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import Navbar from '../components/Navbar'; // Add this import

// Fix icon imports
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // Fixed typo here
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, postsResponse] = await Promise.all([
        api.get('/user'),
        api.get('/blog')
      ]);
      setUsers(usersResponse.data);
      setPosts(postsResponse.data.blogs);
    } catch (err) {
      setError(err.response?.data.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/user/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.response?.data.message || 'Error deleting user');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await api.delete(`/blog/${blogId}`);
      setPosts(posts.filter(post => post._id !== blogId));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.response?.data.message || 'Error deleting blog');
    }
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewBlog = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const TabPanel = ({ children, value, index }) => (
    <Box hidden={value !== index}>
      {value === index && children}
    </Box>
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Navbar /> {/* Add the Navbar component */}
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}> {/* Added mt: 8 for navbar spacing */}
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4,
            fontWeight: 'bold',
            color: 'primary.main' 
          }}
        >
          Admin Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Total Users', value: users.length, color: 'primary.main' },
            { title: 'Total Posts', value: posts.length, color: 'secondary.main' },
            { 
              title: 'Active Authors', 
              value: users.filter(user => user.role === 'author').length,
              color: 'success.main'
            }
          ].map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography 
                    color="textSecondary" 
                    gutterBottom
                    sx={{ fontSize: '1.1rem' }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{ 
                      color: stat.color,
                      fontWeight: 'bold' 
                    }}
                  >
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Paper elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Users Management" />
            <Tab label="Blog Management" />
          </Tabs>

          {/* Users Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ p: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Add User
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow 
                        key={user._id}
                        sx={{ '&:hover': { backgroundColor: 'grey.50' } }}
                      >
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Typography 
                            sx={{ 
                              color: user.role === 'admin' ? 'primary.main' : 'success.main',
                              fontWeight: 'medium'
                            }}
                          >
                            {user.role}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon color="primary" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => openDeleteDialog(user)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>

          {/* Blogs Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ p: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<PostAddIcon />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Add Blog
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow 
                        key={post._id}
                        sx={{ '&:hover': { backgroundColor: 'grey.50' } }}
                      >
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.author?.username || 'Unknown'}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>
                          <IconButton 
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleViewBlog(post.slug)}
                          >
                            <VisibilityIcon color="info" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon color="primary" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => {
                              setSelectedBlog(post);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>
        </Paper>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>Confirm Delete</DialogTitle>
          <DialogContent sx={{ py: 1 }}>
            <Typography>
              Are you sure you want to delete {selectedUser ? 
                `user ${selectedUser.username}` : 
                `blog "${selectedBlog?.title}"`}?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedUser) {
                  handleDeleteUser(selectedUser._id);
                } else if (selectedBlog) {
                  handleDeleteBlog(selectedBlog._id);
                }
              }}
              variant="contained"
              color="error"
              sx={{ textTransform: 'none' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;