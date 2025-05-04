// /domain/models/Devis.ts

export interface Materiau {
  nom: string;
  quantite: number;
  unite: string;
  prix_unitaire: number;
}

export interface MainOeuvre {
  heures_estimees: number;
  taux_horaire: number;
  total: number; // Peut être calculé: heures_estimees * taux_horaire
}

export interface Poste {
  nom: string;
  prix: number;
}

export interface Devis {
  projet: string;
  description: string;
  materiaux: Materiau[];
  main_oeuvre: MainOeuvre;
  postes: Poste[]; // Pour d'autres coûts comme location matériel, etc.
  total_ht: number; // Calculé: sum(materiaux) + main_oeuvre.total + sum(postes)
  tva: number; // Peut être un taux ou un montant fixe
  total_ttc: number; // Calculé: total_ht * (1 + tva)
}