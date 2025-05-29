"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";
import { QuestionnaireData, DevisRequestPayload } from '@/types/devis';
import { Poste } from '@/domain/models/Devis';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

// Importation des composants pour le formulaire dynamique
import { DynamicQuestionnaire } from "@/components/dynamic-form/DynamicQuestionnaire";
import { DomainSelection } from "@/components/form-sections/DomainSelection";
import QuotePreview from "@/components/quotes/QuotePreview";

// Importation de la configuration du questionnaire
import { 
  questionnaires, 
  getQuestionnaireById, 
  shouldDisplaySection, 
  shouldDisplayQuestion 
} from "@/config/questionnaireModels";

interface Client {
  id: string;
  name: string;
  email?: string;
}

const TOTAL_STEPS = 5;

export default function NewQuoteGenerator() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  // Fonction pour générer et télécharger le PDF
  const generateAndDownloadPDF = async () => {
    if (!previewRef.current || !generatedQuote) return;
    
    setPdfGenerating(true);
    try {
      // Préparation du conteneur pour la capture
      const container = previewRef.current;
      container.style.width = '210mm'; // Largeur A4
      container.style.backgroundColor = 'white';
      container.style.padding = '20px';
      
      // Générer le PDF à partir du contenu HTML
      const canvas = await html2canvas(container, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      
      // Télécharger le PDF
      pdf.save(`Devis_${generatedQuote.number || 'sans-numero'}.pdf`);

      toast.success('PDF généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setPdfGenerating(false);
    }
  };
  const [selectedClient, setSelectedClient] = useState<string | undefined>(undefined);
  // Nouvel état pour le domaine sélectionné
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>(undefined);
  
  // États pour le devis généré et l'édition
  const [generatedQuote, setGeneratedQuote] = useState<any>(null);
  const [editedQuote, setEditedQuote] = useState<any>(null);
  const [revisionInstructions, setRevisionInstructions] = useState<string>("");
  
  // États pour gérer l'affichage des champs Input "Autre"
  const [showOtherBrancheInput, setShowOtherBrancheInput] = useState(false);
  const [showOtherToitureInput, setShowOtherToitureInput] = useState(false);
  const [showOtherIsolantInput, setShowOtherIsolantInput] = useState(false);

  // Obtenir le questionnaire du domaine sélectionné
  const selectedQuestionnaireModel = selectedDomain ? getQuestionnaireById(selectedDomain) : undefined;
  
  // Dans cette version, chaque étape est clairement définie
  const TOTAL_STEPS = selectedDomain ? 3 : 4; // 3 étapes avec questionnaire dynamique, 4 avec l'ancien système

  const [questionnaireData, setQuestionnaireData] = useState<Partial<QuestionnaireData> & {otherBranche?: string}>({
    quoteDomain: '',
    brancheBtp: '',
    typeProjet: '',
    typeBatiment: '',
    surfaceTotale: undefined,
    pointsElectriques: undefined,
    contraintesSpecifiques: '',
    tableauElectrique: false,
    nombrePointsEau: undefined,
    typeChauffage: undefined,
    mlMurs: undefined,
    mlCloisons: undefined,
    typeIsolant: '',
    typeToiture: '',
    otherBranche: ''
  });

  const [userInstructions, setUserInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const btpBranches = [
    { value: "électricité", label: "Électricité" },
    { value: "plomberie", label: "Plomberie" },
    { value: "maçonnerie", label: "Maçonnerie" },
    { value: "menuiserie", label: "Menuiserie" },
    { value: "peinture", label: "Peinture" },
    { value: "isolation", label: "Isolation" },
    { value: "autre", label: "Autre..." }
  ];
  
  const projectTypes = [
    { value: "construction_neuve", label: "Construction neuve" },
    { value: "renovation", label: "Rénovation" },
    { value: "extension", label: "Extension" },
    { value: "depannage", label: "Dépannage / Réparation" },
    { value: "autre", label: "Autre" },
  ];
  
  const buildingTypes = [
    { value: "maison_individuelle", label: "Maison individuelle" },
    { value: "appartement", label: "Appartement" },
    { value: "immeuble_collectif", label: "Immeuble collectif" },
    { value: "local_commercial", label: "Local commercial / Bureau" },
    { value: "batiment_industriel", label: "Bâtiment industriel" },
    { value: "autre", label: "Autre" },
  ];

  const roofTypes = [
    { value: "tuiles mécaniques", label: "Tuiles Mécaniques" },
    { value: "tuiles plates", label: "Tuiles Plates" },
    { value: "ardoise", label: "Ardoise" },
    { value: "zinc", label: "Zinc" },
    { value: "bac acier", label: "Bac Acier" },
    { value: "toiture terrasse", label: "Toiture Terrasse (Bitume, EPDM...)" },
    { value: "autre", label: "Autre (Préciser)" },
  ];

  const insulationTypes = [
    { value: "laine de verre", label: "Laine de Verre" },
    { value: "laine de roche", label: "Laine de Roche" },
    { value: "polyuréthane (pu)", label: "Polyuréthane (PU)" },
    { value: "polystyrène expansé (eps)", label: "Polystyrène Expansé (EPS)" },
    { value: "polystyrène extrudé (xps)", label: "Polystyrène Extrudé (XPS)" },
    { value: "ouate de cellulose", label: "Ouate de Cellulose" },
    { value: "fibre de bois", label: "Fibre de Bois" },
    { value: "liège", label: "Liège expansé" },
    { value: "autre", label: "Autre (Préciser)" },
  ];

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoadingClients(true);
      try {
        const response = await fetch("/api/clients");
        if (response.ok) {
          const clientsData = await response.json();
          setClients(clientsData);
        } else {
          console.error("Erreur lors du chargement des clients");
          toast.error("Impossible de charger la liste des clients.");
        }
      } catch (error) {
        console.error("Erreur fetchClients:", error);
        toast.error("Une erreur est survenue lors du chargement des clients.");
      } finally {
        setIsLoadingClients(false);
      }
    };

    if (session?.user) {
      fetchClients();
    }
  }, [session]);

  useEffect(() => {
    if (questionnaireData.brancheBtp && !btpBranches.some(b => b.value === questionnaireData.brancheBtp)) {
        setShowOtherBrancheInput(true);
    }
    if (questionnaireData.typeToiture && !roofTypes.some(t => t.value === questionnaireData.typeToiture)) {
        setShowOtherToitureInput(true);
    }
    if (questionnaireData.typeIsolant && !insulationTypes.some(i => i.value === questionnaireData.typeIsolant)) {
        setShowOtherIsolantInput(true);
    }
  }, []); // Exécuter une seule fois au montage

  const handleQuestionnaireChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | undefined = value;

    if ((name === 'surfaceTotale' || name === 'pointsElectriques' || name === 'nombrePointsEau' || name === 'mlMurs' || name === 'mlCloisons')) {
        parsedValue = value === '' ? undefined : parseFloat(value);
        if (isNaN(parsedValue as number)) {
            parsedValue = undefined;
        }
    }

    setQuestionnaireData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleClientChange = (value: string) => {
    setSelectedClient(value);
  };

  const handleDomainChange = (value: string) => {
    setSelectedDomain(value);
    // Mettre à jour quoteDomain dans questionnaireData
    setQuestionnaireData(prev => ({ ...prev, quoteDomain: value }));
  };

  const nextStep = () => {
    // Étape 1: Vérifier la sélection du client ET du domaine
    if (currentStep === 1) {
      if (!selectedClient) {
        toast.warning("Veuillez sélectionner un client.");
        return;
      }
      
      if (!selectedDomain) {
        toast.warning("Veuillez sélectionner un domaine pour le devis.");
        return;
      }
    }
    
    // Si on utilise l'ancien système de questionnaire
    if (!selectedQuestionnaireModel) {
      if (currentStep === 2 && (!questionnaireData.brancheBtp || !questionnaireData.typeProjet || !questionnaireData.typeBatiment)) {
        toast.warning("Veuillez remplir les informations principales du projet.");
        return;
      }
      if (currentStep === 3 && (!questionnaireData.surfaceTotale || questionnaireData.surfaceTotale <= 0)) {
          toast.warning("Veuillez indiquer une surface totale valide.");
          return;
      }
    }
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Rendu de l'étape 1 avec la sélection du client et du domaine
  const renderStep1 = () => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Configuration du Devis</CardTitle>
          <CardDescription>
            Sélectionnez le client et le domaine pour ce devis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Sélection du client */}
            <div className="grid gap-2">
              <Label htmlFor="client" className="text-base font-medium">Client *</Label>
              {isLoadingClients ? (
                <div className="space-y-2">
                  <div className="h-11 w-full rounded-md border border-input bg-background animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent shimmer-effect"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <Select 
                  value={selectedClient} 
                  onValueChange={handleClientChange}
                >
                  <SelectTrigger id="client" className="h-11">
                    <SelectValue placeholder="Sélectionner un client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-sm text-muted-foreground">Ou <Link href="/dashboard/clients/new" className="underline">créer un nouveau client</Link>.</p>
            </div>
            
            {/* Sélection du domaine */}
            <DomainSelection 
              domains={questionnaires} 
              selectedDomain={selectedDomain} 
              onChange={handleDomainChange} 
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            asChild
          >
            <Link href="/dashboard/quotes">
              Annuler
            </Link>
          </Button>
          <Button onClick={nextStep} disabled={!selectedClient || !selectedDomain}>Suivant</Button>
        </CardFooter>
      </Card>
    );
  };

  // Fonction pour formater les données du questionnaire pour l'affichage dans le récapitulatif
  const formatQuestionnaireDataForDisplay = () => {
    // Si on utilise le questionnaire dynamique basé sur le domaine
    if (selectedDomain && selectedQuestionnaireModel) {
      const items: { label: string; value: any }[] = [
        { label: "Client", value: clients.find(c => c.id === selectedClient)?.name || selectedClient },
        { label: "Domaine", value: selectedQuestionnaireModel.name },
      ];
      
      // Parcourir toutes les sections du questionnaire
      selectedQuestionnaireModel.sections.forEach(section => {
        if (shouldDisplaySection(section, questionnaireData)) {
          // Ajouter les questions visibles de cette section
          section.questions.forEach(question => {
            if (shouldDisplayQuestion(question, questionnaireData)) {
              let value = questionnaireData[question.id as keyof QuestionnaireData];
              
              // Formatage spécial pour certains types de valeurs
              if (value !== undefined && value !== null && value !== '') {
                // Formatage pour les nombres avec unités
                if (question.type === 'number') {
                  const numValue = value as number;
                  // Ajouter l'unité si approprié
                  if (question.id.includes('surface')) {
                    value = `${numValue} m²`;
                  } else if (question.id.includes('ml') || question.id.includes('metres')) {
                    value = `${numValue} ml`;
                  } else if (question.id.includes('hauteur')) {
                    value = `${numValue} m`;
                  }
                }
                
                // Formatage pour les checkbox
                if (question.type === 'checkbox') {
                  value = value ? 'Oui' : 'Non';
                }
                
                // Formatage pour les select (trouver le label correspondant à la valeur)
                if (question.type === 'select' && question.options) {
                  // Convertir en string pour la comparaison
                  const strValue = String(value);
                  const option = question.options.find(opt => opt.value === strValue);
                  if (option) {
                    value = option.label;
                  }
                }
                
                items.push({ label: question.label.replace(' *', ''), value });
              }
            }
          });
        }
      });
      
      return items;
    }
    
    // Ancien système pour rétrocompatibilité
    const items = [
      { label: "Branche BTP", value: questionnaireData.brancheBtp === 'autre' ? questionnaireData.otherBranche || "" : questionnaireData.brancheBtp },
      { label: "Type de projet", value: questionnaireData.typeProjet },
      { label: "Type de bâtiment", value: questionnaireData.typeBatiment },
      { label: "Surface totale", value: questionnaireData.surfaceTotale ? `${questionnaireData.surfaceTotale} m²` : undefined },
    ];

    // Ajouter les champs spécifiques selon la branche BTP sélectionnée
    if (questionnaireData.brancheBtp === "électricité") {
      items.push({ label: "Points électriques", value: questionnaireData.pointsElectriques ? `${questionnaireData.pointsElectriques}` : undefined });
      items.push({ label: "Tableau électrique à prévoir", value: questionnaireData.tableauElectrique ? "Oui" : "Non" });
    }

    if (questionnaireData.brancheBtp === "plomberie") {
      items.push({ label: "Nombre de points d'eau", value: questionnaireData.nombrePointsEau ? `${questionnaireData.nombrePointsEau}` : undefined });
      items.push({ label: "Type de chauffage", value: questionnaireData.typeChauffage });
    }

    if (questionnaireData.brancheBtp === "maçonnerie") {
      items.push({ label: "Mètres linéaires de murs", value: questionnaireData.mlMurs ? `${questionnaireData.mlMurs} ml` : undefined });
      items.push({ label: "Mètres linéaires de cloisons", value: questionnaireData.mlCloisons ? `${questionnaireData.mlCloisons} ml` : undefined });
    }

    if (["plâtrerie", "isolation"].includes(questionnaireData.brancheBtp || "")) {
      items.push({ label: "Type d'isolant", value: questionnaireData.typeIsolant });
    }

    if (questionnaireData.brancheBtp === "couverture") {
      items.push({ label: "Type de toiture", value: questionnaireData.typeToiture });
    }

    // Filtrer les items qui n'ont pas de valeur définie ou vide
    return items.filter(item => item.value !== undefined && item.value !== "");
  };
  
  // Fonction pour générer le devis à partir des données du questionnaire
  const createQuoteFromQuestionnaire = async (clientId: string, data: Partial<QuestionnaireData>, instructions: string) => {
    try {
      setIsSubmitting(true);
      toast.info("Génération du devis en cours...");
      
      // S'assurer que toutes les données nécessaires sont présentes
      const completeData: QuestionnaireData = {
        quoteDomain: selectedDomain || "",
        brancheBtp: data.brancheBtp || "",
        typeProjet: data.typeProjet || "",
        typeBatiment: data.typeBatiment || "",
        surfaceTotale: data.surfaceTotale || 0,
        contraintesSpecifiques: data.contraintesSpecifiques || "",
        // Champs optionnels
        pointsElectriques: data.pointsElectriques,
        tableauElectrique: data.tableauElectrique,
        nombrePointsEau: data.nombrePointsEau,
        typeChauffage: data.typeChauffage,
        typeToiture: data.typeToiture,
        mlMurs: data.mlMurs,
        mlCloisons: data.mlCloisons,
        typeIsolant: data.typeIsolant
      };
      
      const payload: DevisRequestPayload = {
        clientId: clientId, // Important: vérifier que clientId est bien défini
        questionnaireData: completeData,
        userInstructions: instructions.trim(),
      };
      
      console.log("Payload pour génération de devis:", { clientId, questionnaireData: completeData });
      
      const response = await fetch('/api/devis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const result = await response.json();
      
      // Vérifier si l'enregistrement en base de données a réussi
      if (result.dbError) {
        console.error("Erreur d'enregistrement en BDD:", result.dbError);
        toast.error(`Le devis a été généré mais n'a pas pu être enregistré. ${result.dbError}`);
        // Continuer quand même pour permettre l'édition du devis généré
      } else if (result.dbQuote) {
        toast.success("Devis généré et enregistré avec succès! Vous pouvez maintenant le modifier.");
        console.log("Devis enregistré en BDD avec l'ID:", result.dbQuote.id);
      } else {
        toast.warning("Devis généré mais son état d'enregistrement est incertain.");
      }
      
      // Stocker le devis dans l'état
      setGeneratedQuote(result);
      setEditedQuote(JSON.parse(JSON.stringify(result))); // Copie profonde pour édition
      
      // Passer à l'étape d'édition du devis
      setCurrentStep(5);
      setIsSubmitting(false);
      
    } catch (error) {
      console.error('Erreur lors de la génération du devis:', error);
      toast.error("Une erreur est survenue lors de la génération du devis.");
      setIsSubmitting(false);
    }
  };

  // Fonction pour régénérer le devis avec de nouvelles instructions
  const regenerateQuote = async () => {
    if (!selectedClient || !revisionInstructions.trim()) {
      toast.warning("Veuillez fournir des instructions pour la révision.");
      return;
    }
    
    setIsSubmitting(true);
    toast.info("Régénération du devis en cours avec vos nouvelles instructions...");
    
    try {
      // Utiliser les mêmes données que précédemment mais avec les nouvelles instructions
      await createQuoteFromQuestionnaire(selectedClient, questionnaireData, revisionInstructions);
    } catch (error) {
      console.error('Erreur lors de la régénération du devis:', error);
      toast.error("Une erreur est survenue lors de la régénération du devis.");
      setIsSubmitting(false);
    }
  };

  // Fonction pour enregistrer le devis modifié
  const saveEditedQuote = async () => {
    if (!editedQuote || !selectedClient) return;
    
    setIsSubmitting(true);
    toast.info("Enregistrement du devis en cours...");
    
    try {
      console.log("Devis à enregistrer:", editedQuote);
      
      // Convertir les objets materiaux, services (postes/main d'oeuvre) en format items
      const items = [];
      
      // Ajouter les matériaux comme items
      if (editedQuote.materiaux && Array.isArray(editedQuote.materiaux)) {
        editedQuote.materiaux.forEach((materiau: any) => {
          // Vérifier que toutes les propriétés requises existent
          if (materiau && materiau.nom && typeof materiau.quantité === 'number' && typeof materiau.prix_unitaire === 'number') {
            items.push({
              description: `${materiau.nom} (${materiau.quantité} ${materiau.unité || 'unité'})`,
              quantity: materiau.quantité,
              unitPrice: materiau.prix_unitaire,
              taxRate: 20 // TVA par défaut
            });
          }
        });
      }
      
      // Fusionner main d'oeuvre et services (postes) puisque c'est la même chose
      // D'abord, collecter les services depuis la main d'oeuvre si elle existe
      if (editedQuote.main_oeuvre && typeof editedQuote.main_oeuvre === 'object') {
        // Ajouter la main d'oeuvre comme un service
        const mainOeuvreHeures = editedQuote.main_oeuvre.heures_estimees || 0;
        const mainOeuvreTaux = editedQuote.main_oeuvre.taux_horaire || 0;
        
        if (mainOeuvreHeures > 0 && mainOeuvreTaux > 0) {
          // Soit aucun tableau postes n'existe encore, soit on l'utilise
          if (!editedQuote.postes || !Array.isArray(editedQuote.postes)) {
            editedQuote.postes = [];
          }
          
          // Vérifier si un service de main d'oeuvre existe déjà
          const existingServiceIndex = editedQuote.postes.findIndex((p: any) => 
            p.nom && p.nom.toLowerCase().includes('main') && p.nom.toLowerCase().includes('oeuvre')
          );
          
          if (existingServiceIndex >= 0) {
            // Mettre à jour le service existant
            editedQuote.postes[existingServiceIndex].prix = mainOeuvreHeures * mainOeuvreTaux;
          } else {
            // Ajouter un nouveau service pour la main d'oeuvre
            editedQuote.postes.push({
              nom: `Main d'oeuvre (${mainOeuvreHeures} heures)`,
              prix: mainOeuvreHeures * mainOeuvreTaux
            });
          }
        }
      }
      
      // Maintenant, ajouter tous les services (postes) comme items
      if (editedQuote.postes && Array.isArray(editedQuote.postes)) {
        editedQuote.postes.forEach((poste: any) => {
          if (poste && poste.nom && typeof poste.prix === 'number') {
            items.push({
              description: poste.nom,
              quantity: 1,
              unitPrice: poste.prix,
              taxRate: 20 // TVA par défaut
            });
          }
        });
      }
      
      // S'il y a déjà des items, les utiliser aussi
      if (editedQuote.items && Array.isArray(editedQuote.items)) {
        items.push(...editedQuote.items);
      }
      
      // Préparer les données du devis pour l'API
      const quoteData = {
        clientId: selectedClient,
        status: editedQuote.status || 'DRAFT',
        notes: editedQuote.description || editedQuote.notes || '',
        expiryDate: editedQuote.expiryDate,
        items: items, // Utiliser les items convertis
        // S'il s'agit d'une modification, inclure l'ID du devis existant
        ...(editedQuote.id ? { id: editedQuote.id } : {}),
        // Inclure le client name comme backup si l'ID client ne fonctionne pas
        ...(editedQuote.clientName ? { clientName: editedQuote.clientName } : {})
      };
      
      console.log("Payload envoyé à l'API:", quoteData);
      
      // Envoyer les données à l'API
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      // Récupérer le texte de la réponse pour le débogage
      const responseText = await response.text();
      console.log("Réponse brute de l'API:", responseText);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${responseText}`);
      }

      // Parser le JSON (après avoir lu le texte)
      const savedQuote = JSON.parse(responseText);
      console.log("Devis enregistré avec succès:", savedQuote);
      
      toast.success("Devis enregistré avec succès!");
      // Mettre à jour le devis original avec les données sauvegardées
      setGeneratedQuote(savedQuote);
      setEditedQuote(JSON.parse(JSON.stringify(savedQuote)));
      setIsSubmitting(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du devis:', error);
      toast.error("Une erreur est survenue lors de l'enregistrement du devis: " + (error as Error).message);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification que nous avons bien un client sélectionné
    if (!selectedClient) {
      toast.error("Veuillez sélectionner un client.");
      setCurrentStep(1);
      return;
    }
    
    // Vérification de base (client et domaine)
    if (!selectedClient) {
      toast.error("Veuillez sélectionner un client.");
      setCurrentStep(1);
      return;
    }
    
    if (!selectedDomain) {
      toast.error("Veuillez sélectionner un domaine de devis.");
      setCurrentStep(1);
      return;
    }
    
    // Si on utilise le nouveau système de questionnaire dynamique
    if (selectedQuestionnaireModel) {
      // Vérification des champs obligatoires du questionnaire dynamique
      const requiredFields = selectedQuestionnaireModel.sections
        .flatMap(section => section.questions)
        .filter(question => question.required);
      
      const missingFields = requiredFields.filter(question => {
        const value = questionnaireData[question.id as keyof QuestionnaireData];
        return value === undefined || value === null || value === '';
      });
      
      if (missingFields.length > 0) {
        toast.error(`Certains champs obligatoires sont manquants (${missingFields.length}). Veuillez vérifier le formulaire.`);
        return;
      }
    } 
    // Sinon, utilisation de l'ancien système
    else if (!questionnaireData.brancheBtp || !questionnaireData.typeProjet || !questionnaireData.typeBatiment || !questionnaireData.surfaceTotale || questionnaireData.surfaceTotale <= 0) {
      toast.error("Certains champs obligatoires sont manquants. Veuillez vérifier les étapes précédentes.");
      return;
    }
    
    // Appel API pour générer le devis
    createQuoteFromQuestionnaire(selectedClient, questionnaireData, userInstructions);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">  
        <h1 className="text-2xl font-bold">Nouveau Devis</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/quotes">Retour aux devis</Link>
        </Button>
      </div>

      {/* Structure principale en deux colonnes */}
      <div className="flex flex-col md:flex-row gap-8">

        {/* --- Colonne Gauche: Questionnaire --- */}
        <div className="md:w-2/3">
          {/* Contenu de l'étape actuelle */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- Étape 1: Client et Domaine --- */}
            {currentStep === 1 && (
              renderStep1()
            )}

            {/* --- Étape 2: Questionnaire Dynamique ou Infos Projet --- */}
            {currentStep === 2 && (
              selectedQuestionnaireModel ? (
                // Utilisation du questionnaire dynamique si un domaine est sélectionné
                <DynamicQuestionnaire
                  questionnaire={selectedQuestionnaireModel}
                  formData={questionnaireData}
                  onUpdate={(newData) => setQuestionnaireData(newData)}
                  onSubmit={() => {
                    // Appel direct sans événement
                    // La fonction handleSubmit est adaptée pour gérer à la fois les événements et les appels directs
                    setIsSubmitting(true);
                    const clientId = selectedClient;
                    if (clientId) {
                      createQuoteFromQuestionnaire(clientId, questionnaireData, userInstructions);
                    } else {
                      setIsSubmitting(false);
                      toast.error("Client non sélectionné. Veuillez retourner à l'étape 1.");
                    }
                  }}
                  isSubmitting={isSubmitting}
                />
              ) : (
                // Ancien affichage pour compatibilité
                <Card>
                  <CardHeader>
                    <CardTitle>Étape 2: Informations Générales du Projet</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    {/* Type de branche BTP */}
                    <div className="grid gap-2">
                      <Label htmlFor="brancheBtp">Branche BTP *</Label>
                      <Select 
                        value={questionnaireData.brancheBtp} 
                        onValueChange={(value) => {
                          setQuestionnaireData({...questionnaireData, brancheBtp: value});
                          setShowOtherBrancheInput(value === "autre");
                        }}
                      >
                        <SelectTrigger id="brancheBtp">
                          <SelectValue placeholder="Sélectionner la branche BTP..." />
                        </SelectTrigger>
                        <SelectContent>
                          {btpBranches.map((branch) => (
                            <SelectItem key={branch.value} value={branch.value}>
                              {branch.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {showOtherBrancheInput && (
                        <Input 
                          placeholder="Précisez la branche BTP..." 
                          value={questionnaireData.brancheBtp === "autre" ? questionnaireData.otherBranche || "" : ""} 
                          onChange={(e) => setQuestionnaireData({...questionnaireData, otherBranche: e.target.value})}
                        />
                      )}
                    </div>

                    {/* Type de projet */}
                    <div className="grid gap-2">
                      <Label htmlFor="typeProjet">Type de Projet *</Label>
                      <Select 
                        value={questionnaireData.typeProjet} 
                        onValueChange={(value) => setQuestionnaireData({...questionnaireData, typeProjet: value})}
                      >
                        <SelectTrigger id="typeProjet">
                          <SelectValue placeholder="Sélectionner le type de projet..." />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Type de bâtiment */}
                    <div className="grid gap-2">
                      <Label htmlFor="typeBatiment">Type de Bâtiment *</Label>
                      <Select 
                        value={questionnaireData.typeBatiment} 
                        onValueChange={(value) => setQuestionnaireData({...questionnaireData, typeBatiment: value})}
                      >
                        <SelectTrigger id="typeBatiment">
                          <SelectValue placeholder="Sélectionner le type de bâtiment..." />
                        </SelectTrigger>
                        <SelectContent>
                          {buildingTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      &larr; Précédent
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Suivant &rarr;
                    </Button>
                  </CardFooter>
                </Card>
              )
            )}

            {/* --- Étape 3: Détails Projet (Adaptatif) --- */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Étape 3: Quelques détails pour "{questionnaireData.brancheBtp || '...'}"...</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contenu de l'étape 3 ... */}
                  {/* Champs communs */}
                  <div className="grid gap-2">
                    <Label htmlFor="surfaceTotale">Surface Totale (m²) *</Label>
                    <Input id="surfaceTotale" name="surfaceTotale" type="number" min="0.01" step="any" value={questionnaireData.surfaceTotale ?? ''} onChange={handleQuestionnaireChange} required />
                  </div>
                  {/* ... autres champs étape 3 ... */}
                  {/* --- Champs spécifiques à la branche --- */}
                  {/* Électricité */}
                  {(questionnaireData.brancheBtp?.toLowerCase().includes('électricité') || questionnaireData.brancheBtp?.toLowerCase().includes('elec')) && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="pointsElectriques">Nombre de Points Électriques</Label>
                        <Input id="pointsElectriques" name="pointsElectriques" type="number" min="0" value={questionnaireData.pointsElectriques ?? ''} onChange={handleQuestionnaireChange} />
                      </div>
                      <div className="grid gap-2 md:col-span-2 flex items-center space-x-2">
                        <Input type="checkbox" id="tableauElectrique" name="tableauElectrique" checked={!!questionnaireData.tableauElectrique} onChange={(e) => setQuestionnaireData(prev => ({...prev, tableauElectrique: e.target.checked}))} className="h-4 w-4" />
                        <Label htmlFor="tableauElectrique">Remplacement/Installation Tableau Électrique ?</Label>
                      </div>
                    </>
                  )}
                  {/* ... (autres branches comme avant) ... */}
                  {/* Plomberie */}
                  {(questionnaireData.brancheBtp?.toLowerCase().includes('plomberie')) && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="nombrePointsEau">Nombre de Points d'Eau</Label>
                        <Input id="nombrePointsEau" name="nombrePointsEau" type="number" min="0" value={questionnaireData.nombrePointsEau ?? ''} onChange={handleQuestionnaireChange} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="typeChauffage">Type de Chauffage Principal</Label>
                        <Select name="typeChauffage" value={questionnaireData.typeChauffage || ''} onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, typeChauffage: value as QuestionnaireData['typeChauffage'] }))}>
                          <SelectTrigger id="typeChauffage">
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gaz">Gaz</SelectItem>
                            <SelectItem value="electrique">Électrique</SelectItem>
                            <SelectItem value="pac">Pompe à chaleur</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  {/* ... (autres branches) ... */}
                  {/* Champ commun Contraintes Spécifiques (toujours affiché) */}
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="contraintesSpecifiques">Contraintes Spécifiques / Autres détails</Label>
                    <Textarea id="contraintesSpecifiques" name="contraintesSpecifiques" value={questionnaireData.contraintesSpecifiques || ''} onChange={handleQuestionnaireChange} placeholder="Ex: accès difficile, matériaux spécifiques demandés..." />
                  </div>
                  {/* Toiture */}
                  {(questionnaireData.brancheBtp?.toLowerCase().includes('couverture') || questionnaireData.brancheBtp?.toLowerCase().includes('toiture')) && (
                    <div className="grid gap-2">
                      <Label htmlFor="typeToitureSelect">Type de Toiture Principal</Label>
                      <Select
                        value={showOtherToitureInput ? "other" : questionnaireData.typeToiture || ""}
                        onValueChange={(value) => {
                          if (value === "other") {
                            setShowOtherToitureInput(true);
                            setQuestionnaireData(prev => ({ ...prev, typeToiture: "" }));
                          } else {
                            setShowOtherToitureInput(false);
                            setQuestionnaireData(prev => ({ ...prev, typeToiture: value }));
                          }
                        }}
                      >
                        <SelectTrigger id="typeToitureSelect">
                          <SelectValue placeholder="Sélectionner un type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {roofTypes.map((roof) => (
                            <SelectItem key={roof.value} value={roof.value}>
                              {roof.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Autre...</SelectItem>
                        </SelectContent>
                      </Select>
                      {showOtherToitureInput && (
                        <div className="grid gap-2 mt-2">
                          <Label htmlFor="typeToitureInput">Préciser le type de toiture</Label>
                          <Input
                            id="typeToitureInput"
                            name="typeToiture"
                            value={questionnaireData.typeToiture || ""}
                            onChange={handleQuestionnaireChange}
                            placeholder="Entrez le type de toiture"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {/* Isolation */}
                  {(questionnaireData.brancheBtp?.toLowerCase().includes('isolation') || questionnaireData.brancheBtp?.toLowerCase().includes('plâtrerie')) && (
                    <div className="grid gap-2">
                      <Label htmlFor="typeIsolantSelect">Type d'Isolant Principal</Label>
                      <Select
                        value={showOtherIsolantInput ? "other" : questionnaireData.typeIsolant || ""}
                        onValueChange={(value) => {
                          if (value === "other") {
                            setShowOtherIsolantInput(true);
                            setQuestionnaireData(prev => ({ ...prev, typeIsolant: "" }));
                          } else {
                            setShowOtherIsolantInput(false);
                            setQuestionnaireData(prev => ({ ...prev, typeIsolant: value }));
                          }
                        }}
                      >
                        <SelectTrigger id="typeIsolantSelect">
                          <SelectValue placeholder="Sélectionner un isolant..." />
                        </SelectTrigger>
                        <SelectContent>
                          {insulationTypes.map((ins) => (
                            <SelectItem key={ins.value} value={ins.value}>
                              {ins.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Autre...</SelectItem>
                        </SelectContent>
                      </Select>
                      {showOtherIsolantInput && (
                        <div className="grid gap-2 mt-2">
                          <Label htmlFor="typeIsolantInput">Préciser l'isolant</Label>
                          <Input
                            id="typeIsolantInput"
                            name="typeIsolant"
                            value={questionnaireData.typeIsolant || ""}
                            onChange={handleQuestionnaireChange}
                            placeholder="Entrez le type d'isolant"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>&larr; Précédent</Button>
                  <Button type="button" onClick={nextStep} disabled={!questionnaireData.surfaceTotale || questionnaireData.surfaceTotale <= 0}>
                    Suivant &rarr;
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* --- Étape 4: Récapitulatif --- */}
            {currentStep === 4 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Étape 4: Récapitulatif du Devis</CardTitle>
                  <CardDescription>
                    Vérifiez les informations ci-dessous avant de générer le devis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    {/* Entête du récapitulatif avec les informations client */}
                    <div className="bg-muted p-4 border-b">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Client</h3>
                        <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)} disabled={Number(currentStep) === 1}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                          Modifier
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          <span className="font-medium">{clients.find(c => c.id === selectedClient)?.name || '-'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Section Détails du projet */}
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Détails du Projet</h3>
                        <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)} disabled={Number(currentStep) === 2}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                          Modifier
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                        {formatQuestionnaireDataForDisplay().map((item) => (
                          <div key={item.label} className="flex justify-between border-b border-dashed border-gray-200 pb-1 last:border-0">
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                            <span className="text-sm font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section Instructions */}
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Instructions pour l'IA</h3>
                        <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)} disabled={Number(currentStep) === 3}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                          Modifier
                        </Button>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm text-muted-foreground italic break-words whitespace-pre-wrap">
                          {userInstructions ? userInstructions : "Aucune instruction particulière n'a été fournie pour l'IA."}
                        </p>
                      </div>
                    </div>
                  </div>

                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>&larr; Précédent</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Génération en cours...' : '✨ Générer le Devis Magique !'}
                  </Button>
                </CardFooter>
              </Card>
            )}
            {/* --- Étape 5: Édition du devis --- */}
            {currentStep === 5 && generatedQuote && (
              <Card>
                <CardHeader>
                  <CardTitle>Édition du Devis</CardTitle>
                  <CardDescription>
                    Le devis a été généré. Vous pouvez le modifier avant de le sauvegarder.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="details">Détails</TabsTrigger>
                      <TabsTrigger value="materiaux">Matériaux</TabsTrigger>
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="total">Totaux</TabsTrigger>
                    </TabsList>
                    
                    {/* Onglet Détails */}
                    <TabsContent value="details" className="space-y-6">
                      <div className="rounded-md border p-6">
                        <div className="grid gap-6">
                          {/* Section Titre et Statut sur la même ligne */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Titre du projet */}
                            <div className="space-y-2">
                              <Label htmlFor="projet" className="text-base font-medium">Titre du projet</Label>
                              <Input 
                                id="projet" 
                                className="h-11"
                                value={editedQuote?.projet || ''} 
                                onChange={(e) => setEditedQuote({...editedQuote, projet: e.target.value})}
                                placeholder="Entrez le titre du projet..."
                              />
                            </div>
                            
                            {/* Statut du devis */}
                            <div className="space-y-2">
                              <Label htmlFor="status" className="text-base font-medium">Statut du devis</Label>
                              <Select
                                value={editedQuote?.status || 'DRAFT'}
                                onValueChange={(value) => setEditedQuote({...editedQuote, status: value})}
                              >
                                <SelectTrigger id="status" className="h-11">
                                  <SelectValue placeholder="Sélectionnez un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="DRAFT">Brouillon</SelectItem>
                                  <SelectItem value="SENT">Envoyé</SelectItem>
                                  <SelectItem value="APPROVED">Approuvé</SelectItem>
                                  <SelectItem value="REJECTED">Refusé</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {/* Section Date d'expiration */}
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate" className="text-base font-medium">Date d'expiration</Label>
                            <Input
                              id="expiryDate"
                              type="date"
                              className="h-11"
                              value={editedQuote?.expiryDate ? new Date(editedQuote.expiryDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => setEditedQuote({...editedQuote, expiryDate: e.target.value ? new Date(e.target.value).toISOString() : null})}
                            />
                          </div>
                          
                          {/* Section Description */}
                          <div className="space-y-2 pt-2">
                            <Label htmlFor="description" className="text-base font-medium">Description des travaux</Label>
                            <Textarea 
                              id="description" 
                              className="min-h-[150px]"
                              value={editedQuote?.description || ''} 
                              onChange={(e) => setEditedQuote({...editedQuote, description: e.target.value})}
                              placeholder="Décrivez les travaux à effectuer..."
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Onglet Matériaux */}
                    <TabsContent value="materiaux">
                      <ScrollArea className="h-[400px] rounded-md border p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Matériau</TableHead>
                              <TableHead>Quantité</TableHead>
                              <TableHead>Unité</TableHead>
                              <TableHead>Prix unitaire</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {editedQuote?.materiaux?.map((item: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Input 
                                    value={item.nom || ''} 
                                    onChange={(e) => {
                                      const newMat = [...editedQuote.materiaux];
                                      newMat[index].nom = e.target.value;
                                      setEditedQuote({...editedQuote, materiaux: newMat});
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number" 
                                    value={item.quantité || 0} 
                                    onChange={(e) => {
                                      const newMat = [...editedQuote.materiaux];
                                      newMat[index].quantité = parseFloat(e.target.value);
                                      setEditedQuote({...editedQuote, materiaux: newMat});
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    value={item.unité || ''} 
                                    onChange={(e) => {
                                      const newMat = [...editedQuote.materiaux];
                                      newMat[index].unité = e.target.value;
                                      setEditedQuote({...editedQuote, materiaux: newMat});
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number" 
                                    value={item.prix_unitaire || 0} 
                                    onChange={(e) => {
                                      const newMat = [...editedQuote.materiaux];
                                      newMat[index].prix_unitaire = parseFloat(e.target.value);
                                      setEditedQuote({...editedQuote, materiaux: newMat});
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  {(item.quantité * item.prix_unitaire).toFixed(2)} €
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    
                    {/* Onglet Services et Main d'oeuvre */}
                    <TabsContent value="services">
                      <ScrollArea className="h-[400px] rounded-md border p-4">
                        {/* Section Main d'oeuvre spécifique */}
                        <div className="mb-6 border-b pb-4">
                          <h3 className="text-base font-medium mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            Main d'oeuvre
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="heuresEstimees" className="mb-1 block">Heures estimées</Label>
                              <Input 
                                id="heuresEstimees" 
                                type="number" 
                                value={editedQuote?.main_oeuvre?.heures_estimees || 0} 
                                onChange={(e) => {
                                  const heures = parseFloat(e.target.value) || 0;
                                  const taux = editedQuote?.main_oeuvre?.taux_horaire || 0;
                                  setEditedQuote({
                                    ...editedQuote, 
                                    main_oeuvre: {
                                      ...editedQuote?.main_oeuvre,
                                      heures_estimees: heures,
                                      total: heures * taux
                                    }
                                  });
                                  
                                  // Mettre à jour ou ajouter automatiquement le service de main d'oeuvre
                                  if (heures > 0 && taux > 0) {
                                    const postes = editedQuote.postes || [];
                                    const mainOeuvreIndex = postes.findIndex((p: Poste) => 
                                      p.nom && p.nom.toLowerCase().includes('main') && p.nom.toLowerCase().includes('oeuvre')
                                    );
                                    
                                    if (mainOeuvreIndex >= 0) {
                                      const newPostes = [...postes];
                                      newPostes[mainOeuvreIndex] = {
                                        ...newPostes[mainOeuvreIndex],
                                        nom: `Main d'oeuvre (${heures} heures)`,
                                        prix: heures * taux
                                      };
                                      setEditedQuote({...editedQuote, postes: newPostes});
                                    } else {
                                      setEditedQuote({
                                        ...editedQuote, 
                                        postes: [...postes, {
                                          nom: `Main d'oeuvre (${heures} heures)`,
                                          prix: heures * taux
                                        }]
                                      });
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor="tauxHoraire" className="mb-1 block">Taux horaire (€)</Label>
                              <Input 
                                id="tauxHoraire" 
                                type="number" 
                                value={editedQuote?.main_oeuvre?.taux_horaire || 0} 
                                onChange={(e) => {
                                  const taux = parseFloat(e.target.value) || 0;
                                  const heures = editedQuote?.main_oeuvre?.heures_estimees || 0;
                                  setEditedQuote({
                                    ...editedQuote, 
                                    main_oeuvre: {
                                      ...editedQuote?.main_oeuvre,
                                      taux_horaire: taux,
                                      total: heures * taux
                                    }
                                  });
                                  
                                  // Mettre à jour ou ajouter automatiquement le service de main d'oeuvre
                                  if (taux > 0 && heures > 0) {
                                    const postes = editedQuote.postes || [];
                                    const mainOeuvreIndex = postes.findIndex((p: Poste) => 
                                      p.nom && p.nom.toLowerCase().includes('main') && p.nom.toLowerCase().includes('oeuvre')
                                    );
                                    
                                    if (mainOeuvreIndex >= 0) {
                                      const newPostes = [...postes];
                                      newPostes[mainOeuvreIndex] = {
                                        ...newPostes[mainOeuvreIndex],
                                        nom: `Main d'oeuvre (${heures} heures)`,
                                        prix: heures * taux
                                      };
                                      setEditedQuote({...editedQuote, postes: newPostes});
                                    } else {
                                      setEditedQuote({
                                        ...editedQuote, 
                                        postes: [...postes, {
                                          nom: `Main d'oeuvre (${heures} heures)`,
                                          prix: heures * taux
                                        }]
                                      });
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="bg-muted rounded p-2 flex justify-between items-center">
                              <span className="font-medium">Total Main d'oeuvre:</span>
                              <span className="font-semibold">
                                {formatCurrency((editedQuote?.main_oeuvre?.heures_estimees || 0) * (editedQuote?.main_oeuvre?.taux_horaire || 0))}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section Services */}
                        <h3 className="text-base font-medium mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7z" />
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm-1 4h8v6H6V9z" clipRule="evenodd" />
                          </svg>
                          Services et Prestations
                        </h3>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Service</TableHead>
                              <TableHead>Prix</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {editedQuote?.postes ? (
                              editedQuote.postes.map((item: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Input 
                                      value={item.nom || ''} 
                                      onChange={(e) => {
                                        const newPostes = [...editedQuote.postes];
                                        newPostes[index].nom = e.target.value;
                                        setEditedQuote({...editedQuote, postes: newPostes});
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input 
                                      type="number" 
                                      value={item.prix || 0} 
                                      onChange={(e) => {
                                        const newPostes = [...editedQuote.postes];
                                        newPostes[index].prix = parseFloat(e.target.value);
                                        setEditedQuote({...editedQuote, postes: newPostes});
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => {
                                        const newPostes = [...editedQuote.postes];
                                        newPostes.splice(index, 1);
                                        setEditedQuote({...editedQuote, postes: newPostes});
                                      }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                  Aucun service ajouté
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                        <div className="mt-4">
                          <Button 
                            type="button" 
                            onClick={() => {
                              const postes = editedQuote.postes || [];
                              setEditedQuote({
                                ...editedQuote, 
                                postes: [...postes, { nom: 'Nouveau service', prix: 0 }]
                              });
                            }}
                            className="w-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Ajouter un service
                          </Button>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    {/* Onglet Totaux */}
                    <TabsContent value="total" className="space-y-4">
                      <div className="rounded-md border p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Label htmlFor="totalHt">Total HT</Label>
                          <Input 
                            id="totalHt" 
                            type="number" 
                            value={editedQuote?.total_ht || 0} 
                            onChange={(e) => setEditedQuote({...editedQuote, total_ht: parseFloat(e.target.value)})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Label htmlFor="tva">TVA</Label>
                          <Input 
                            id="tva" 
                            type="number" 
                            value={editedQuote?.tva || 0} 
                            onChange={(e) => setEditedQuote({...editedQuote, tva: parseFloat(e.target.value)})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Label htmlFor="totalTtc">Total TTC</Label>
                          <Input 
                            id="totalTtc" 
                            type="number" 
                            value={editedQuote?.total_ttc || 0} 
                            onChange={(e) => setEditedQuote({...editedQuote, total_ttc: parseFloat(e.target.value)})}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {/* Section de regénération */}
                  <div className="border-t pt-4 mt-6">
                    <h3 className="text-lg font-medium mb-2">Regénérer le devis</h3>
                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Donnez des instructions spécifiques pour améliorer ou corriger le devis généré..." 
                        rows={3}
                        value={revisionInstructions}
                        onChange={(e) => setRevisionInstructions(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        onClick={regenerateQuote} 
                        disabled={isSubmitting || !revisionInstructions.trim()}
                        className="w-full"
                      >
                        {isSubmitting ? 'Génération en cours...' : '🔄 Regénérer le devis'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(4)}>&larr; Retour au récapitulatif</Button>
                  <Button 
                    type="button" 
                    onClick={saveEditedQuote} 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enregistrement...' : '💾 Enregistrer le devis'}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </form>
        </div>

        {/* --- Colonne Droite: Prévisualisation PDF --- */}
        <div className="md:w-1/3">
          <div className="sticky top-24"> {/* Sticky pour que la prévisualisation reste visible en scrollant */}
            {currentStep >= 4 ? (
              // Afficher la prévisualisation PDF (QuotePreview) si on est à l'étape 4 ou plus
              <>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold">Prévisualisation PDF</h3>
                  {currentStep === 5 && generatedQuote && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={generateAndDownloadPDF}
                      disabled={pdfGenerating}
                      className="print:hidden"
                    >
                      {pdfGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Génération...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          Télécharger PDF
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="border rounded-md overflow-hidden print:border-none shadow-sm print:shadow-none mb-4">
                  {/* Si nous avons le devis généré, on l'affiche, sinon on montre une prévisualisation basée sur les données du formulaire */}
                  {currentStep === 5 && generatedQuote ? (
                    <div ref={previewRef}>
                      <QuotePreview 
                        quote={editedQuote || generatedQuote} 
                        client={clients.find(c => c.id === selectedClient)} 
                      />
                    </div>
                  ) : (
                    <Card className="border-0 shadow-none">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-medium mb-2">Client</h3>
                        <p className="mb-4">{clients.find(c => c.id === selectedClient)?.name || '-'}</p>
                        
                        <h3 className="text-lg font-medium mb-2">Détails du projet</h3>
                        <div className="space-y-1 mb-4">
                          {formatQuestionnaireDataForDisplay().map((item) => (
                            <div key={item.label} className="flex justify-between">
                              <span className="text-sm text-muted-foreground">{item.label}:</span>
                              <span className="text-sm font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-xs text-muted-foreground italic">
                          Une prévisualisation complète du devis sera disponible après génération...
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              // Afficher le récapitulatif classique si on est avant l'étape 4
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif du Devis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Section Client */}
                  <div className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Client</h4>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} disabled={Number(currentStep) === 1}>Modifier</Button>
                    </div>
                    <p className="text-sm"><strong>Nom:</strong> {clients.find(c => c.id === selectedClient)?.name || '-'}</p>
                  </div>

                  {/* Section Infos Projet */}
                  <div className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Détails du Projet</h4>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} disabled={Number(currentStep) === 2}>Modifier</Button>
                    </div>
                    {formatQuestionnaireDataForDisplay().map((item) => (
                      <p key={item.label} className="text-sm"><strong>{item.label}:</strong> {item.value}</p>
                    ))}
                  </div>

                  {/* Section Instructions */}
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Instructions IA</h4>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)} disabled={Number(currentStep) === 3}>Modifier</Button>
                    </div>
                    <p className="text-sm text-muted-foreground break-words">{userInstructions || 'Aucune'}</p>
                  </div>

                </CardContent>
                {/* On pourrait ajouter un footer avec le bouton de soumission final ici aussi */}
                {/* <CardFooter> <Button type="submit" className="w-full" disabled={loading || currentStep !== TOTAL_STEPS}>...</Button> </CardFooter> */}
              </Card>
            )}
          </div>
        </div>

      </div> {/* Fin de la structure flex */}
    </div>
  );
}
