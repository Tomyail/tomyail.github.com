import {
  createStore as reduxCreateStore,
  applyMiddleware,
  compose
} from 'redux';
import reducer from '../reducers';

import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from '../epics';

const epicMiddleware = createEpicMiddleware();

const composeEnhancers =
  typeof window !== `undefined`
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

const createStore = () =>
  reduxCreateStore(reducer, composeEnhancers(applyMiddleware(epicMiddleware)));
epicMiddleware.run(rootEpic);
export default createStore;
