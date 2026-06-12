import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-poppins)', 'sans-serif'],
        headline: ['var(--font-poppins)', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: '#FFF5F7',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#FF7A90',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#A38CF4',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F3EAF8',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: '#F3EAF8',
          foreground: '#A38CF4',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'rgba(255, 122, 144, 0.2)',
        input: 'rgba(255, 122, 144, 0.1)',
        ring: '#FF7A90',
      },
      borderRadius: {
        lg: '1.5rem',
        md: '1rem',
        sm: '0.75rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2s infinite ease-in-out',
        'float': 'float 3s infinite ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
