"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionnaireData } from '@/types/devis';

interface DetailsStepProps {
  questionnaireData: Partial<QuestionnaireData> & { otherBranche?: string };
  handleQuestionnaireChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setQuestionnaireData: (data: Partial<QuestionnaireData> & { otherBranche?: string }) => void;
  prevStep: () => void;
  nextStep: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

export default function DetailsStep({
  questionnaireData,
  handleQuestionnaireChange,
  setQuestionnaireData,
  prevStep,
  nextStep
}: DetailsStepProps) {
  // Options pour les sélections
  const roofTypes: SelectOption[] = [
    { value: "tuiles mécaniques", label: "Tuiles Mécaniques" },
    { value: "tuiles plates", label: "Tuiles Plates" },
    { value: "ardoise", label: "Ardoise" },
    { value: "zinc", label: "Zinc" },
    { value: "bac acier", label: "Bac Acier" },
    { value: "toiture terrasse", label: "Toiture Terrasse (Bitume, EPDM...)" },
    { value: "autre", label: "Autre (Préciser)" },
  ];

  const insulationTypes: SelectOption[] = [
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

  // État pour gérer l'affichage des champs Input "Autre"
  const [showOtherToitureInput, setShowOtherToitureInput] = useState(
    questionnaireData.typeToiture && !roofTypes.some(t => t.value === questionnaireData.typeToiture)
  );
  
  const [showOtherIsolantInput, setShowOtherIsolantInput] = useState(
    questionnaireData.typeIsolant && !insulationTypes.some(i => i.value === questionnaireData.typeIsolant)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Étape 3: Quelques détails pour "{questionnaireData.brancheBtp || '...'}"...</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Champs communs */}
        <div className="grid gap-2">
          <Label htmlFor="surfaceTotale">Surface Totale (m²) *</Label>
          <Input id="surfaceTotale" name="surfaceTotale" type="number" min="0.01" step="any" value={questionnaireData.surfaceTotale ?? ''} onChange={handleQuestionnaireChange} required />
        </div>
        
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

        {/* Maçonnerie */}
        {(questionnaireData.brancheBtp?.toLowerCase().includes('maçonnerie')) && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="mlMurs">Mètres Linéaires de Murs</Label>
              <Input id="mlMurs" name="mlMurs" type="number" min="0" step="any" value={questionnaireData.mlMurs ?? ''} onChange={handleQuestionnaireChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mlCloisons">Mètres Linéaires de Cloisons</Label>
              <Input id="mlCloisons" name="mlCloisons" type="number" min="0" step="any" value={questionnaireData.mlCloisons ?? ''} onChange={handleQuestionnaireChange} />
            </div>
          </>
        )}

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

        {/* Champ commun Contraintes Spécifiques (toujours affiché) */}
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="contraintesSpecifiques">Contraintes Spécifiques / Autres détails</Label>
          <Textarea id="contraintesSpecifiques" name="contraintesSpecifiques" value={questionnaireData.contraintesSpecifiques || ''} onChange={handleQuestionnaireChange} placeholder="Ex: accès difficile, matériaux spécifiques demandés..." />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>&larr; Précédent</Button>
        <Button type="button" onClick={nextStep} disabled={!questionnaireData.surfaceTotale || questionnaireData.surfaceTotale <= 0}>
          Suivant &rarr;
        </Button>
      </CardFooter>
    </Card>
  );
}
