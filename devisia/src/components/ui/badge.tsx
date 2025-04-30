import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Composant Badge pour afficher des étiquettes, statuts, etc.
 * Utilise automatiquement les couleurs du thème Devisia.
 * 
 * Utilisations:
 * ```tsx
 * <Badge>Défaut</Badge>
 * <Badge variant="primary">Primaire</Badge>
 * <Badge variant="success" size="lg">Succès</Badge>
 * <Badge variant="error" icon={<ErrorIcon />}>Erreur</Badge>
 * <Badge variant="warning" rounded>Avertissement</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = '',
  icon = null,
}) => {
  // Nouvelles classes avec dégradés subtils et effet de brillance
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    primary: 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border border-indigo-200',
    secondary: 'bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 border border-pink-200',
    success: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200',
    warning: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200',
    error: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200',
    info: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200',
  };
  
  // Tailles légèrement agrandies et plus confortables visuellement
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
    lg: 'px-3.5 py-1.5 text-base font-medium',
  };
  
  const roundedClass = rounded ? 'rounded-full' : 'rounded-md';
  
  const classes = [
    'inline-flex items-center font-medium',
    variantClasses[variant],
    sizeClasses[size],
    roundedClass,
    className,
  ].join(' ');
  
  return (
    <span className={classes}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

/**
 * Composant spécifique pour les badges de statut de devis
 */
export const QuoteStatusBadge: React.FC<{
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED';
  className?: string;
}> = ({ status, className = '' }) => {
  const statusConfig: {
    [key: string]: { label: string; variant: BadgeVariant; icon?: React.ReactNode };
  } = {
    DRAFT: {
      label: 'Brouillon',
      variant: 'default',
      icon: (
        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    SENT: {
      label: 'Envoyé',
      variant: 'info',
      icon: (
        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    APPROVED: {
      label: 'Approuvé',
      variant: 'success',
      icon: (
        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    REJECTED: {
      label: 'Refusé',
      variant: 'error',
      icon: (
        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  };
  
  const config = statusConfig[status] || statusConfig.DRAFT;
  
  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      rounded
      className={className}
    >
      {config.label}
    </Badge>
  );
};
