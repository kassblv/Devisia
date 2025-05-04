// /app/api/devis/generate/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { GenerateDevisUseCase } from '@/application/use-cases/GenerateDevisUseCase';
import { OpenAIDevisGeneratorAdapter } from '@/infrastructure/adapters/OpenAIDevisGeneratorAdapter';
import { Devis } from '@/domain/models/Devis';
import { DevisRequestPayload } from '@/types/devis'; // Importer le type

export async function POST(request: NextRequest) {
  console.log('Requête reçue sur /api/devis/generate');
  try {
    const body: DevisRequestPayload = await request.json(); // Utiliser DevisRequestPayload
    const { questionnaireData, userInstructions } = body;
    const { quoteDomain, ...otherQuestionnaireData } = questionnaireData; // Extraire quoteDomain

    // Validation plus détaillée
    if (!questionnaireData || typeof questionnaireData !== 'object') {
      console.error('Données du questionnaire manquantes ou invalides.');
      return NextResponse.json({ error: 'Le champ "questionnaireData" est requis et doit être un objet.' }, { status: 400 });
    }
    if (userInstructions === undefined || typeof userInstructions !== 'string') { // Permettre une chaîne vide
        console.error('Instructions utilisateur manquantes ou invalides.');
        return NextResponse.json({ error: 'Le champ "userInstructions" est requis et doit être une chaîne.' }, { status: 400 });
    }
    if (!quoteDomain || typeof quoteDomain !== 'string') {
      console.error('Domaine du devis manquant ou invalide.');
      return NextResponse.json({ error: 'Le champ "quoteDomain" est requis.' }, { status: 400 });
    }

    // Construire un prompt détaillé à partir des données
    const detailedPrompt = `
Génère un devis BTP détaillé basé sur les informations suivantes :

**Domaine Principal :** ${quoteDomain} // Ajout du domaine

**Informations Générales du Projet :**
- Branche BTP Secondaire (si applicable) : ${otherQuestionnaireData.brancheBtp || 'N/A'}
- Type de Projet : ${otherQuestionnaireData.typeProjet}
- Type de Bâtiment : ${otherQuestionnaireData.typeBatiment}
- Surface Totale : ${otherQuestionnaireData.surfaceTotale} m²

**Détails Spécifiques (si fournis) :**
${otherQuestionnaireData.pointsElectriques ? `- Nombre de Points Électriques : ${otherQuestionnaireData.pointsElectriques}` : ''}
${otherQuestionnaireData.tableauElectrique !== undefined ? `- Remplacement/Installation Tableau Électrique : ${otherQuestionnaireData.tableauElectrique ? 'Oui' : 'Non'}` : ''}
${otherQuestionnaireData.nombrePointsEau ? `- Nombre de Points d'Eau : ${otherQuestionnaireData.nombrePointsEau}` : ''}
${otherQuestionnaireData.typeChauffage ? `- Type de Chauffage Principal : ${otherQuestionnaireData.typeChauffage}` : ''}
${otherQuestionnaireData.typeToiture ? `- Type de Toiture Principal : ${otherQuestionnaireData.typeToiture}` : ''}
${otherQuestionnaireData.mlMurs ? `- Mètres Linéaires de Murs (Maçonnerie) : ${otherQuestionnaireData.mlMurs}` : ''}
${otherQuestionnaireData.mlCloisons ? `- Mètres Linéaires de Cloisons (Plâtrerie) : ${otherQuestionnaireData.mlCloisons}` : ''}
${otherQuestionnaireData.typeIsolant ? `- Type d'Isolant Principal (Isolation) : ${otherQuestionnaireData.typeIsolant}` : ''}

**Contraintes Spécifiques / Détails :**
${otherQuestionnaireData.contraintesSpecifiques || 'Aucune'}

**Instructions Utilisateur Supplémentaires :**
${userInstructions || 'Aucune'}

Merci de fournir un devis détaillé et chiffré incluant les matériaux, la main d'œuvre et les différents postes nécessaires pour réaliser ces travaux.
`;

    console.log("Prompt détaillé construit :", detailedPrompt);

    // Instanciation des dépendances
    const devisGenerator = new OpenAIDevisGeneratorAdapter();
    const generateDevisUseCase = new GenerateDevisUseCase(devisGenerator);

    // Exécution du cas d'utilisation avec le prompt détaillé
    const devis: Devis = await generateDevisUseCase.execute(detailedPrompt);

    console.log('Devis généré avec succès, renvoi de la réponse.');
    return NextResponse.json(devis, { status: 200 });

  } catch (error: any) {
    console.error('Erreur dans l\'API /api/devis/generate:', error);

    // Gérer les erreurs spécifiques ou renvoyer une erreur générique
    const errorMessage = error.message || 'Une erreur interne est survenue lors de la génération du devis.';
    let statusCode = 500;

    if (error.message.includes('OPENAI_API_KEY')) {
        statusCode = 503; // Service Unavailable (config manquante)
    }
     else if (error.message.includes('400')) { // Potentiellement une erreur de l'API OpenAI ou validation
        statusCode = 400;
    }
     else if (error.message.includes('API OpenAI')) {
        statusCode = 502; // Bad Gateway (problème communication OpenAI)
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
