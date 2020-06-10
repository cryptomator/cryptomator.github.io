module.exports = {
  purge: {
    enabled: process.env.HUGO_ENV !== 'development',
    content: [
      './content/**/*.html',
      './content/**/*.md',
      './layouts/**/*.html',
    ],
    options: {
      whitelist: [
        'hover:border-white',
        'StripeElement',
        'StripeElement--focus',
      ],
    },
  },
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        'primary': '#49B04A',
        'primary-l2': '#EBF5EB',
        'secondary': '#008A7B',
        'tertiary': '#005E71',
        'dark': '#1E2B33', 
      },
      fontSize: {
        '7xl': '5rem',
      },
    },
    fontFamily: {
      'headline': 'Quicksand, sans-serif',
      'body': 'Open Sans, sans-serif',
    },
    screens: {
      'md': { 'min': '768px' },
      'lg': { 'min': '1280px' },
    },
  },
  variants: {},
  plugins: [],
}
