import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

/**
 * Composant Card utilisant le thème Devisia
 * 
 * Utilisation:
 * ```tsx
 * <Card>
 *   <CardHeader>Titre de la carte</CardHeader>
 *   <p>Contenu de la carte</p>
 *   <CardFooter>Pied de la carte</CardFooter>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  border = true,
  shadow = 'md',
  rounded = 'md',
  hover = false,
}) => {
  // Classes de base avec fond blanc ou fond légèrement teinté
  const baseClasses = 'bg-white backdrop-blur-sm';
  
  // Options de rembourrage plus spacieuses
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  // Ombres améliorées avec une teinte de couleur
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow hover:shadow-indigo-50',
    lg: 'shadow-lg hover:shadow-indigo-100',
  };
  
  // Bords plus arrondis pour un look moderne
  const roundedClasses = {
    none: '',
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
  };
  
  // Bordure subtile avec une teinte de couleur indigo très légère
  const borderClasses = border ? 'border border-indigo-50' : '';
  const hoverClasses = hover ? 'transition-all duration-normal hover:shadow-lg' : '';
  
  const classes = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    roundedClasses[rounded],
    borderClasses,
    hoverClasses,
    className,
  ].join(' ');
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

/**
 * En-tête de carte
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  divider = true,
}) => {
  const dividerClass = divider ? 'border-b border-gray-200 mb-4' : '';
  
  return (
    <div className={`${dividerClass} pb-4 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Pied de carte
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  divider = true,
}) => {
  const dividerClass = divider ? 'border-t border-gray-200 mt-4' : '';
  
  return (
    <div className={`${dividerClass} pt-4 ${className}`}>
      {children}
    </div>
  );
};
