// import React from 'react'
// import { Provider } from 'react-redux'
// import { renderToString } from 'react-dom/server'

// import createStore from './src/redux/store/createStore'

// export const constreplaceRenderer = ({
//   bodyComponent,
//   replaceBodyHTMLString,
// }) => {
//   const store = createStore()

//   const ConnectedBody = () => <Provider store={store}>{bodyComponent}</Provider>
//   replaceBodyHTMLString(renderToString(<ConnectedBody />))
// }

import wrapWithProvider from './wrap-with-provider'
export const wrapRootElement = wrapWithProvider
