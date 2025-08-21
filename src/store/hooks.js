import { useDispatch, useSelector } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Custom auth hooks for better UX
export const useAuth = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  return {
    // Current state
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    successMessage: auth.successMessage,

    // Legacy compatibility
    authState: auth.auth,
    showLoading: auth.showLoading,
    errorMessage: auth.errorMessage,

    // Actions
    dispatch,
  };
};

// Custom posts hooks
export const usePosts = () => {
  const posts = useAppSelector(state => state.posts);
  const dispatch = useAppDispatch();

  return {
    posts: posts.posts,
    loading: posts.loading,
    error: posts.error,
    currentPost: posts.currentPost,
    dispatch,
  };
};

// Custom todos hooks
export const useTodos = () => {
  const todos = useAppSelector(state => state.todos);
  const dispatch = useAppDispatch();

  const activeTodos = todos.todos.filter(todo => !todo.completed);
  const completedTodos = todos.todos.filter(todo => todo.completed);

  return {
    todos: todos.todos,
    activeTodos,
    completedTodos,
    filter: todos.filter,
    loading: todos.loading,
    error: todos.error,
    dispatch,
  };
};

// Generic selector hook for performance
export const useAppSelectorMemo = (selector, equalityFn) => useAppSelector(selector, equalityFn);

// Loading state hook
export const useLoadingState = () => {
  return useAppSelector(state => ({
    auth: state.auth.loading,
    posts: state.posts.loading,
    todos: state.todos.loading,
  }));
};

// Error state hook
export const useErrorState = () => {
  return useAppSelector(state => ({
    auth: state.auth.error,
    posts: state.posts.error,
    todos: state.todos.error,
  }));
};

// Combined loading hook for global loading indicator
export const useGlobalLoading = () => {
  const loadingStates = useLoadingState();
  return Object.values(loadingStates).some(loading => loading);
};

// Combined error hook for global error handling
export const useGlobalError = () => {
  const errorStates = useErrorState();
  return Object.values(errorStates).find(error => error) || null;
};
