"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Types
export interface QuestionnaireData {
  clientName: string;
  clientContact: string;
  clientEmail: string;
  clientPhone: string;
  projectName: string;
  projectDescription: string;
  budget: string;
  deadline: string;
  specificRequirements: string;
  btpBranche?: string;
}

export interface QuoteDetails {
  surface?: string;
  hauteur?: string;
  nombrePieces?: string;
  nombreNiveaux?: string;
  ancienneteBatiment?: string;
  typeTravaux?: string;
  typeIsolation?: string;
  etatActuel?: string;
  gamme?: string;
  delaiSouhaite?: string;
  contraintes?: string;
  // Champs spécifiques à la plomberie
  typeInstallation?: string;
  nombrePoints?: string;
  typeChaudiereActuel?: string;
  nombreRadiateurs?: string;
  typeChauffageSouhaite?: string;
  // Champs spécifiques à l'électricité
  puissanceCompteur?: string;
  typeTableau?: string;
  nombreCircuits?: string;
  dispositifsSecurite?: string;
  domotique?: boolean;
  installationsSpecifiques?: string;
  // Champs spécifiques à la menuiserie
  typeMateriau?: string;
  nombreOuvertures?: string;
  dimensions?: string;
  isolation?: string;
  securite?: string;
  esthetique?: string;
}

// Interface pour les modèles de questionnaire
export interface QuestionnaireModel {
  id: string;
  name: string;
}

export default function useQuoteGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<string | undefined>(undefined);
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>(undefined);
  const [useQuestionnaire, setUseQuestionnaire] = useState(true);
  const [questionnaireData, setQuestionnaireData] = useState<Partial<QuestionnaireData>>({});
  const [quoteDetails, setQuoteDetails] = useState<Partial<QuoteDetails>>({});
  const [generatedQuote, setGeneratedQuote] = useState<any>(null);
  const [editedQuote, setEditedQuote] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revisionInstructions, setRevisionInstructions] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [domains, setDomains] = useState<QuestionnaireModel[]>([
    { id: "btp_electricite", name: "Électricité" },
    { id: "btp_plomberie", name: "Plomberie" },
    { id: "btp_menuiserie", name: "Menuiserie" },
    { id: "btp_general", name: "Bâtiment Général" }
  ]);

  // Récupérer les clients (simulation)
  useEffect(() => {
    // Normalement ici on ferait un appel API
    const mockClients = [
      { id: '1', name: 'Dupont SAS', email: 'contact@dupont.fr', phone: '01 23 45 67 89' },
      { id: '2', name: 'Martin Construction', email: 'info@martin.fr', phone: '01 23 45 67 90' },
      { id: '3', name: 'Bernard Rénovations', email: 'contact@bernard.fr', phone: '01 23 45 67 91' },
    ];
    setClients(mockClients);
  }, []);

  // Navigation entre étapes
  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  
  // Validation avant de passer à l'étape suivante
  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (!selectedClient || !selectedDomain) {
          toast.error("Veuillez sélectionner un client et un domaine");
          return false;
        }
        return true;
        
      case 2:
        if (useQuestionnaire) {
          const requiredFields = ["projectName", "projectDescription", "clientName", "clientEmail"];
          const missingFields = requiredFields.filter(field => !questionnaireData[field as keyof QuestionnaireData]);
          
          if (missingFields.length > 0) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return false;
          }
        }
        return true;
        
      case 3:
        // Validation spécifique selon le domaine
        if (selectedDomain === "btp_electricite") {
          if (!quoteDetails.puissanceCompteur || !quoteDetails.typeTableau) {
            toast.error("Veuillez remplir les champs obligatoires pour l'électricité");
            return false;
          }
        } else if (selectedDomain === "btp_plomberie") {
          if (!quoteDetails.typeInstallation || !quoteDetails.nombrePoints) {
            toast.error("Veuillez remplir les champs obligatoires pour la plomberie");
            return false;
          }
        } else if (selectedDomain === "btp_menuiserie") {
          if (!quoteDetails.typeMateriau || !quoteDetails.nombreOuvertures) {
            toast.error("Veuillez remplir les champs obligatoires pour la menuiserie");
            return false;
          }
        }
        return true;
        
      default:
        return true;
    }
  };

  // Passage à l'étape suivante avec validation
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      nextStep();
      
      // Si on passe à l'étape 4 (récapitulatif), préparer le récapitulatif
      if (currentStep === 3) {
        // Dans un cas réel, on pourrait faire un appel API ici
        setIsSubmitting(true);
        setTimeout(() => {
          setIsSubmitting(false);
        }, 1000);
      }
      
      // Si on passe à l'étape 5 (édition), générer un devis
      if (currentStep === 4) {
        handleSubmit();
      }
    }
  };
  
  // Soumission du formulaire pour générer un devis
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simuler un appel API
      await new Promise(r => setTimeout(r, 1500));
      
      // Créer le devis à partir du questionnaire et des détails
      const quote = createQuoteFromQuestionnaire();
      setGeneratedQuote(quote);
      setEditedQuote(JSON.parse(JSON.stringify(quote))); // Deep copy
      nextStep(); // Passer à l'étape 5 (édition)
      
      toast.success("Devis généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du devis:", error);
      toast.error("Erreur lors de la génération du devis");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Créer un devis à partir des données du questionnaire
  const createQuoteFromQuestionnaire = () => {
    // Trouver le client sélectionné
    const client = clients.find(c => c.id === selectedClient);
    
    // Générer un numéro de devis avec la date actuelle
    const today = new Date();
    const quoteNumber = `DEV-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    
    // Créer le devis avec données simulées basées sur les inputs
    return {
      id: Date.now().toString(),
      number: quoteNumber,
      title: `Devis - ${questionnaireData.projectName || 'Projet sans nom'}`,
      client: {
        id: client?.id || '',
        name: client?.name || questionnaireData.clientName || '',
        email: client?.email || questionnaireData.clientEmail || '',
        phone: client?.phone || questionnaireData.clientPhone || '',
      },
      project: {
        name: questionnaireData.projectName || '',
        description: questionnaireData.projectDescription || '',
        domain: selectedDomain || '',
        details: { ...quoteDetails }
      },
      materiaux: [
        {
          id: '1',
          nom: 'Matériau principal',
          description: 'Matériau de base pour le projet',
          quantité: 10,
          unité: 'unité',
          prix_unitaire: 45.5
        },
        {
          id: '2',
          nom: 'Fourniture secondaire',
          description: 'Élément complémentaire',
          quantité: 5,
          unité: 'lot',
          prix_unitaire: 89
        }
      ],
      postes: [
        {
          id: '1',
          nom: 'Installation',
          description: 'Mise en place des éléments',
          prix: 450
        }
      ],
      main_oeuvre: {
        heures_estimees: 14,
        taux_horaire: 45
      },
      status: 'DRAFT',
      notes: questionnaireData.specificRequirements || '',
      validity: 30, // 30 jours par défaut
      created_at: new Date().toISOString(),
      totalHT: 0, // Sera calculé par le composant
      totalTTC: 0, // Sera calculé par le composant
      tva: 20 // TVA à 20% par défaut
    };
  };
  
  // Régénération du devis avec instructions
  const regenerateQuote = async () => {
    if (!revisionInstructions.trim()) {
      toast.error("Veuillez entrer des instructions pour la régénération");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simuler un appel à une API ou une IA
      await new Promise(r => setTimeout(r, 2000));
      
      // Simuler une modification du devis basée sur les instructions
      const revisedQuote = JSON.parse(JSON.stringify(generatedQuote)); // Deep copy
      
      // Ajout d'un exemple simple de modification basée sur les instructions
      if (revisionInstructions.toLowerCase().includes('remise')) {
        // Ajout d'une remise de 10%
        revisedQuote.remise = 10;
        revisedQuote.totalHT = revisedQuote.totalHT ? revisedQuote.totalHT * 0.9 : 0;
        revisedQuote.totalTTC = revisedQuote.totalTTC ? revisedQuote.totalTTC * 0.9 : 0;
      }
      
      if (revisionInstructions.toLowerCase().includes('détail') || revisionInstructions.toLowerCase().includes('detail')) {
        // Ajout d'un service supplémentaire pour détailler
        revisedQuote.postes.push({
          id: Date.now().toString(),
          nom: 'Service détaillé supplémentaire',
          description: 'Ajout suite à votre demande de détails supplémentaires',
          prix: 250
        });
      }
      
      setEditedQuote(revisedQuote);
      toast.success("Devis régénéré avec succès");
      
      // Vider les instructions
      setRevisionInstructions('');
      
    } catch (error) {
      toast.error("Erreur lors de la régénération du devis");
      console.error("Erreur régénération:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Sauvegarde des modifications
  const saveEditedQuote = async () => {
    setIsSubmitting(true);
    
    try {
      // En production, appel API pour sauvegarder les modifications
      await new Promise(r => setTimeout(r, 1000));
      
      // Mettre à jour l'état du devis généré avec les modifications
      setGeneratedQuote(JSON.parse(JSON.stringify(editedQuote))); // Deep copy
      
      toast.success("Modifications enregistrées avec succès");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde des modifications");
      console.error("Erreur sauvegarde:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Génération du PDF
  const generateAndDownloadPDF = async () => {
    const quoteElement = document.getElementById("quote-preview");
    if (!quoteElement) {
      toast.error("Impossible de générer le PDF: élément non trouvé");
      return;
    }
    
    try {
      toast.info("Génération du PDF en cours...");
      
      const canvas = await html2canvas(quoteElement, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions en mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculer le rapport hauteur/largeur
      const imgWidth = 210; // A4 width in mm (210 x 297)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Si le contenu dépasse une page
      if (imgHeight > 297) {
        let heightLeft = imgHeight - 297;
        let position = -297;
        
        while (heightLeft >= 0) {
          position = position - 297;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= 297;
        }
      }
      
      // Nom du fichier avec date
      const date = new Date().toISOString().split('T')[0];
      const title = editedQuote?.title || 'Devis';
      const fileName = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}_${date}.pdf`;
      
      // Télécharger le PDF
      pdf.save(fileName);
      toast.success("PDF généré avec succès");
      
    } catch (error) {
      toast.error("Erreur lors de la génération du PDF");
      console.error("Erreur PDF:", error);
    }
  };
  
  return {
    currentStep,
    setCurrentStep,
    selectedClient,
    setSelectedClient,
    selectedDomain,
    setSelectedDomain,
    useQuestionnaire,
    setUseQuestionnaire,
    questionnaireData,
    setQuestionnaireData,
    quoteDetails,
    setQuoteDetails,
    generatedQuote,
    setGeneratedQuote,
    editedQuote,
    setEditedQuote,
    isSubmitting,
    revisionInstructions,
    setRevisionInstructions,
    clients,
    domains,
    nextStep,
    prevStep,
    handleNextStep,
    handleSubmit,
    validateStep,
    regenerateQuote,
    saveEditedQuote,
    generateAndDownloadPDF
  };
}
