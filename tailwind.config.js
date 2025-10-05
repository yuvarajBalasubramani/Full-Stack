/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Modern EliteStore Brand Colors - Vibrant & Professional
        brand: {
          // Primary - Deep Purple/Indigo
          primary: {
            50: '#f0f4ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5a4ff',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e6',
            700: '#4c38ca',
            800: '#3730a3',
            900: '#331e82',
            950: '#4e1b4b',
          },
          // Secondary - Emerald Green
          secondary: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22',
          },
          // Accent - Vibrant Orange
          accent: {
            50: '#fffbea',
            100: '#fff3c4',
            200: '#ffe082',
            300: '#ffcf4a',
            400: '#f5b800',
            500: '#d4a200',
            600: '#b38600',
            700: '#8f6a00',
            800: '#705200',
            900: '#5a4100',
            950: '#332600',
          },
          // Neutral - Modern Gray
          neutral: {
            50: '#f6f6f6',
            100: '#eaeaea',
            200: '#d5d5d5',
            300: '#bfbfbf',
            400: '#9a9a9a',
            500: '#787878',
            600: '#5e5e5e',
            700: '#454545',
            800: '#2e2e2e',
            900: '#1b1b1b',
            950: '#0e0e0e',
          },
          // Success - Fresh Green
          success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          // Warning - Amber
          warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          // Error - Red
          error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      }
    },
  },
  plugins: [],
};
