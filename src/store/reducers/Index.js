import { combineReducers } from 'redux';

import todoReducers from './Reducers';

const rootReducers = combineReducers({
  todoReducers,
});

export default rootReducers;
