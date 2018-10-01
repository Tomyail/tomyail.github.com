// import wrapWithProvider from './wrap-with-provider';

// import React from 'react';
// import { renderToString } from 'react-dom/server';
// import JssProvider from 'react-jss/lib/JssProvider';
// import getPageContext from './src/getPageContext';

// // export const wrapRootElement = wrapWithProvider;
// export const replaceRenderer = ({
//   bodyComponent,
//   replaceBodyHTMLString,
//   setHeadComponents
// }) => {
//   // Get the context of the page to collected side effects.
//   const muiPageContext = getPageContext();

//   console.log('!!!!!!!!!!replaceRenderer');
//   debugger;
//   const bodyHTML = renderToString(
//     <JssProvider registry={muiPageContext.sheetsRegistry}>
//       {bodyComponent}
//     </JssProvider>
//   );

//   replaceBodyHTMLString(bodyHTML);
//   setHeadComponents([
//     <style
//       type="text/css"
//       id="jss-server-side"
//       key="jss-server-side"
//       dangerouslySetInnerHTML={{
//         __html: muiPageContext.sheetsRegistry.toString()
//       }}
//     />
//   ]);
// };

// It's not ready yet: https://github.com/gatsbyjs/gatsby/issues/8237.
//
// const withRoot = require('./src/withRoot').default;
// const WithRoot = withRoot(props => props.children);

// exports.wrapRootElement = ({ element }) => {
//   return <WithRoot>{element}</WithRoot>;
// };
