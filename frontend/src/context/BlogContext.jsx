import { createContext, useContext, useState } from 'react';
import api from '../utils/axios';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [categories, setCategories] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBlog, setCurrentBlog] = useState(null);

 

  const fetchBlogs = async (page = 1, limit = 5) => {
    try {
      setLoading(true);
      const params = { 
        page, 
        limit,
        category: searchQuery
      };
      const { data } = await api.get('/blog', { params });
      setBlogs(data.blogs);
      setTotalBlogs(data.total);
      setCurrentPage(page);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  const getBlogBySlug = async (slug) => {
    try {
      setLoading(true);
      const {data} = await api.get(`/blog/${slug}`);      
      setCurrentBlog(data);
    } catch (err) {
      setError(err.response?.data.message || "Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchBlogs(1, 5);
  };

 

  return (
    <BlogContext.Provider value={{
      blogs,
      currentPage,
      totalBlogs,
      loading,
      error,
      fetchBlogs,
      getBlogBySlug,
      handleSearch
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};