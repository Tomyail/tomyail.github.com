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
  ListItem,
  Chip,
  CardActions,
  Button,
  Grid
} from '@material-ui/core';
// import { Link } from 'reach';
import Link from 'gatsby-link';

const SubTitleItem = ({ children }) => {
  return <span style={{ margin: '0 2px' }}>{children}</span>;
};

const styles = {
  card: {},
  action: {},
  listItem: {
    maxWidth: '800px',
    margin: '0 autp'
  }
};

{
  /* <Link style={{ boxShadow: 'none' }} to={slug}>
{title}
</Link> */
}
const renderCount = slug => {
  return;
  //   return get(this, `props.postView[${slug}].time`);
};
const PostPreview = ({ node, classes }) => {
  const title = get(node, 'frontmatter.title') || node.fields.slug;
  const slug = get(node, 'frontmatter.path');
  return (
    <Grid
      item
      container
      xs={10}
      direction="column"
      justify="center"
      alignItems="stretch"
    >
      <Card className={classes.card}>
        <CardActionArea href={slug}>
          {/* <CardMedia
          component="img"
            image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
            title="Contemplative Reptile"
          /> */}
          <CardHeader
            title={title}
            subheader={`${node.frontmatter.date} | ${node.timeToRead} min read`}
            // action={ <Chip variant="outlined" label="Awesome Chip Component"/>}
          />
          <CardContent>
            <Typography paragraph variant="body1">
              {node.excerpt}
            </Typography>
            <Typography variant="caption" gutterBottom />
          </CardContent>
        </CardActionArea>

        <CardActions>
          <Button variant="outlined">Reaad More</Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default withStyles(styles)(PostPreview);
