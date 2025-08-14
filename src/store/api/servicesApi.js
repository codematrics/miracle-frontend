import { api } from './apiSlice';

export const servicesApi = api.injectEndpoints({
  endpoints: builder => ({
    getServices: builder.query({
      query: ({ page = 1, limit = 10, search = '', category = '' } = {}) => ({
        url: '/services',
        params: { page, limit, search, category },
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Service', id })),
              { type: 'Service', id: 'LIST' },
            ]
          : [{ type: 'Service', id: 'LIST' }],
      transformResponse: response => ({
        data: response.data || response,
        total: response.total || response.length || 0,
        page: response.page || 1,
        limit: response.limit || 10,
      }),
    }),
    getServiceById: builder.query({
      query: id => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    createService: builder.mutation({
      query: newService => ({
        url: '/services',
        method: 'POST',
        body: newService,
      }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
    updateService: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Service', id },
        { type: 'Service', id: 'LIST' },
      ],
    }),
    deleteService: builder.mutation({
      query: id => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Service', id },
        { type: 'Service', id: 'LIST' },
      ],
    }),
    getServiceCategories: builder.query({
      query: () => '/services/categories',
      providesTags: ['Service'],
    }),
    getServicesByCategory: builder.query({
      query: ({ category, page = 1, limit = 10 }) => ({
        url: `/services/category/${category}`,
        params: { page, limit },
      }),
      providesTags: (result, error, { category }) => [
        { type: 'Service', id: `CATEGORY_${category}` },
      ],
    }),
    getPopularServices: builder.query({
      query: (limit = 10) => ({
        url: '/services/popular',
        params: { limit },
      }),
      providesTags: [{ type: 'Service', id: 'POPULAR' }],
    }),
    toggleServiceStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/services/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Service', id },
        { type: 'Service', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceCategoriesQuery,
  useGetServicesByCategoryQuery,
  useGetPopularServicesQuery,
  useToggleServiceStatusMutation,
  useLazyGetServicesQuery,
  useLazyGetServicesByCategoryQuery,
} = servicesApi;
