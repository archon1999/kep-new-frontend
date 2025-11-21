import { Components, Theme } from '@mui/material/styles';

const Card: Components<Omit<Theme, 'components'>>['MuiCard'] = {
  defaultProps: {
    variant: 'elevation',
    background: 1,
  },
  styleOverrides: {
    root: {
      outline: 'none',
      borderRadius: 3,
    },
  },
};

export default Card;
