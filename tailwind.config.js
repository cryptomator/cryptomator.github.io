module.exports = {
  theme: {
    container: {
      center: true,
      padding: '1rem'
    },
    extend: {
      colors: {
        'primary': '#49B04A',
        'secondary': '#008A7B',
        'tertiary': '#005E71',
        'dark': '#1E2B33', 
      },
      width: {
        'container-md': '768px',
        'container-lg': '1280px',
      },
    },
    fontFamily: {
      'headline': 'Quicksand, sans-serif',
      'body': 'Nunito Sans, sans-serif',
    },
    screens: {
      'md': {'min': '768px'},
      'lg': {'min': '1280px'},
    },
  },
  variants: {},
  plugins: [
    function({ addBase, config }) {
      addBase({
        'h1': { fontSize: config('theme.fontSize.2xl'), fontFamily: config('theme.fontFamily.headline'), fontWeight: config('theme.fontWeight.medium') },
        'h2': { fontSize: config('theme.fontSize.xl'), fontFamily: config('theme.fontFamily.headline'), fontWeight: config('theme.fontWeight.medium') },
        'h3': { fontSize: config('theme.fontSize.lg'), fontFamily: config('theme.fontFamily.headline'), fontWeight: config('theme.fontWeight.medium') },
      })
    }
  ],
}
