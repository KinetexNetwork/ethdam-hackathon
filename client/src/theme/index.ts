import { createTheme } from '@mui/material';

export const DARK_THEME = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#156AE8',
    },
  },
  typography: {
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,

    h1: {
      fontSize: '2.8rem',
      fontWeight: 700,
      lineHeight: '100%',
    },
    h2: {
      fontSize: '1.3rem',
      fontWeight: 700,
      lineHeight: '100%',
    },
    h3: {
      fontSize: '1.06rem',
      fontWeight: 700,
      lineHeight: '100%',
    },
    h4: {
      fontSize: '0.9375rem',
      fontWeight: 700,
      lineHeight: '100%',
    },
    h5: {
      fontSize: '0.8rem',
      fontWeight: 700,
      lineHeight: '100%',
    },
    subtitle1: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      lineHeight: '100%',
    },
    subtitle2: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      lineHeight: '100%',
    },
    button: {
      fontSize: '0.625rem',
      fontWeight: 500,
      lineHeight: '100%',
      textTransform: 'capitalize',
    },
    body1: {
      fontSize: '1.0625rem',
      fontWeight: 500,
    },
    body2: {
      fontSize: '0.9375rem',
      fontWeight: 400,
    },
  },
});
