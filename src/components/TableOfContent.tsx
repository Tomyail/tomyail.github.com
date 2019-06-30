import { withStyles } from '@material-ui/core';
import * as React from 'react';

const style = theme => {
  return {
    root: {
      color: theme.palette.text.secondary,
      width: '20%',
      '& ul': {
        position: 'sticky',
        top: '50px'
      },
      '& a':{
        color:theme.palette.text.primary,
        textDecoration: 'inherit',
      },
      '& a:hover': {
        color:theme.palette.action.active,
        textDecoration: 'underline',
      },
    }
  };
};

interface StyledProps {
  classes: any;
}
interface TableOfContentProps extends StyledProps {
  content: string;
}
const TableOfContent: React.SFC<TableOfContentProps> = props => {
  return (
    <nav
      className={props.classes.root}
      dangerouslySetInnerHTML={{
        __html: props.content
      }}
    />
  );
};

export default withStyles(style)(TableOfContent);
