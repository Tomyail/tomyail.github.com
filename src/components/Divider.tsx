import { Divider, experimentalStyled } from '@material-ui/core';

export default experimentalStyled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));
