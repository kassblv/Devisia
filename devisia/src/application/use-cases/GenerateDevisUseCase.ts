// /application/use-cases/GenerateDevisUseCase.ts
import { DevisGeneratorPort } from '@/application/ports/DevisGeneratorPort';
import { Devis } from '@/domain/models/Devis';

export class GenerateDevisUseCase {
  constructor(private readonly devisGenerator: DevisGeneratorPort) {}

  /**
   * Exécute le cas d'utilisation pour générer un devis à partir d'un prompt.
   * @param prompt Le prompt utilisateur décrivant le besoin.
   * @returns Une promesse résolue avec le devis généré.
   */
  async execute(prompt: string): Promise<Devis> {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Le prompt ne peut pas être vide.');
    }

    try {
      console.log(`Génération du devis pour le prompt: "${prompt.substring(0, 100)}..."`);
      const devis = await this.devisGenerator.generateDevisFromPrompt(prompt);
      console.log('Devis généré avec succès.');
      return devis;
    } catch (error) {
      console.error("Erreur dans GenerateDevisUseCase:", error);
      // Remonter l'erreur pour qu'elle soit gérée par la couche supérieure (API route)
      throw error;
    }
  }
}
