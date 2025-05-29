// /app/api/devis/generate/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { GenerateDevisUseCase } from '@/application/use-cases/GenerateDevisUseCase';
import { OpenAIDevisGeneratorAdapter } from '@/infrastructure/adapters/OpenAIDevisGeneratorAdapter';
import { Devis } from '@/domain/models/Devis';
import { DevisRequestPayload } from '@/types/devis'; // Importer le type
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

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

    // Construire un prompt détaillé selon le format demandé
    const detailedPrompt = `Tu es un assistant expert en génération de devis dans le domaine du BTP.

L'utilisateur a complété un questionnaire décrivant son projet. Voici les informations extraites :
- Domaine principal : ${quoteDomain}
- Branche du BTP : ${otherQuestionnaireData.brancheBtp || 'N/A'}
- Type de projet : ${otherQuestionnaireData.typeProjet || 'Non spécifié'}
- Type de bâtiment : ${otherQuestionnaireData.typeBatiment || 'Non spécifié'}
- Surface totale : ${otherQuestionnaireData.surfaceTotale || 'Non spécifiée'} m²

${quoteDomain === 'electricite' ? 
  `- Nombre de points électriques à installer : ${otherQuestionnaireData.pointsElectriques || 'Non spécifié'}
- Tableau électrique à prévoir : ${otherQuestionnaireData.tableauElectrique ? 'Oui' : 'Non'}` : ''}

${quoteDomain === 'plomberie_chauffage' ? 
  `- Nombre de points d'eau : ${otherQuestionnaireData.nombrePointsEau || 'Non spécifié'}
- Type de chauffage : ${otherQuestionnaireData.typeChauffage || 'Non spécifié'}` : ''}

${quoteDomain === 'maconnerie' ? 
  `- Mètres linéaires de murs : ${otherQuestionnaireData.mlMurs || 'Non spécifié'} ml
- Mètres linéaires de cloisons : ${otherQuestionnaireData.mlCloisons || 'Non spécifié'} ml` : ''}

${quoteDomain === 'isolation' ? 
  `- Type d'isolant : ${otherQuestionnaireData.typeIsolant || 'Non spécifié'}` : ''}

${quoteDomain === 'couverture' ? 
  `- Type de toiture : ${otherQuestionnaireData.typeToiture || 'Non spécifié'}` : ''}

- Contraintes spécifiques : ${otherQuestionnaireData.contraintesSpecifiques || 'Aucune'}

L'utilisateur souhaite obtenir un devis clair et professionnel.

Voici ses instructions personnalisées :
"${userInstructions || 'Aucune instruction spécifique fournie'}"

**Consignes :**
Merci de me retourner un **devis complet au format JSON**, structuré **exactement** selon le schéma décrit ci-dessous, sans aucun commentaire ni texte hors JSON.

Structure du JSON attendu :
- projet (string): Titre du projet
- description (string): Description détaillée des travaux
- materiaux (array): Liste des matériaux nécessaires
  * nom (string): Nom du matériau
  * quantité (number): Quantité nécessaire
  * unité (string): Unité de mesure (m, m2, unité, etc.)
  * prix_unitaire (number): Prix unitaire en euros
- main_oeuvre (object): Informations sur la main d'oeuvre
  * heures_estimees (number): Nombre d'heures estimées
  * taux_horaire (number): Taux horaire en euros
  * total (number): Total main d'oeuvre en euros
- postes (array): Autres postes de dépenses
  * nom (string): Nom du poste
  * prix (number): Prix du poste en euros
- total_ht (number): Total HT en euros
- tva (number): Montant de la TVA en euros
- total_ttc (number): Total TTC en euros
`;

    console.log("Prompt détaillé construit :", detailedPrompt);

    // Instanciation des dépendances
    const devisGenerator = new OpenAIDevisGeneratorAdapter();
    const generateDevisUseCase = new GenerateDevisUseCase(devisGenerator);

    // Exécution du cas d'utilisation avec le prompt détaillé
    const devis: Devis = await generateDevisUseCase.execute(detailedPrompt);

    console.log('Devis généré avec succès, sauvegarde en base de données...');
    
    // Récupérer la session utilisateur pour l'ID
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.error('Utilisateur non authentifié');
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }
    
    const userId = session.user.id as string;
    const { clientId } = body;
    
    if (!clientId) {
      console.error('ID client manquant');
      return NextResponse.json({ error: 'ID client requis' }, { status: 400 });
    }
    
    try {
      // Générer un numéro de devis unique avec l'année et un compteur
      const year = new Date().getFullYear();
      const lastQuote = await prisma.quote.findFirst({
        where: {
          quoteNumber: {
            startsWith: `DEV-${year}-`
          }
        },
        orderBy: {
          quoteNumber: 'desc'
        }
      });
      
      let quoteNumber = `DEV-${year}-001`;
      
      if (lastQuote) {
        const lastNumber = parseInt(lastQuote.quoteNumber.split('-')[2]);
        quoteNumber = `DEV-${year}-${(lastNumber + 1).toString().padStart(3, '0')}`;
      }
      
      console.log(`Génération du numéro de devis: ${quoteNumber}`);
      console.log(`Enregistrement du devis pour client ID: ${clientId} et utilisateur ID: ${userId}`);
      console.log(`--------- Début des données détaillées ---------`);
      console.log(`Type de clientId: ${typeof clientId}`);
      console.log(`Valeur de clientId: ${clientId}`);
      console.log(`Type de userId: ${typeof userId}`);
      console.log(`Valeur de userId: ${userId}`);

      // Vérifier si le client existe
      try {
        const clientExists = await prisma.client.findUnique({ where: { id: clientId } });
        console.log(`Client existe: ${!!clientExists}`, clientExists ? `(${clientExists.name})` : '');
      } catch (checkError) {
        console.error('Erreur lors de la vérification du client:', checkError);
      }

      // Vérifier si l'utilisateur existe
      try {
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        console.log(`Utilisateur existe: ${!!userExists}`, userExists ? `(${userExists.email})` : '');
      } catch (checkError) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', checkError);
      }
      
      // Calculer le montant total à partir du devis généré
      const totalAmount = devis.total_ttc;
      console.log(`Montant total du devis: ${totalAmount}`);
      console.log(`Type de totalAmount: ${typeof totalAmount}`);
      
      // Vérifier que les données nécessaires existent avant de tenter la création
      if (!devis.materiaux || !Array.isArray(devis.materiaux)) {
        console.error('Erreur: les matériaux ne sont pas un tableau valide', devis.materiaux);
        return NextResponse.json({
          ...devis,
          dbError: "Structure des matériaux invalide dans le devis généré"
        }, { status: 207 });
      }
      
      if (!devis.main_oeuvre || typeof devis.main_oeuvre !== 'object') {
        console.error('Erreur: la main d\'oeuvre n\'est pas un objet valide', devis.main_oeuvre);
        return NextResponse.json({
          ...devis,
          dbError: "Structure de la main d'oeuvre invalide dans le devis généré"
        }, { status: 207 });
      }
      
      if (!devis.postes || !Array.isArray(devis.postes)) {
        console.error('Erreur: les postes ne sont pas un tableau valide', devis.postes);
        return NextResponse.json({
          ...devis,
          dbError: "Structure des postes de dépenses invalide dans le devis généré"
        }, { status: 207 });
      }
      
      // Log des données pour le débogage
      console.log('Détails des matériaux:');
      devis.materiaux.forEach((m: any, i) => {
        // Utiliser les propriétés sans accents pour la compatibilité TypeScript
        const quantite = m.quantite || m.quantité || 0;
        const unite = m.unite || m.unité || '';
        console.log(`Matériau #${i + 1}:`, {
          nom: m.nom,
          quantite: quantite,
          unite: unite,
          prix_unitaire: m.prix_unitaire,
          type_quantite: typeof quantite,
          type_prix: typeof m.prix_unitaire
        });
      });
      
      console.log('Détails main d\'oeuvre:', {
        heures: devis.main_oeuvre.heures_estimees,
        taux: devis.main_oeuvre.taux_horaire,
        type_heures: typeof devis.main_oeuvre.heures_estimees,
        type_taux: typeof devis.main_oeuvre.taux_horaire
      });
      
      console.log('Détails des postes:');
      devis.postes.forEach((p, i) => {
        console.log(`Poste #${i + 1}:`, {
          nom: p.nom,
          prix: p.prix,
          type_prix: typeof p.prix
        });
      });
      
      console.log('--------- Début de la création du devis ---------');

      // Préparation des données pour Prisma
      // Conversion des valeurs numériques au bon format si nécessaire
      const materialsItems = devis.materiaux.map((materiau: any) => {
        // Assurer la compatibilité TypeScript en utilisant les noms sans accents
        const quantiteValue = (materiau as any).quantite || (materiau as any).quantité || 0;
        const uniteValue = (materiau as any).unite || (materiau as any).unité || '';
        
        // Conversion des valeurs au bon format si nécessaire
        const quantity = typeof quantiteValue === 'string' ? parseInt(quantiteValue, 10) : quantiteValue;
        const unitPrice = typeof materiau.prix_unitaire === 'string' ? parseFloat(materiau.prix_unitaire) : materiau.prix_unitaire;
        
        return {
          description: `${materiau.nom} (${quantiteValue} ${uniteValue})`,
          quantity: isNaN(quantity) ? 1 : quantity, // Valeur par défaut si NaN
          unitPrice: isNaN(unitPrice) ? 0 : unitPrice, // Valeur par défaut si NaN
          taxRate: 20 // TVA par défaut
        };
      });

      // Conversion des valeurs de main d'oeuvre 
      const hoursQuantity = typeof devis.main_oeuvre.heures_estimees === 'string' ? 
        parseInt(devis.main_oeuvre.heures_estimees, 10) : devis.main_oeuvre.heures_estimees;
      const hourlyRate = typeof devis.main_oeuvre.taux_horaire === 'string' ? 
        parseFloat(devis.main_oeuvre.taux_horaire) : devis.main_oeuvre.taux_horaire;
      
      const laborItem = {
        description: `Main d'oeuvre (${devis.main_oeuvre.heures_estimees} heures)`,
        quantity: hoursQuantity,
        unitPrice: hourlyRate,
        taxRate: 20 // TVA par défaut
      };

      // Conversion des valeurs des autres postes
      const otherItems = devis.postes.map((poste: any) => {
        const price = typeof poste.prix === 'string' ? parseFloat(poste.prix) : poste.prix;
        
        return {
          description: poste.nom,
          quantity: 1,
          unitPrice: price,
          taxRate: 20 // TVA par défaut
        };
      });

      // Combiner tous les items
      const allItems = [...materialsItems, laborItem, ...otherItems];
      
      console.log(`Nombre total d'items à créer: ${allItems.length}`);
      console.log('Exemple de quelques items formatés:');
      console.log(JSON.stringify(allItems.slice(0, 2), null, 2));
      
      // Créer le devis dans la base de données
      const newQuote = await prisma.quote.create({
        data: {
          quoteNumber,
          totalAmount: typeof totalAmount === 'string' ? parseFloat(totalAmount) : totalAmount,
          status: "DRAFT",
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours par défaut
          notes: devis.description,
          
          // Lier au client
          client: {
            connect: { id: clientId }
          },
          
          // Lier à l'utilisateur
          user: {
            connect: { id: userId }
          },
          
          // Créer les éléments du devis avec les valeurs formatées
          items: {
            create: allItems
          }
        },
        include: {
          client: true,
          items: true
        }
      });
      
      console.log(`Devis ${quoteNumber} créé avec succès en base de données avec l'ID: ${newQuote.id}`);
      
      // Retourner le devis généré accompagné de son ID en base de données
      return NextResponse.json({
        ...devis,
        dbQuote: newQuote
      }, { status: 201 });
    } catch (dbError: any) {
      console.error('Erreur lors de l\'enregistrement du devis en BDD:', dbError);
      console.error('Détails complets de l\'erreur:', JSON.stringify(dbError, null, 2));
      
      // Détaillez l'erreur pour faciliter le débogage
      let errorMessage = "Erreur lors de l'enregistrement en base de données";
      
      if (dbError.code === 'P2025') {
        errorMessage = "Client ou utilisateur non trouvé. Vérifiez les IDs fournis.";
        console.error('Erreur de relation:', dbError.meta);
      } else if (dbError.code === 'P2002') {
        errorMessage = "Contrainte d'unicité violée. Un devis similaire existe déjà.";
        console.error('Champ en conflit:', dbError.meta?.target);
      } else if (dbError.code === 'P2003') {
        errorMessage = "Contrainte de clé étrangère non respectée.";
        console.error('Champ en conflit:', dbError.meta?.field_name);
      } else if (dbError.code === 'P2019') {
        errorMessage = "Erreur de format de données. Une valeur a un format invalide.";
        console.error('Informations sur l\'erreur:', dbError.meta);
      }
      
      // Si l'enregistrement échoue, on renvoie quand même le devis généré
      return NextResponse.json({
        ...devis,
        dbError: errorMessage
      }, { status: 207 }); // 207 Multi-Status pour indiquer succès partiel
    }

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
