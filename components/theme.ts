import type { TypographyOptions } from 'typography';
import Typography from 'typography';
import themeOptions from 'typography-theme-moraga';

export const typography = new Typography({
  ...themeOptions,
  headerFontFamily: ['Martel Sans', 'sans-serif'],
  headerWeight: 400,
  googleFonts: [
    ...themeOptions.googleFonts,
    {
      name: 'Martel Sans',
      styles: ['400'],
    },
  ],
});
