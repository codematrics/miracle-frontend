import { configureStore } from '@reduxjs/toolkit';

import { api } from './api/apiSlice';
import authSlice from './slices/authSlice';
import postsSlice from './slices/postsSlice';
import todoSlice from './slices/todoSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    todos: todoSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// TypeScript type exports (for future TypeScript migration)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
