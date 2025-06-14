"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DynamicQuestionnaire } from "@/components/dynamic-form/DynamicQuestionnaire";
import { QuestionnaireData } from '@/types/devis';

interface QuestionnaireStepProps {
  selectedQuestionnaireModel: any; // Utilisez le type approprié de votre questionnaire
  questionnaireData: Partial<QuestionnaireData> & { otherBranche?: string };
  setQuestionnaireData: (data: Partial<QuestionnaireData> & { otherBranche?: string }) => void;
  handleQuestionnaireChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  selectedClient: string | undefined;
  isSubmitting: boolean;
  userInstructions: string;
  createQuoteFromQuestionnaire: (clientId: string, data: Partial<QuestionnaireData>, instructions: string) => Promise<void>;
  prevStep: () => void;
  nextStep: () => void;
}

// Types pour les options de sélection
interface SelectOption {
  value: string;
  label: string;
}

export default function QuestionnaireStep({
  selectedQuestionnaireModel,
  questionnaireData,
  setQuestionnaireData,
  handleQuestionnaireChange,
  selectedClient,
  isSubmitting,
  userInstructions,
  createQuoteFromQuestionnaire,
  prevStep,
  nextStep
}: QuestionnaireStepProps) {
  // Options pour les sélections
  const btpBranches: SelectOption[] = [
    { value: "électricité", label: "Électricité" },
    { value: "plomberie", label: "Plomberie" },
    { value: "maçonnerie", label: "Maçonnerie" },
    { value: "menuiserie", label: "Menuiserie" },
    { value: "peinture", label: "Peinture" },
    { value: "isolation", label: "Isolation" },
    { value: "autre", label: "Autre..." }
  ];
  
  const projectTypes: SelectOption[] = [
    { value: "construction_neuve", label: "Construction neuve" },
    { value: "renovation", label: "Rénovation" },
    { value: "extension", label: "Extension" },
    { value: "depannage", label: "Dépannage / Réparation" },
    { value: "autre", label: "Autre" },
  ];
  
  const buildingTypes: SelectOption[] = [
    { value: "maison_individuelle", label: "Maison individuelle" },
    { value: "appartement", label: "Appartement" },
    { value: "immeuble_collectif", label: "Immeuble collectif" },
    { value: "local_commercial", label: "Local commercial / Bureau" },
    { value: "batiment_industriel", label: "Bâtiment industriel" },
    { value: "autre", label: "Autre" },
  ];

  // État pour gérer l'affichage des champs Input "Autre"
  const [showOtherBrancheInput, setShowOtherBrancheInput] = React.useState(
    questionnaireData.brancheBtp === 'autre' || 
    (questionnaireData.brancheBtp && !btpBranches.some(b => b.value === questionnaireData.brancheBtp))
  );

  return (
    <>
      {selectedQuestionnaireModel ? (
        // Utilisation du questionnaire dynamique si un domaine est sélectionné
        <DynamicQuestionnaire
          questionnaire={selectedQuestionnaireModel}
          formData={questionnaireData}
          onUpdate={(newData) => setQuestionnaireData(newData)}
          onSubmit={() => {
            // Appel direct sans événement
            const clientId = selectedClient;
            if (clientId) {
              createQuoteFromQuestionnaire(clientId, questionnaireData, userInstructions);
            } else {
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
      )}
    </>
  );
}
