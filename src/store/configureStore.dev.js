import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

export default function configureStore(initialState) {
  let store = createStore(rootReducer, initialState, compose(

    applyMiddleware(
      thunkMiddleware,
      //loggerMiddleware
    ),

    window.devToolsExtension ? window.devToolsExtension() : f => f //add support for Redux dev tools
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
