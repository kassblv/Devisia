// src/config/questionnaireModels.ts
// Modèle pour les questionnaires dynamiques basés sur le domaine

export type QuestionType = 
  | 'text'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'textarea';

export type ConditionOperator = 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'exists';

// Interface pour une condition qui détermine si une question doit être affichée
export interface QuestionCondition {
  field: string;        // Le champ sur lequel la condition est évaluée
  operator: ConditionOperator;
  value?: any;          // La valeur à comparer
}

// Interface pour une option dans une question de type select
export interface SelectOption {
  value: string;
  label: string;
}

// Interface pour une question individuelle
export interface Question {
  id: string;           // Identifiant unique de la question (correspondant à un champ dans QuestionnaireData)
  type: QuestionType;   // Type de question (texte, nombre, select, etc.)
  label: string;        // Texte à afficher à l'utilisateur
  placeholder?: string; // Texte d'aide dans le champ
  required?: boolean;   // Si la question est obligatoire
  options?: SelectOption[]; // Options pour les questions de type select
  condition?: QuestionCondition | QuestionCondition[]; // Condition(s) pour afficher cette question
  min?: number;        // Valeur minimale pour les champs numériques
  max?: number;        // Valeur maximale pour les champs numériques
  step?: number;       // Pas pour les champs numériques
  rows?: number;       // Nombre de lignes pour textarea
}

// Interface pour une section du questionnaire (groupe de questions)
export interface QuestionSection {
  id: string;          // Identifiant unique de la section
  title: string;       // Titre de la section
  description?: string; // Description de la section
  questions: Question[]; // Questions dans cette section
  condition?: QuestionCondition | QuestionCondition[]; // Condition(s) pour afficher cette section
}

// Interface pour un questionnaire complet pour un domaine
export interface QuestionnaireModel {
  id: string;          // Identifiant du domaine
  name: string;        // Nom du domaine à afficher
  sections: QuestionSection[]; // Sections du questionnaire
}

// Liste complète des questionnaires par domaine
export const questionnaires: QuestionnaireModel[] = [
  // ÉLECTRICITÉ
  {
    id: "electricite",
    name: "Électricité",
    sections: [
      {
        id: "informations_generales",
        title: "Informations Générales",
        description: "Informations de base pour votre projet électrique",
        questions: [
          {
            id: "typeProjet",
            type: "select",
            label: "Type de Projet *",
            required: true,
            options: [
              { value: "installation_neuve", label: "Installation Neuve" },
              { value: "renovation", label: "Rénovation d'Installation Existante" },
              { value: "depannage", label: "Dépannage" },
              { value: "mise_aux_normes", label: "Mise aux Normes" }
            ]
          },
          {
            id: "typeBatiment",
            type: "select",
            label: "Type de Bâtiment *",
            required: true,
            options: [
              { value: "maison_individuelle", label: "Maison Individuelle" },
              { value: "appartement", label: "Appartement" },
              { value: "immeuble_collectif", label: "Immeuble Collectif" },
              { value: "local_commercial", label: "Local Commercial" },
              { value: "batiment_industriel", label: "Bâtiment Industriel" }
            ]
          },
          {
            id: "surfaceTotale",
            type: "number",
            label: "Surface Totale (m²) *",
            placeholder: "Surface approximative en m²",
            required: true,
            min: 1
          }
        ]
      },
      {
        id: "details_electriques",
        title: "Détails Installation Électrique",
        questions: [
          {
            id: "pointsElectriques",
            type: "number",
            label: "Nombre de Points Électriques",
            placeholder: "Nombre total (prises, interrupteurs, luminaires...)",
            min: 0
          },
          {
            id: "tableauElectrique",
            type: "checkbox",
            label: "Remplacement/Installation Tableau Électrique",
          },
          {
            id: "puissanceCompteur",
            type: "select",
            label: "Puissance du Compteur",
            options: [
              { value: "3kva", label: "3 kVA" },
              { value: "6kva", label: "6 kVA" },
              { value: "9kva", label: "9 kVA" },
              { value: "12kva", label: "12 kVA" },
              { value: "autre", label: "Autre / Je ne sais pas" }
            ]
          },
          {
            id: "automatisationDomotique",
            type: "checkbox",
            label: "Installation Domotique / Automatisation"
          }
        ]
      },
      {
        id: "specifications_supplementaires",
        title: "Spécifications Supplémentaires",
        questions: [
          {
            id: "contraintesSpecifiques",
            type: "textarea",
            label: "Contraintes Spécifiques",
            placeholder: "Précisez des contraintes particulières (bâtiment ancien, accès difficile...)",
            rows: 3
          }
        ]
      }
    ]
  },
  
  // PLOMBERIE / CHAUFFAGE
  {
    id: "plomberie_chauffage",
    name: "Plomberie / Chauffage",
    sections: [
      {
        id: "informations_generales",
        title: "Informations Générales",
        questions: [
          {
            id: "typeProjet",
            type: "select",
            label: "Type de Projet *",
            required: true,
            options: [
              { value: "installation_neuve", label: "Installation Neuve" },
              { value: "renovation", label: "Rénovation d'Installation Existante" },
              { value: "depannage", label: "Dépannage" },
              { value: "remplacement_equipement", label: "Remplacement d'Équipement" }
            ]
          },
          {
            id: "typeBatiment",
            type: "select",
            label: "Type de Bâtiment *",
            required: true,
            options: [
              { value: "maison_individuelle", label: "Maison Individuelle" },
              { value: "appartement", label: "Appartement" },
              { value: "immeuble_collectif", label: "Immeuble Collectif" },
              { value: "local_commercial", label: "Local Commercial" }
            ]
          },
          {
            id: "surfaceTotale",
            type: "number",
            label: "Surface Totale (m²) *",
            placeholder: "Surface approximative en m²",
            required: true,
            min: 1
          }
        ]
      },
      {
        id: "details_plomberie",
        title: "Détails Plomberie",
        questions: [
          {
            id: "nombrePointsEau",
            type: "number",
            label: "Nombre de Points d'Eau",
            placeholder: "Robinets, éviers, douches, toilettes...",
            min: 0
          },
          {
            id: "travailEauChaude",
            type: "checkbox",
            label: "Travaux sur Production d'Eau Chaude"
          },
          {
            id: "typeMateriauxTuyauterie",
            type: "select",
            label: "Type de Matériaux pour Tuyauterie",
            options: [
              { value: "cuivre", label: "Cuivre" },
              { value: "pvc", label: "PVC" },
              { value: "multicouche", label: "Multicouche" },
              { value: "per", label: "PER" },
              { value: "autre", label: "Autre / Je ne sais pas" }
            ],
            condition: {
              field: "typeProjet",
              operator: "equals",
              value: "installation_neuve"
            }
          }
        ]
      },
      {
        id: "details_chauffage",
        title: "Détails Chauffage",
        condition: {
          field: "travailChauffage",
          operator: "equals",
          value: true
        },
        questions: [
          {
            id: "travailChauffage",
            type: "checkbox",
            label: "Travaux sur Système de Chauffage"
          },
          {
            id: "typeChauffage",
            type: "select",
            label: "Type de Chauffage",
            options: [
              { value: "gaz", label: "Gaz" },
              { value: "electrique", label: "Électrique" },
              { value: "pac", label: "Pompe à Chaleur" },
              { value: "fioul", label: "Fioul" },
              { value: "bois", label: "Bois / Granulés" },
              { value: "autre", label: "Autre" }
            ],
            condition: {
              field: "travailChauffage",
              operator: "equals",
              value: true
            }
          },
          {
            id: "nombreRadiateurs",
            type: "number",
            label: "Nombre de Radiateurs",
            min: 0,
            condition: {
              field: "travailChauffage",
              operator: "equals",
              value: true
            }
          }
        ]
      },
      {
        id: "specifications_supplementaires",
        title: "Spécifications Supplémentaires",
        questions: [
          {
            id: "contraintesSpecifiques",
            type: "textarea",
            label: "Contraintes Spécifiques",
            placeholder: "Précisez des contraintes particulières (bâtiment ancien, accès difficile...)",
            rows: 3
          }
        ]
      }
    ]
  },

  // MAÇONNERIE
  {
    id: "maconnerie",
    name: "Maçonnerie",
    sections: [
      {
        id: "informations_generales",
        title: "Informations Générales",
        questions: [
          {
            id: "typeProjet",
            type: "select",
            label: "Type de Projet *",
            required: true,
            options: [
              { value: "construction_neuve", label: "Construction Neuve" },
              { value: "renovation", label: "Rénovation" },
              { value: "extension", label: "Extension" },
              { value: "amenagement_exterieur", label: "Aménagement Extérieur" }
            ]
          },
          {
            id: "typeBatiment",
            type: "select",
            label: "Type de Bâtiment *",
            required: true,
            options: [
              { value: "maison_individuelle", label: "Maison Individuelle" },
              { value: "garage_annexe", label: "Garage / Annexe" },
              { value: "mur_cloture", label: "Mur de Clôture" },
              { value: "immeuble", label: "Immeuble" },
              { value: "batiment_commercial", label: "Bâtiment Commercial/Industriel" }
            ]
          },
          {
            id: "surfaceTotale",
            type: "number",
            label: "Surface Totale (m²) *",
            placeholder: "Surface approximative en m²",
            required: true,
            min: 1
          }
        ]
      },
      {
        id: "details_maconnerie",
        title: "Détails Maçonnerie",
        questions: [
          {
            id: "typeTravaux",
            type: "select",
            label: "Type de Travaux Principal",
            options: [
              { value: "fondations", label: "Fondations" },
              { value: "elevation_murs", label: "Élévation de Murs" },
              { value: "dalle_beton", label: "Dalle Béton" },
              { value: "ouverture_mur", label: "Ouverture dans Mur Porteur" },
              { value: "terrasse", label: "Terrasse" },
              { value: "escalier", label: "Escalier" }
            ]
          },
          {
            id: "mlMurs",
            type: "number",
            label: "Mètres Linéaires de Murs",
            placeholder: "Longueur approximative",
            min: 0,
            condition: {
              field: "typeTravaux",
              operator: "equals",
              value: "elevation_murs"
            }
          },
          {
            id: "materiaux",
            type: "select",
            label: "Matériaux Principaux",
            options: [
              { value: "parpaing", label: "Parpaing" },
              { value: "brique", label: "Brique" },
              { value: "beton", label: "Béton" },
              { value: "pierre", label: "Pierre" },
              { value: "autre", label: "Autre" }
            ]
          }
        ]
      },
      {
        id: "specifications_supplementaires",
        title: "Spécifications Supplémentaires",
        questions: [
          {
            id: "contraintesSpecifiques",
            type: "textarea",
            label: "Contraintes Spécifiques",
            placeholder: "Précisez des contraintes particulières (accès difficile, sol instable...)",
            rows: 3
          }
        ]
      }
    ]
  },

  // TOITURE / COUVERTURE
  {
    id: "couverture",
    name: "Couverture / Toiture",
    sections: [
      {
        id: "informations_generales",
        title: "Informations Générales",
        questions: [
          {
            id: "typeProjet",
            type: "select",
            label: "Type de Projet *",
            required: true,
            options: [
              { value: "toiture_neuve", label: "Toiture Neuve" },
              { value: "renovation", label: "Rénovation" },
              { value: "reparation", label: "Réparation / Étanchéité" },
              { value: "isolation_toiture", label: "Isolation de Toiture" }
            ]
          },
          {
            id: "typeBatiment",
            type: "select",
            label: "Type de Bâtiment *",
            required: true,
            options: [
              { value: "maison_individuelle", label: "Maison Individuelle" },
              { value: "immeuble", label: "Immeuble" },
              { value: "garage_dependance", label: "Garage / Dépendance" },
              { value: "batiment_industriel", label: "Bâtiment Industriel" }
            ]
          },
          {
            id: "surfaceTotale",
            type: "number",
            label: "Surface de Toiture (m²) *",
            placeholder: "Surface approximative en m²",
            required: true,
            min: 1
          }
        ]
      },
      {
        id: "details_toiture",
        title: "Détails Toiture",
        questions: [
          {
            id: "typeToiture",
            type: "select",
            label: "Type de Toiture",
            options: [
              { value: "tuiles_mecaniques", label: "Tuiles Mécaniques" },
              { value: "tuiles_plates", label: "Tuiles Plates" },
              { value: "ardoise", label: "Ardoise" },
              { value: "zinc", label: "Zinc" },
              { value: "bac_acier", label: "Bac Acier" },
              { value: "toiture_terrasse", label: "Toiture Terrasse" },
              { value: "autre", label: "Autre" }
            ]
          },
          {
            id: "nombrePentes",
            type: "select",
            label: "Nombre de Pentes",
            options: [
              { value: "1", label: "1 pente (Monopente)" },
              { value: "2", label: "2 pentes" },
              { value: "4", label: "4 pentes" },
              { value: "complexe", label: "Toiture complexe" }
            ]
          },
          {
            id: "zinguerie",
            type: "checkbox",
            label: "Travaux de Zinguerie (gouttières, descentes...)"
          }
        ]
      },
      {
        id: "specifications_supplementaires",
        title: "Spécifications Supplémentaires",
        questions: [
          {
            id: "contraintesSpecifiques",
            type: "textarea",
            label: "Contraintes Spécifiques",
            placeholder: "Précisez des contraintes particulières (hauteur, accès difficile...)",
            rows: 3
          }
        ]
      }
    ]
  }
];

// Fonction utilitaire pour récupérer un questionnaire par ID
export function getQuestionnaireById(id: string): QuestionnaireModel | undefined {
  return questionnaires.find(q => q.id === id);
}

// Fonction pour évaluer si une question doit être affichée en fonction des conditions
export function evaluateCondition(condition: QuestionCondition, data: any): boolean {
  const { field, operator, value } = condition;
  const fieldValue = data[field];
  
  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'contains':
      return fieldValue?.includes(value);
    case 'greaterThan':
      return fieldValue > value;
    case 'lessThan':
      return fieldValue < value;
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
    default:
      return false;
  }
}

// Fonction pour évaluer si une question doit être affichée en fonction de ses conditions
export function shouldDisplayQuestion(question: Question, data: any): boolean {
  if (!question.condition) return true;
  
  if (Array.isArray(question.condition)) {
    // Si c'est un tableau de conditions, toutes doivent être vraies (AND)
    return question.condition.every(cond => evaluateCondition(cond, data));
  } else {
    // Sinon, évaluer la condition unique
    return evaluateCondition(question.condition, data);
  }
}

// Fonction pour évaluer si une section doit être affichée
export function shouldDisplaySection(section: QuestionSection, data: any): boolean {
  if (!section.condition) return true;
  
  if (Array.isArray(section.condition)) {
    return section.condition.every(cond => evaluateCondition(cond, data));
  } else {
    return evaluateCondition(section.condition, data);
  }
}
