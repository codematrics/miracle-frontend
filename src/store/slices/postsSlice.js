import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  createPost,
  deletePost,
  formatPosts,
  getPosts,
  updatePost,
} from '../../services/PostsService';

// Async thunks for posts operations
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
  try {
    const response = await getPosts();
    return formatPosts(response.data);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createNewPost = createAsyncThunk(
  'posts/createPost',
  async ({ postData, navigate }, { rejectWithValue }) => {
    try {
      const response = await createPost(postData);
      const singlePost = {
        ...postData,
        id: response.data.name,
      };
      if (navigate) {
        navigate('/postpage');
      }
      return singlePost;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExistingPost = createAsyncThunk(
  'posts/updatePost',
  async ({ post, navigate }, { rejectWithValue }) => {
    try {
      await updatePost(post, post.id);
      if (navigate) {
        navigate('/postpage');
      }
      return post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removePost = createAsyncThunk(
  'posts/deletePost',
  async ({ postId, navigate }, { rejectWithValue }) => {
    try {
      await deletePost(postId);
      if (navigate) {
        navigate('/postpage');
      }
      return postId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  posts: [],
  loading: false,
  error: null,
  currentPost: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: state => {
      state.currentPost = null;
    },
    // Legacy action for backward compatibility
    addPost: (state, action) => {
      const post = {
        id: Math.random(),
        title: 'Post Title 2asdasd',
        description: 'Sample Description 2asdasdas',
      };
      state.posts.push(post);
    },
  },
  extraReducers: builder => {
    builder
      // Fetch posts cases
      .addCase(fetchPosts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create post cases
      .addCase(createNewPost.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createNewPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update post cases
      .addCase(updateExistingPost.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updateExistingPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete post cases
      .addCase(removePost.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post.id !== action.payload);
      })
      .addCase(removePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError, setCurrentPost, clearCurrentPost, addPost } = postsSlice.actions;

// Selectors
export const selectPosts = state => state.posts.posts;
export const selectPostsLoading = state => state.posts.loading;
export const selectPostsError = state => state.posts.error;
export const selectCurrentPost = state => state.posts.currentPost;

// Get post by ID selector
export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId);

export default postsSlice.reducer;
