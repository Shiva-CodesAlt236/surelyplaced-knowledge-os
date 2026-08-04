/**
 * Wires Tailwind CSS v4's PostCSS plugin into the build. Required for
 * `@import "tailwindcss"`, `@source`, `@utility`, and `@theme` in
 * app/globals.css (Tailwind's CSS-first configuration model) to be
 * processed at all — without this file, those at-rules pass through
 * unrecognized and no Tailwind CSS is generated.
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
