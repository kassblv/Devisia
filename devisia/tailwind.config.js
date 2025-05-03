/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
      },
      colors: {
        // Couleurs primaires
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed', // Couleur principale (violet)
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
        },
        // Couleurs secondaires
        secondary: {
          50: '#e6f9f5',
          100: '#ccf4eb',
          200: '#99e9d6',
          300: '#66ddc2',
          400: '#33d2ad',
          500: '#00c799', // Couleur secondaire principale
          600: '#009f7a',
          700: '#00775c',
          800: '#00503d',
          900: '#00281f',
        },
        // Couleurs de la sidebar
        sidebar: {
          DEFAULT: '#f8fafc', // fond par défaut (light mode)
          foreground: '#0f172a', // texte par défaut
          accent: 'rgba(124, 58, 237, 0.1)', // bg-primary-500 (violet) avec opacité
          'accent-foreground': '#7c3aed', // texte identique au primary-500 (violet)
          muted: '#f1f5f9', // arrière-plan atténué
          'muted-foreground': '#64748b', // texte atténué
          ring: 'rgba(124, 58, 237, 0.3)', // focus ring
        },
        // États
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        // Statuts des devis
        'status-draft-bg': '#e5e7eb',
        'status-draft-text': '#4b5563',
        'status-sent-bg': '#dbeafe',
        'status-sent-text': '#2563eb',
        'status-approved-bg': '#d1fae5',
        'status-approved-text': '#059669',
        'status-rejected-bg': '#fee2e2',
        'status-rejected-text': '#dc2626',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '1rem',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require('tw-animate-css')],
};
