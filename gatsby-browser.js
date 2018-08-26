// import React from 'react'
// import { Router } from 'react-router-dom'
// import { Provider } from 'react-redux'

// import createStore from './src/redux/store/createStore'

// // export const onClientEntry = () => ({
// //   require('babel-polyfill');
// // });
// export const replaceRouterComponent = ({ history }) => {
//   const store = createStore()

//   const ConnectedRouterWrapper = ({ children }) => (
//     <Provider store={store}>
//       <Router history={history}>{children}</Router>
//     </Provider>
//   )

//   return ConnectedRouterWrapper
// }

import wrapWithProvider from './wrap-with-provider'
export const wrapRootElement = wrapWithProvider
