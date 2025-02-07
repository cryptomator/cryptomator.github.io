/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: 'var(--color-primary)',
              textDecoration: 'none',
              '&:hover': {
                color: 'var(--color-primary)',
                textDecoration: 'underline',
              },
            },
            h1: {
              fontFamily: 'var(--font-headline)',
              fontWeight: 'var(--font-weight-medium)',
            },
            h2: {
              fontFamily: 'var(--font-headline)',
              fontWeight: 'var(--font-weight-medium)',
            },
            h3: {
              fontFamily: 'var(--font-headline)',
              fontWeight: 'var(--font-weight-normal)',
            },
            h4: {
              fontFamily: 'var(--font-headline)',
              fontWeight: 'var(--font-weight-normal)',
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
              backgroundColor: 'var(--color-gray-500)',
            },
          },
        }
      }),
    },
  }
}