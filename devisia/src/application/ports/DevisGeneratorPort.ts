// /application/ports/DevisGeneratorPort.ts

import { Devis } from '@/domain/models/Devis';

export interface DevisGeneratorPort {
  /**
   * Génère une structure de devis détaillée à partir d'un prompt utilisateur.
   * @param prompt - La description textuelle du besoin fournie par l'utilisateur.
   * @returns Une promesse résolue avec l'objet Devis généré.
   */
  generateDevisFromPrompt(prompt: string): Promise<Devis>;
}