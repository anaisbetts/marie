import type { TypographyOptions } from 'typography';
import Typography from 'typography';
import themeOptions from 'typography-theme-moraga';

const theme: TypographyOptions = {
  ...themeOptions,
  headerFontFamily: ['Martel Sans', 'sans-serif'],
  headerWeight: 200,
  googleFonts: [
    ...themeOptions.googleFonts,
    {
      name: 'Martel Sans',
      styles: ['200'],
    },
  ],
};

// Let's handle this in CSS instead
delete theme.bodyColor;
delete theme.headerColor;

export const typography = new Typography(theme);
