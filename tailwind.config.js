module.exports = {
  purge: {
    enabled: process.env.HUGO_ENV !== 'development',
    content: [
      './content/**/*.html',
      './content/**/*.md',
      './layouts/**/*.html',
    ],
    options: {
      safelist: [
        'hover:border-white',
        'StripeElement',
        'StripeElement--focus',
        'underline'
      ],
    },
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      gray: {
        100: '#f7fafc',
        200: '#edf2f7',
        300: '#e2e8f0',
        400: '#cbd5e0',
        500: '#a0aec0',
        600: '#718096',
        700: '#4a5568',
        800: '#2d3748',
        900: '#1a202c',
      },
      red: {
        100: '#fff5f5',
        200: '#fed7d7',
        300: '#feb2b2',
        400: '#fc8181',
        500: '#f56565',
        600: '#e53e3e',
        700: '#c53030',
        800: '#9b2c2c',
        900: '#742a2a',
      },
      orange: {
        100: '#fffaf0',
        200: '#feebc8',
        300: '#fbd38d',
        400: '#f6ad55',
        500: '#ed8936',
        600: '#dd6b20',
        700: '#c05621',
        800: '#9c4221',
        900: '#7b341e',
      },
      yellow: {
        100: '#fffff0',
        200: '#fefcbf',
        300: '#faf089',
        400: '#f6e05e',
        500: '#ecc94b',
        600: '#d69e2e',
        700: '#b7791f',
        800: '#975a16',
        900: '#744210',
      },
      green: {
        100: '#f0fff4',
        200: '#c6f6d5',
        300: '#9ae6b4',
        400: '#68d391',
        500: '#48bb78',
        600: '#38a169',
        700: '#2f855a',
        800: '#276749',
        900: '#22543d',
      },
      teal: {
        100: '#e6fffa',
        200: '#b2f5ea',
        300: '#81e6d9',
        400: '#4fd1c5',
        500: '#38b2ac',
        600: '#319795',
        700: '#2c7a7b',
        800: '#285e61',
        900: '#234e52',
      },
      blue: {
        100: '#ebf8ff',
        200: '#bee3f8',
        300: '#90cdf4',
        400: '#63b3ed',
        500: '#4299e1',
        600: '#3182ce',
        700: '#2b6cb0',
        800: '#2c5282',
        900: '#2a4365',
      },
      indigo: {
        100: '#ebf4ff',
        200: '#c3dafe',
        300: '#a3bffa',
        400: '#7f9cf5',
        500: '#667eea',
        600: '#5a67d8',
        700: '#4c51bf',
        800: '#434190',
        900: '#3c366b',
      },
      purple: {
        100: '#faf5ff',
        200: '#e9d8fd',
        300: '#d6bcfa',
        400: '#b794f4',
        500: '#9f7aea',
        600: '#805ad5',
        700: '#6b46c1',
        800: '#553c9a',
        900: '#44337a',
      },
      pink: {
        100: '#fff5f7',
        200: '#fed7e2',
        300: '#fbb6ce',
        400: '#f687b3',
        500: '#ed64a6',
        600: '#d53f8c',
        700: '#b83280',
        800: '#97266d',
        900: '#702459',
      },
    },
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
      height: {
        '412px': '412px',
      },
      keyframes: {
        hover: {
          '0%, 100%': { transform: 'rotate(0deg) translateY(0)' },
          '50%': { transform: 'rotate(-3deg) translateY(-10px)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
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
            h4: {
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
            'ul > li::before': {
              backgroundColor: theme('colors.gray.500'),
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
      width: {
        'fit': 'fit-content',
      },
    },
    fontFamily: {
      'headline': 'Quicksand, sans-serif',
      'body': 'Open Sans, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '4.5rem',
    },
    screens: {
      'md': '768px',
      'lg': '1280px',
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
