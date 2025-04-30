import { theme } from './theme';

/**
 * Hook pour utiliser le thème dans les composants React
 * 
 * Exemple d'utilisation:
 * ```tsx
 * import { useTheme } from '@/styles/theme/useTheme';
 * 
 * const MyComponent = () => {
 *   const { colors } = useTheme();
 *   
 *   return (
 *     <div style={{ color: colors.primary[500] }}>
 *       Texte avec la couleur primaire
 *     </div>
 *   );
 * };
 * ```
 */
export const useTheme = () => {
  return theme;
};
