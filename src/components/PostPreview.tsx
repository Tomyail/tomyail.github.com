import get from 'lodash/get';
import React from 'react';
import {
  Card,
  CardContent,
  withStyles,
  Typography,
  CardMedia,
  CardActionArea,
  CardHeader,
  Chip,
  CardActions,
  Button,
  Grid
} from '@material-ui/core';
// import { Link } from 'reach';
import Link from 'gatsby-link';
import { withTheme, Theme } from '@material-ui/core/styles';

const SubTitleItem = ({ children }) => {
  return <span style={{ margin: '0 2px' }}>{children}</span>;
};

const styles = theme => {
  return {
    card: {
      margin: theme.spacing(1, 0)
    },
    action: {},
  }
};

const PostPreview = ({ node, classes, theme }: { theme: Theme }) => {
  const title = get(node, 'frontmatter.title') || node.fields.slug;
  const slug = get(node, 'frontmatter.path');
  return (
    <Card className={classes.card}>
      <CardHeader
        title={
          <Link to={slug} style={{ textDecoration: 'inherit', color: theme.palette.primary.main }}>
            <div>{title}</div>
          </Link>
        }
        subheader={`${node.frontmatter.date} | ${node.timeToRead} min read`}
      // action={ <Chip variant="outlined" label="Awesome Chip Component"/>}
      />
      <CardContent>
        <Typography paragraph variant="body1">
          {node.excerpt}
        </Typography>
        <Typography variant="caption" gutterBottom />
      </CardContent>
    </Card>
  );
};

export default withTheme(withStyles(styles)(PostPreview));
