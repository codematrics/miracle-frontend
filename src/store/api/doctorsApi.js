import { api } from './apiSlice';

export const doctorsApi = api.injectEndpoints({
  endpoints: builder => ({
    getDoctorsDropdown: builder.query({
      query: ({ specialization, department, isConsultant } = {}) => {
        const params = new URLSearchParams();
        if (specialization) params.append('specialization', specialization);
        if (department) params.append('department', department);
        if (isConsultant !== undefined) params.append('isConsultant', isConsultant.toString());

        return {
          url: `/doctors/dropdown${params.toString() ? `?${params.toString()}` : ''}`,
        };
      },
      providesTags: [{ type: 'Doctor', id: 'DROPDOWN' }],
      transformResponse: response => ({
        success: response.success || true,
        data: response.data || [],
        total: response.total || 0,
      }),
    }),
    getDoctors: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = '',
        specialization = '',
        department = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = {}) => ({
        url: '/doctors',
        params: { page, limit, search, specialization, department, sortBy, sortOrder },
      }),
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Doctor', id })),
              { type: 'Doctor', id: 'LIST' },
            ]
          : [{ type: 'Doctor', id: 'LIST' }],
    }),
    getDoctorById: builder.query({
      query: id => `/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Doctor', id }],
    }),
    createDoctor: builder.mutation({
      query: newDoctor => ({
        url: '/doctors',
        method: 'POST',
        body: newDoctor,
      }),
      invalidatesTags: [
        { type: 'Doctor', id: 'LIST' },
        { type: 'Doctor', id: 'DROPDOWN' },
      ],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/doctors/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Doctor', id },
        { type: 'Doctor', id: 'LIST' },
        { type: 'Doctor', id: 'DROPDOWN' },
      ],
    }),
    deleteDoctor: builder.mutation({
      query: id => ({
        url: `/doctors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Doctor', id },
        { type: 'Doctor', id: 'LIST' },
        { type: 'Doctor', id: 'DROPDOWN' },
      ],
    }),
  }),
});

export const {
  useGetDoctorsDropdownQuery,
  useLazyGetDoctorsDropdownQuery,
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorsApi;
