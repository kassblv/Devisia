// src/types/devis.ts

// Structure des données attendues du questionnaire frontend
export interface QuestionnaireData {
  quoteDomain: string; // Ajout du domaine principal
  brancheBtp: string;
  typeProjet: string;
  typeBatiment: string;
  surfaceTotale: number; // en m²
  contraintesSpecifiques: string; // Texte libre pour détails

  // --- Champs spécifiques par branche (optionnels) ---
  // Électricité
  pointsElectriques?: number;
  tableauElectrique?: boolean; // Remplacement/Installation nouveau tableau ?

  // Plomberie
  nombrePointsEau?: number;
  typeChauffage?: 'gaz' | 'electrique' | 'pac' | 'autre'; // Exemple avec Select

  // Couverture
  typeToiture?: string; // Ex: Tuiles, Ardoise, Zinc, Bac acier...

  // Maçonnerie
  mlMurs?: number; // Mètres linéaires de murs à construire/démolir

  // Plâtrerie / Isolation
  mlCloisons?: number; // Mètres linéaires de cloisons
  typeIsolant?: string;

  // Ajoutez ici d'autres champs potentiels de votre questionnaire
}

// Payload attendu par l'API de génération
export interface DevisRequestPayload {
  questionnaireData: QuestionnaireData;
  userInstructions: string;
}

// Réutiliser les types Devis existants si nécessaire (ils sont dans domain/models/Devis.ts)
// export { Devis, Materiau, MainOeuvre, Poste } from '@/domain/models/Devis';
