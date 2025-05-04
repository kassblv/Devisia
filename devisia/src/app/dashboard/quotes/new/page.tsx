"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { QuestionnaireData, DevisRequestPayload } from '@/types/devis';
import { Progress } from "@/components/ui/progress";

interface Client {
  id: string;
  name: string;
  email?: string;
}

const TOTAL_STEPS = 4;

export default function NewQuoteGenerator() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string | undefined>(undefined);

  // États pour gérer l'affichage des champs Input "Autre"
  const [showOtherBrancheInput, setShowOtherBrancheInput] = useState(false);
  const [showOtherToitureInput, setShowOtherToitureInput] = useState(false);
  const [showOtherIsolantInput, setShowOtherIsolantInput] = useState(false);

  const [questionnaireData, setQuestionnaireData] = useState<Partial<QuestionnaireData>>({
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
    typeToiture: ''
  });

  const [userInstructions, setUserInstructions] = useState("");
  const [loading, setLoading] = useState(false); // Garder un seul état de chargement ?

  const btpBranches = [
    { value: "électricité", label: "Électricité" },
    { value: "plomberie", label: "Plomberie" },
    { value: "chauffage", label: "Chauffage / Ventilation" },
    { value: "maçonnerie", label: "Maçonnerie" },
    { value: "plâtrerie", label: "Plâtrerie / Isolation" },
    { value: "isolation", label: "Isolation" },
    { value: "peinture", label: "Peinture / Finitions" },
    { value: "revêtement sol", label: "Revêtement de Sol" },
    { value: "menuiserie", label: "Menuiserie (Int/Ext)" },
    { value: "couverture", label: "Couverture / Toiture" },
    { value: "façade", label: "Façade" },
    { value: "autre", label: "Autre (Préciser)" },
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
    setSelectedClient(clients.find(c => c.id === value) || null);
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedClient) {
      toast.warning("Veuillez sélectionner un client.");
      return;
    }
    if (currentStep === 2 && (!questionnaireData.brancheBtp || !questionnaireData.typeProjet || !questionnaireData.typeBatiment)) {
      toast.warning("Veuillez remplir les informations principales du projet.");
      return;
    }
    if (currentStep === 3 && (!questionnaireData.surfaceTotale || questionnaireData.surfaceTotale <= 0)) {
        toast.warning("Veuillez indiquer une surface totale valide.");
        return;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient || !questionnaireData.brancheBtp || !questionnaireData.typeProjet || !questionnaireData.typeBatiment || !questionnaireData.surfaceTotale || questionnaireData.surfaceTotale <= 0) {
      toast.error("Certains champs obligatoires sont manquants. Veuillez vérifier les étapes précédentes.");
      return;
    }

    setIsSubmitting(true);
    toast.info("Génération du devis en cours...");

    const payload: DevisRequestPayload = {
        questionnaireData: questionnaireData as QuestionnaireData,
        userInstructions: userInstructions
    };

    try {
      const response = await fetch("/api/devis/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la génération du devis");
      }

      const generatedDevis = await response.json();
      console.log("Devis généré:", generatedDevis);
      toast.success("Devis généré avec succès ! (Non sauvegardé)");
      router.push("/dashboard/quotes");
      router.refresh();

    } catch (error) {
      console.error("Erreur handleSubmit:", error);
      toast.error("Erreur lors de la génération du devis: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nouveau Devis par IA</h1>
        <Button onClick={() => router.back()} variant="outline">Retour</Button>
      </div>

      {/* Structure principale en deux colonnes */}
      <div className="flex flex-col md:flex-row gap-8">

        {/* --- Colonne Gauche: Questionnaire --- */}
        <div className="md:w-2/3">
          {/* Indicateur de progression */}
          <div className="mb-6">
            <Label className="text-sm font-medium">Étape {currentStep} sur {TOTAL_STEPS}</Label>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}></div>
            </div>
          </div>

          {/* Contenu de l'étape actuelle */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- Étape 1: Client --- */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Étape 1: Pour quel client est ce devis ?</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Reste du contenu de l'étape 1... */}
                  <div className="grid gap-2">
                    <Label htmlFor="client">Sélectionner un Client *</Label>
                    {/* ... Remplacer par votre composant de sélection de client réel */}
                    <Select onValueChange={(value) => setSelectedClient(value)} value={selectedClient || ''}>
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Choisir un client..." />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Ou <Link href="/dashboard/clients/new" className="underline">créer un nouveau client</Link>.</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="button" onClick={nextStep} disabled={!selectedClient}>
                    Suivant &rarr;
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* --- Étape 2: Infos Projet --- */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Étape 2: Le projet en quelques mots...</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contenu de l'étape 2 ... */}
                  <div className="grid gap-2">
                    <Label htmlFor="brancheBtpSelect">Branche Principale BTP *</Label>
                    <Select
                      value={showOtherBrancheInput ? "other" : questionnaireData.brancheBtp || ""}
                      onValueChange={(value) => {
                        if (value === "other") {
                          setShowOtherBrancheInput(true);
                          setQuestionnaireData(prev => ({ ...prev, brancheBtp: "" }));
                        } else {
                          setShowOtherBrancheInput(false);
                          setQuestionnaireData(prev => ({ ...prev, brancheBtp: value }));
                        }
                      }}
                    >
                      <SelectTrigger id="brancheBtpSelect">
                        <SelectValue placeholder="Sélectionner une branche..." />
                      </SelectTrigger>
                      <SelectContent>
                        {btpBranches.map((branch) => (
                          <SelectItem key={branch.value} value={branch.value}>
                            {branch.label}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Autre...</SelectItem>
                      </SelectContent>
                    </Select>
                    {showOtherBrancheInput && (
                      <div className="grid gap-2 mt-2">
                        <Label htmlFor="brancheBtpInput">Préciser la branche BTP *</Label>
                        <Input
                          id="brancheBtpInput"
                          name="brancheBtp" // Le nom reste le même pour handleQuestionnaireChange
                          value={questionnaireData.brancheBtp || ""}
                          onChange={handleQuestionnaireChange}
                          placeholder="Entrez la branche BTP"
                          required
                        />
                      </div>
                    )}
                  </div>
                  {/* ... autres champs étape 2 ... */}
                  <div className="grid gap-2">
                    <Label htmlFor="typeProjet">Type de Projet *</Label>
                    <Select name="typeProjet" required value={questionnaireData.typeProjet || ''} onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, typeProjet: value }))}>
                      <SelectTrigger id="typeProjet">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction_neuve">Construction neuve</SelectItem>
                        <SelectItem value="renovation">Rénovation</SelectItem>
                        <SelectItem value="extension">Extension</SelectItem>
                        <SelectItem value="depannage">Dépannage / Réparation</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="typeBatiment">Type de Bâtiment *</Label>
                    <Select name="typeBatiment" required value={questionnaireData.typeBatiment || ''} onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, typeBatiment: value }))}>
                      <SelectTrigger id="typeBatiment">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maison_individuelle">Maison individuelle</SelectItem>
                        <SelectItem value="appartement">Appartement</SelectItem>
                        <SelectItem value="immeuble_collectif">Immeuble collectif</SelectItem>
                        <SelectItem value="local_commercial">Local commercial / Bureau</SelectItem>
                        <SelectItem value="batiment_industriel">Bâtiment industriel</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>&larr; Précédent</Button>
                  <Button type="button" onClick={nextStep} disabled={!questionnaireData.brancheBtp || !questionnaireData.typeProjet || !questionnaireData.typeBatiment}>
                    Suivant &rarr;
                  </Button>
                </CardFooter>
              </Card>
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

            {/* --- Étape 4: Instructions & Soumission --- */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Étape 4: Instructions particulières pour l'IA ?</CardTitle>
                  <CardDescription>Vous pouvez préciser ici des points importants pour la génération du devis.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Contenu étape 4 */}
                  <div className="grid gap-2">
                    <Label htmlFor="userInstructions">Instructions supplémentaires (optionnel)</Label>
                    <Textarea id="userInstructions" value={userInstructions} onChange={(e) => setUserInstructions(e.target.value)} placeholder="Ex: Insister sur la qualité des matériaux, proposer une option économique..." />
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
          </form>
        </div>

        {/* --- Colonne Droite: Résumé --- */}
        <div className="md:w-1/3">
          <Card className="sticky top-24"> {/* Sticky pour que le résumé reste visible en scrollant */}
            <CardHeader>
              <CardTitle>Récapitulatif du Devis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Section Client */}
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Client</h4>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} disabled={currentStep === 1}>Modifier</Button>
                </div>
                <p className="text-sm text-muted-foreground">{selectedClient ? clients.find(c => c.id === selectedClient)?.name : 'Non sélectionné'}</p>
              </div>

              {/* Section Infos Projet */}
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Infos Projet</h4>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} disabled={currentStep === 2}>Modifier</Button>
                </div>
                <p className="text-sm"><strong>Branche:</strong> {questionnaireData.brancheBtp || '-'}</p>
                <p className="text-sm"><strong>Type Projet:</strong> {questionnaireData.typeProjet || '-'}</p>
                <p className="text-sm"><strong>Type Bâtiment:</strong> {questionnaireData.typeBatiment || '-'}</p>
              </div>

              {/* Section Détails Projet */}
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Détails Projet</h4>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)} disabled={currentStep === 3}>Modifier</Button>
                </div>
                <p className="text-sm"><strong>Surface:</strong> {questionnaireData.surfaceTotale ? `${questionnaireData.surfaceTotale} m²` : '-'}</p>
                {/* Afficher les détails spécifiques SI remplis */}
                {questionnaireData.pointsElectriques && <p className="text-sm"><strong>Points Elec.:</strong> {questionnaireData.pointsElectriques}</p>}
                {questionnaireData.tableauElectrique !== undefined && <p className="text-sm"><strong>Tableau Elec.:</strong> {questionnaireData.tableauElectrique ? 'Oui' : 'Non'}</p>}
                {questionnaireData.nombrePointsEau && <p className="text-sm"><strong>Points Eau:</strong> {questionnaireData.nombrePointsEau}</p>}
                {questionnaireData.typeChauffage && <p className="text-sm"><strong>Chauffage:</strong> {questionnaireData.typeChauffage}</p>}
                {questionnaireData.mlMurs && <p className="text-sm"><strong>Murs (ml):</strong> {questionnaireData.mlMurs}</p>}
                {questionnaireData.mlCloisons && <p className="text-sm"><strong>Cloisons (ml):</strong> {questionnaireData.mlCloisons}</p>}
                {questionnaireData.typeIsolant && <p className="text-sm"><strong>Isolant:</strong> {questionnaireData.typeIsolant}</p>}
                {questionnaireData.typeToiture && <p className="text-sm"><strong>Toiture:</strong> {questionnaireData.typeToiture}</p>}
                {questionnaireData.contraintesSpecifiques && <p className="text-sm"><strong>Contraintes:</strong> {questionnaireData.contraintesSpecifiques}</p>}
              </div>

              {/* Section Instructions */}
              <div>
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Instructions IA</h4>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(4)} disabled={currentStep === 4}>Modifier</Button>
                </div>
                <p className="text-sm text-muted-foreground break-words">{userInstructions || 'Aucune'}</p>
              </div>

            </CardContent>
            {/* On pourrait ajouter un footer avec le bouton de soumission final ici aussi */}
            {/* <CardFooter> <Button type="submit" className="w-full" disabled={loading || currentStep !== TOTAL_STEPS}>...</Button> </CardFooter> */}
          </Card>
        </div>

      </div> {/* Fin de la structure flex */}
    </div>
  );
}
