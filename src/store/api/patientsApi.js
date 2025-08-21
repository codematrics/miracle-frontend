import { api } from './apiSlice';

export const patientsApi = api.injectEndpoints({
  endpoints: builder => ({
    getPatients: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = '',
        status = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = {}) => ({
        url: '/patients',
        params: { page, limit, search, status, sortBy, sortOrder },
      }),
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Patient', id })),
              { type: 'Patient', id: 'LIST' },
            ]
          : [{ type: 'Patient', id: 'LIST' }],
      transformResponse: response => ({
        data: response.data || response,
        total: response.total || response.length || 0,
        page: response.page || 1,
        limit: response.limit || 10,
      }),
    }),
    getPatientById: builder.query({
      query: id => `/patients/${id}`,
      providesTags: (result, error, id) => [{ type: 'Patient', id }],
    }),
    createPatient: builder.mutation({
      query: newPatient => ({
        url: '/patients',
        method: 'POST',
        body: newPatient,
      }),
      invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
    }),
    updatePatient: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/patients/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Patient', id },
        { type: 'Patient', id: 'LIST' },
      ],
    }),
    deletePatient: builder.mutation({
      query: id => ({
        url: `/patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Patient', id },
        { type: 'Patient', id: 'LIST' },
      ],
    }),
    getPatientHistory: builder.query({
      query: ({ patientId, page = 1, limit = 10 }) => ({
        url: `/patients/${patientId}/history`,
        params: { page, limit },
      }),
      providesTags: (result, error, { patientId }) => [
        { type: 'Patient', id: `HISTORY_${patientId}` },
      ],
    }),
    addPatientVisit: builder.mutation({
      query: ({ patientId, visitData }) => ({
        url: `/patients/${patientId}/visits`,
        method: 'POST',
        body: visitData,
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'Patient', id: patientId },
        { type: 'Patient', id: `HISTORY_${patientId}` },
      ],
    }),
    updatePatientVisit: builder.mutation({
      query: ({ patientId, visitId, visitData }) => ({
        url: `/patients/${patientId}/visits/${visitId}`,
        method: 'PUT',
        body: visitData,
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'Patient', id: patientId },
        { type: 'Patient', id: `HISTORY_${patientId}` },
      ],
    }),
    getPatientStats: builder.query({
      query: () => '/patients/stats',
      providesTags: [{ type: 'Patient', id: 'STATS' }],
    }),
    searchPatients: builder.query({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: '/patients/search',
        params: { q: query, page, limit },
      }),
      providesTags: (result, error, { query }) => [{ type: 'Patient', id: `SEARCH_${query}` }],
    }),
    getRecentPatients: builder.query({
      query: (limit = 5) => ({
        url: '/patients/recent',
        params: { limit },
      }),
      providesTags: [{ type: 'Patient', id: 'RECENT' }],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useGetPatientHistoryQuery,
  useAddPatientVisitMutation,
  useUpdatePatientVisitMutation,
  useGetPatientStatsQuery,
  useSearchPatientsQuery,
  useGetRecentPatientsQuery,
  useLazyGetPatientsQuery,
  useLazySearchPatientsQuery,
} = patientsApi;
