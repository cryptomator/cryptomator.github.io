const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./content/**/*.html', './content/**/*.md', './layouts/**/*.html'],
  css: ['**/*.css'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [] // we need to override the default purgecss regex for strange tailwind class names like "md:w-1/2"
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
