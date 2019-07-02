import React from 'react';
import { Provider } from 'react-redux';

import createStore from './src/redux/store/createStore';
import withRoot from './src/withRoot';
// import createStore from './src/state/createStore'

const store = createStore();
const WithRoot = withRoot(props => props.children);
// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => {

  return (
    <Provider store={store}>
      <WithRoot>{element}</WithRoot>
    </Provider>
  );
};
