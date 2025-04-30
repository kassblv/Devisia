// Définition du thème central pour Devisia
// Ce fichier permet de modifier facilement l'identité graphique de l'application

export const theme = {
  // Couleurs primaires - utilisées pour les éléments principaux comme les boutons, liens, etc.
  colors: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1', // Couleur principale - Indigo vif
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    // Couleurs secondaires - utilisées pour les accents et éléments secondaires
    secondary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899', // Couleur secondaire principale - Rose vif
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
    // Couleurs tertiaires - pour un thème plus coloré
    tertiary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Emeraude
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    // Accents colorés additionnels
    accent: {
      purple: '#8b5cf6', // Violet
      blue: '#3b82f6',   // Bleu
      yellow: '#fbbf24', // Jaune
      orange: '#f97316', // Orange
      red: '#ef4444',    // Rouge
      teal: '#14b8a6',   // Turquoise
    },
    // Couleurs de texte
    text: {
      primary: '#111827', // Plus foncé
      secondary: '#374151', 
      tertiary: '#6b7280',
      inverted: '#ffffff',
      accent: '#6366f1', // Texte coloré (indigo)
    },
    // Couleurs de fond plus colorées et vibrantes
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb', // Moins gris, plus blanc
      tertiary: '#f3f4f6',  // Moins gris
      highlight: '#eef2ff', // Indigo très léger
      card: '#ffffff',      // Pour les cartes
      accent: '#fdf2f8',    // Rose très léger
      gradient: 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 100%)', // Dégradé subtil
    },
    // Couleurs d'état améliorées
    state: {
      success: '#10b981', // Emeraude
      warning: '#f59e0b', // Ambre
      error: '#ef4444',   // Rouge
      info: '#3b82f6',    // Bleu
      new: '#8b5cf6',     // Violet
    },
    // Couleurs de statut des devis (plus vibrantes)
    quoteStatus: {
      draft: {
        bg: '#f3f4f6',
        text: '#4b5563',
      },
      sent: {
        bg: '#dbeafe',
        text: '#2563eb',
      },
      approved: {
        bg: '#d1fae5',
        text: '#059669',
      },
      rejected: {
        bg: '#fee2e2',
        text: '#dc2626',
      },
      expired: {
        bg: '#fef3c7',
        text: '#d97706',
      },
    },
  },
  
  // Typographie
  typography: {
    fontFamily: {
      sans: ['var(--font-geist-sans)', 'sans-serif'],
      mono: ['var(--font-geist-mono)', 'monospace'],
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
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Espacement
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Bordures et arrondis - plus modernes et arrondis
  borders: {
    radius: {
      sm: '0.375rem',      // Légèrement plus arrondi
      md: '0.5rem',        // Augmenté
      lg: '0.75rem',       // Plus arrondi
      xl: '1.5rem',        // Encore plus arrondi
      full: '9999px',
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
    // Bordures colorées
    colors: {
      light: 'rgba(99, 102, 241, 0.1)',  // Indigo très léger
      medium: 'rgba(99, 102, 241, 0.2)',  // Indigo léger
      accent: '#6366f1',                  // Indigo plein
      secondary: '#ec4899',               // Rose
    },
  },
  
  // Ombres - plus douces, légèrement colorées pour plus de profondeur visuelle
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(99, 102, 241, 0.03)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(99, 102, 241, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(99, 102, 241, 0.04)',
    colored: '0 10px 20px -10px rgba(99, 102, 241, 0.3)',  // Ombre colorée indigo
    glow: '0 0 15px rgba(99, 102, 241, 0.5)',             // Effet de lueur
    'pink-glow': '0 0 15px rgba(236, 72, 153, 0.5)',      // Effet de lueur rose
  },
  
  // Animations et transitions - plus variées
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    bounce: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',  // Animation avec rebond
    spring: '600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Animation plus naturelle
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Effets visuels additionnels
  effects: {
    hover: {
      scale: 'transform: scale(1.03)',
      lift: 'transform: translateY(-4px)',
      glow: 'box-shadow: 0 0 15px rgba(99, 102, 241, 0.5)',
      'text-glow': 'text-shadow: 0 0 8px rgba(99, 102, 241, 0.3)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',  // Indigo à violet
      secondary: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',  // Rose
      accent: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',     // Indigo à rose
      success: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',    // Vert
      warning: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',    // Ambre
    },
  },
};
