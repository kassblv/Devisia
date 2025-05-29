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
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
      },
      colors: {
        // Couleurs primaires - Bleu sobre
        primary: {
          50: '#f0f6ff',
          100: '#e0eefe',
          200: '#bae0fd',
          300: '#90cafc',
          400: '#5eacf8',
          500: '#3b82f6', // Couleur principale (bleu sobre)
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Couleurs secondaires - Gris bleutué
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Couleur secondaire principale (gris bleutué)
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Couleurs de la sidebar
        sidebar: {
          DEFAULT: '#f8fafc', // fond par défaut (light mode)
          foreground: '#0f172a', // texte par défaut
          accent: 'rgba(59, 130, 246, 0.1)', // bg-primary-500 (bleu) avec opacité
          'accent-foreground': '#3b82f6', // texte identique au primary-500 (bleu)
          muted: '#f1f5f9', // arrière-plan atténué
          'muted-foreground': '#64748b', // texte atténué
          ring: 'rgba(59, 130, 246, 0.3)', // focus ring
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
