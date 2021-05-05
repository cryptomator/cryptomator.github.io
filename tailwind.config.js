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
      animation: {
        hover: 'hover 10s ease-in-out infinite',
      },
      keyframes: {
        hover: {
          '0%, 100%': { transform: 'rotate(0deg) translateY(0)' },
          '50%': { transform: 'rotate(-3deg) translateY(-10px)' },
        },
      },
      // TODO: deprecate with tailwind 2.x
      fontSize: {
        '7xl': '4.5rem',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      width: {
        'max': 'max-content',
      },
    },
    fontFamily: {
      'headline': 'Quicksand, sans-serif',
      'body': 'Open Sans, sans-serif',
    },
    screens: {
      'md': '768px',
      'lg': '1280px',
    },
    typography: (theme) => ({
      default: {
        css: {
          a: {
            color: theme('colors.primary'),
            textDecoration: 'none',
            '&:hover': {
              color: theme('colors.primary'),
              textDecoration: 'underline',
            },
          },
          h1: {
            fontFamily: theme('fontFamily.headline'),
            fontWeight: theme('fontWeight.medium'),
          },
          h2: {
            fontFamily: theme('fontFamily.headline'),
            fontWeight: theme('fontWeight.medium'),
          },
          h3: {
            fontFamily: theme('fontFamily.headline'),
            fontWeight: theme('fontWeight.normal'),
          },
          'code::before': {
            content: 'unset',
          },
          'code::after': {
            content: 'unset',
          },
          blockquote: {
            fontStyle: 'normal',
          },
          'blockquote p:first-of-type::before': {
            content: 'unset',
          },
          'blockquote p:last-of-type::after': {
            content: 'unset',
          },
        },
      },
      sm: {
        css: {
          a: {
            color: theme('colors.primary'),
            textDecoration: 'none',
            '&:hover': {
              color: theme('colors.primary'),
              textDecoration: 'underline',
            },
          },
          h1: {
            fontFamily: theme('fontFamily.headline'),
            fontWeight: theme('fontWeight.medium'),
          },
          h2: {
            fontFamily: theme('fontFamily.headline'),
            fontWeight: theme('fontWeight.medium'),
          },
          h3: {
            fontFamily: theme('fontFamily.headline'),
            fontWeight: theme('fontWeight.normal'),
          },
        },
      },
    }),
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
  future: {
    removeDeprecatedGapUtilities: true,
  },
}
