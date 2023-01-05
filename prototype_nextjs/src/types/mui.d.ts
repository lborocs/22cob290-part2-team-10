import type { } from '@mui/material';

/**
 * @see https://mui.com/material-ui/customization/theming/#custom-variables
 * @see https://mui.com/material-ui/customization/palette/#adding-new-colors
 * @see https://mui.com/material-ui/experimental-api/css-theme-variables/customization/#typescript
 */
declare module '@mui/material/styles' {
  interface Theme {
  }

  interface Palette {
    light: Palette['primary'];
    dark: Palette['primary'];
    contrast: Palette['primary']; // contrast to theme
    makeItAllGrey: Palette['primary'];
    makeItAllOrange: Palette['primary'];
  }
  interface PaletteOptions {
    light?: PaletteOptions['primary'];
    dark?: PaletteOptions['primary'];
    contrast?: PaletteOptions['primary'];
    makeItAllGrey?: PaletteOptions['primary'];
    makeItAllOrange?: PaletteOptions['primary'];
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
  }
}

interface ColorOverrides {
  light: true;
  dark: true;
  contrast: true;
  makeItAllGrey: true;
  makeItAllOrange: true;
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/CircularProgress' {
  interface CircularProgressPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/FormLabel' {
  interface FormLabelPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/InputBase' {
  interface InputBasePropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides extends ColorOverrides { }
}
