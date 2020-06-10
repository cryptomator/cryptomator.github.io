module.exports = {
  theme: {
    extend: {}
  },
  variants: {
    appearance: []
  },
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}
