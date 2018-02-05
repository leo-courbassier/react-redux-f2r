import thunkMiddleware from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, compose(
    applyMiddleware(
      thunkMiddleware
    )
    )
  );
}
