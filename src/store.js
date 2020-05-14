import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './reducers/reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [thunkMiddleware, logger];
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

const store = createStore(reducer, enhancer);

export default store;
