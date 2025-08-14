import { api } from './apiSlice';

export const postsApi = api.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => ({
        url: '/posts',
        params: { page, limit, search },
      }),
      providesTags: (result, error, arg) =>
        result
          ? [...result.data.map(({ id }) => ({ type: 'Post', id })), { type: 'Post', id: 'LIST' }]
          : [{ type: 'Post', id: 'LIST' }],
      transformResponse: (response, meta, arg) => {
        // Transform the response to match the expected format
        return {
          data: response.data || response,
          total: response.total || response.length || 0,
          page: response.page || arg.page || 1,
          limit: response.limit || arg.limit || 10,
        };
      },
    }),
    getPostById: builder.query({
      query: id => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation({
      query: newPost => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
      transformResponse: (response, meta, arg) => ({
        ...arg,
        id: response.data?.id || response.id || Date.now(),
        createdAt: new Date().toISOString(),
      }),
    }),
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    deletePost: builder.mutation({
      query: id => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    getPostsByCategory: builder.query({
      query: ({ category, page = 1, limit = 10 }) => ({
        url: '/posts/category',
        params: { category, page, limit },
      }),
      providesTags: (result, error, { category }) => [{ type: 'Post', id: `CATEGORY_${category}` }],
    }),
    getPostsByAuthor: builder.query({
      query: ({ authorId, page = 1, limit = 10 }) => ({
        url: '/posts/author',
        params: { authorId, page, limit },
      }),
      providesTags: (result, error, { authorId }) => [{ type: 'Post', id: `AUTHOR_${authorId}` }],
    }),
    searchPosts: builder.query({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: '/posts/search',
        params: { q: query, page, limit },
      }),
      providesTags: (result, error, { query }) => [{ type: 'Post', id: `SEARCH_${query}` }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostsByCategoryQuery,
  useGetPostsByAuthorQuery,
  useSearchPostsQuery,
  useLazyGetPostsQuery,
  useLazySearchPostsQuery,
} = postsApi;
