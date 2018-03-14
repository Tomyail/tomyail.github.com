import React from 'react';
import PropTypes from 'prop-types';
import './prism.css';
import Header from '../components/Header';

const TemplateWrapper = ({ children }) => {
  return (
    <div>
      <Header />
      <div
        style={{
          margin: '0 auto',
          maxWidth: 960,
          padding: '0px 1.0875rem 1.45rem',
          paddingTop: 0
        }}
      >
        {children()}
      </div>
    </div>
  );
};

TemplateWrapper.propTypes = {
  children: PropTypes.func
};

export const query = graphql`
  query TemplateWrapperQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default TemplateWrapper;
