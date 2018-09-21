import { createStore, applyMiddleware, StoreEnhancerStoreCreator,Store } from 'redux'
import thunkMiddleware from 'redux-thunk'

import reducer from '../reducers'

let middlewares,
  store;

if (process.env.NODE_ENV === 'production') {
  middlewares = [thunkMiddleware]
} else {
  let createLogger = require('redux-logger').createLogger;
  let loggerMiddleware = createLogger();

  middlewares = [thunkMiddleware, loggerMiddleware]
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore as StoreEnhancerStoreCreator)
const configureStore = (initialState: {}) => createStoreWithMiddleware(reducer, initialState)
store = configureStore({});

export default store as Store;