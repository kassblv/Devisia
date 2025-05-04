// /infrastructure/adapters/OpenAIDevisGeneratorAdapter.ts
import { DevisGeneratorPort } from '@/application/ports/DevisGeneratorPort';
import { Devis } from '@/domain/models/Devis';
import OpenAI from 'openai';

export class OpenAIDevisGeneratorAdapter implements DevisGeneratorPort {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('La clé API OpenAI (OPENAI_API_KEY) est manquante dans les variables d\'environnement.');
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateDevisFromPrompt(prompt: string): Promise<Devis> {
    try {
      const systemPrompt = `
        Tu es un assistant expert en BTP spécialisé dans la génération de devis.
        À partir du prompt de l'utilisateur décrivant un projet, tu dois générer une structure de devis détaillée au format JSON.
        Le JSON doit strictement suivre cette structure TypeScript, sans texte explicatif avant ou après:
        interface Materiau { nom: string; quantite: number; unite: string; prix_unitaire: number; }
        interface MainOeuvre { heures_estimees: number; taux_horaire: number; total: number; } // total = heures_estimees * taux_horaire
        interface Poste { nom: string; prix: number; }
        interface Devis { projet: string; description: string; materiaux: Materiau[]; main_oeuvre: MainOeuvre; postes: Poste[]; total_ht: number; tva: number; total_ttc: number; } // total_ht = sum(materiaux) + main_oeuvre.total + sum(postes); tva = 0.2 (20%); total_ttc = total_ht * (1 + tva)

        Assure-toi que les calculs pour main_oeuvre.total, total_ht et total_ttc sont corrects.
        Utilise un taux de TVA de 20% (0.2).
        Identifie clairement le nom du projet ('projet'), une description courte ('description'), la liste des matériaux nécessaires ('materiaux'), l'estimation de la main d'œuvre ('main_oeuvre'), et les autres postes éventuels ('postes').
        Les prix doivent être réalistes pour le secteur du BTP.
        Réponds uniquement avec le JSON généré.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o", // Ou un autre modèle performant comme gpt-4-turbo
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5, // Un peu de créativité mais reste factuel
      });

      const rawResponse = completion.choices[0]?.message?.content;

      if (!rawResponse) {
        throw new Error('Réponse vide de l\'API OpenAI.');
      }

      // Valider et parser la réponse JSON
      try {
        const devisData = JSON.parse(rawResponse);
        // Ici, on pourrait ajouter une validation plus poussée avec Zod ou une autre librairie
        // pour s'assurer que la structure est exactement celle attendue par l'interface Devis.
        return devisData as Devis;
      } catch (parseError) {
        console.error("Erreur de parsing de la réponse JSON d'OpenAI:", parseError, "Raw response:", rawResponse);
        throw new Error('Impossible de parser la réponse JSON reçue d\'OpenAI.');
      }

    } catch (error) {
      console.error('Erreur lors de la génération du devis via OpenAI:', error);
      if (error instanceof OpenAI.APIError) {
         throw new Error(`Erreur API OpenAI: ${error.status} ${error.name} - ${error.message}`);
      }
      throw new Error('Une erreur est survenue lors de la génération du devis.');
    }
  }
}
