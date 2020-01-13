const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./content/**/*.html', './layouts/**/*.html'],
  css: ['**/*.css']
})

module.exports = {
  theme: {
    extend: {}
  },
  variants: {
    appearance: []
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    ...process.env.HUGO_ENV === 'development'
      ? []
      : [purgecss]
  ]
}
