"use client";

import { QuoteStatusBadge } from '@/components/ui';

type QuoteStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED';

interface QuoteStatusChipProps {
  status: QuoteStatus;
}

/**
 * Composant pour afficher le statut d'un devis avec le style de thème cohérent
 */
export const QuoteStatusChip = ({ status }: QuoteStatusChipProps) => {
  return <QuoteStatusBadge status={status} />;
};

export default QuoteStatusChip;
