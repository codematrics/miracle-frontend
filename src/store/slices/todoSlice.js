import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  todos: [],
  filter: 'all', // 'all', 'active', 'completed'
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        state.todos.push(action.payload);
      },
      prepare: data => ({
        payload: {
          id: nanoid(),
          data,
          completed: false,
          createdAt: Date.now(),
        },
      }),
    },
    toggleTodo: (state, action) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    updateTodo: (state, action) => {
      const { id, updates } = action.payload;
      const todo = state.todos.find(todo => todo.id === id);
      if (todo) {
        Object.assign(todo, updates);
      }
    },
    clearCompletedTodos: state => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    clearAllTodos: state => {
      state.todos = [];
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    // Legacy actions for backward compatibility
    legacyAddTodo: (state, action) => {
      const { id, data } = action.payload;
      state.todos.push({
        id,
        data,
        completed: false,
        createdAt: Date.now(),
      });
    },
    legacyDeleteTodo: (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    legacyRemoveTodos: state => {
      state.todos = [];
    },
  },
});

// Export actions
export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  clearCompletedTodos,
  clearAllTodos,
  setFilter,
  legacyAddTodo,
  legacyDeleteTodo,
  legacyRemoveTodos,
} = todoSlice.actions;

// Selectors
export const selectAllTodos = state => state.todos.todos;
export const selectTodosFilter = state => state.todos.filter;
export const selectTodosLoading = state => state.todos.loading;
export const selectTodosError = state => state.todos.error;

// Filtered todos selectors
export const selectFilteredTodos = state => {
  const { todos, filter } = state.todos;
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const selectActiveTodosCount = state =>
  state.todos.todos.filter(todo => !todo.completed).length;

export const selectCompletedTodosCount = state =>
  state.todos.todos.filter(todo => todo.completed).length;

// Legacy selector for backward compatibility
export const selectLegacyTodos = state => ({
  list: state.todos.todos,
});

export default todoSlice.reducer;
