// Types d'étapes possibles dans le processus de devis
export type QuestionnaireStepType = 
  | 'client_domain' 
  | 'general_info' 
  | 'domain_specific' 
  | 'user_instructions'
  | 'summary';

// Configuration pour un domaine de devis
export interface DomainConfig {
  id: string;
  label: string;
  steps: QuestionnaireStepType[];
  specificFields: string[]; // Champs spécifiques à ce domaine
}

// Liste des domaines disponibles avec leur configuration
export const domainConfigs: DomainConfig[] = [
  {
    id: "electricite",
    label: "Électricité",
    steps: ['client_domain', 'general_info', 'domain_specific', 'user_instructions', 'summary'],
    specificFields: ['pointsElectriques', 'tableauElectrique'],
  },
  {
    id: "plomberie_chauffage",
    label: "Plomberie / Chauffage",
    steps: ['client_domain', 'general_info', 'domain_specific', 'user_instructions', 'summary'],
    specificFields: ['nombrePointsEau', 'typeChauffage'],
  },
  {
    id: "maconnerie",
    label: "Maçonnerie",
    steps: ['client_domain', 'general_info', 'domain_specific', 'user_instructions', 'summary'],
    specificFields: ['mlMurs'],
  },
  {
    id: "platrerie_isolation",
    label: "Plâtrerie / Isolation",
    steps: ['client_domain', 'general_info', 'domain_specific', 'user_instructions', 'summary'],
    specificFields: ['mlCloisons', 'typeIsolant'],
  },
  {
    id: "couverture",
    label: "Couverture / Toiture",
    steps: ['client_domain', 'general_info', 'domain_specific', 'user_instructions', 'summary'],
    specificFields: ['typeToiture'],
  },
  {
    id: "renovation_complete",
    label: "Rénovation Complète / Multi-lots",
    steps: ['client_domain', 'general_info', 'user_instructions', 'summary'], // Pas d'étape domain_specific
    specificFields: [],
  }
];

// Fonction pour récupérer la configuration d'un domaine
export function getDomainConfig(domainId: string | undefined): DomainConfig | undefined {
  if (!domainId) return undefined;
  return domainConfigs.find(domain => domain.id === domainId);
}

// Fonction pour obtenir le nombre total d'étapes pour un domaine
export function getTotalStepsForDomain(domainId: string | undefined): number {
  const config = getDomainConfig(domainId);
  return config ? config.steps.length : 0;
}

// Fonction pour obtenir tous les domaines sous forme d'options pour un select
export function getDomainOptions() {
  return domainConfigs.map(domain => ({
    value: domain.id,
    label: domain.label
  }));
}

// Fonction pour vérifier si un champ spécifique est applicable à un domaine
export function isFieldApplicable(field: string, domainId: string | undefined): boolean {
  if (!domainId) return false;
  const config = getDomainConfig(domainId);
  return config ? config.specificFields.includes(field) : false;
}
