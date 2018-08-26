import React from 'react';
import Link from 'gatsby-link';

import { rhythm, scale } from '../utils/typography';
import './prism.css';
import get from 'lodash/get';
import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import './index.css';
import { graphql } from 'gatsby';

class Layout extends React.Component {
  render() {
    const { location, children } = this.props;
    let header;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');

    let rootPath = `/`;
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + `/`;
    }

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit'
            }}
            to={'/'}
          >
            {siteTitle}
          </Link>
        </h1>
      );
    } else {
      header = (
        <h3
          style={{
            marginTop: 0,
            marginBottom: rhythm(-1)
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit'
            }}
            to={'/'}
          >
            {siteTitle}
          </Link>
        </h3>
      );
    }
    return (
      <div
        style={{
          maxWidth: rhythm(28),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
        }}
      >
        {header}
        {children()}
      </div>
    );
  }
}

export const pageQuery = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        author
        siteUrl
      }
    }
  }
`;

export default Layout;
