import { Box, CardHeader, Typography, useTheme } from '@material-ui/core';
// import { Link } from 'reach';
import Link from 'gatsby-link';
import get from 'lodash/get';
import React from 'react';

const SubTitleItem = ({ children }) => {
  return <span style={{ margin: '0 2px' }}>{children}</span>;
};

const PostPreview = ({ node }) => {
  const title = get(node, 'frontmatter.title') || node.fields.slug;
  const slug = get(node, 'frontmatter.path');
  const theme = useTheme();
  return (
    <Box>
      <CardHeader
        title={
          <Link
            to={slug}
            style={{
              textDecoration: 'inherit',
              color: theme.palette.primary.main,
            }}
          >
            <div>{title}</div>
          </Link>
        }
        subheader={`${node.frontmatter.date} | ${node.timeToRead} min read`}
      />
      <Box>
        <Typography paragraph variant="body1">
          {node.excerpt}
        </Typography>
        <Typography variant="caption" gutterBottom />
      </Box>
    </Box>
  );
};

export default PostPreview;
