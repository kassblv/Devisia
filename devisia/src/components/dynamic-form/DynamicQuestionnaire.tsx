import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { QuestionnaireModel, shouldDisplaySection, shouldDisplayQuestion } from "@/config/questionnaireModels";
import { DynamicFormSection } from "./DynamicFormSection";
import { toast } from "sonner";

interface DynamicQuestionnaireProps {
  questionnaire: QuestionnaireModel;
  formData: any;
  onUpdate: (data: any) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function DynamicQuestionnaire({ 
  questionnaire, 
  formData, 
  onUpdate, 
  onSubmit,
  isSubmitting = false
}: DynamicQuestionnaireProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  // Calculer les sections visibles en fonction des conditions
  useEffect(() => {
    const newVisibleSections = questionnaire.sections
      .map((section, index) => ({ section, index }))
      .filter(({ section }) => shouldDisplaySection(section, formData))
      .map(({ index }) => index);
    
    setVisibleSections(newVisibleSections);
    
    // Si la section actuelle n'est plus visible, passer à la première section visible
    if (newVisibleSections.length && !newVisibleSections.includes(currentSectionIndex)) {
      setCurrentSectionIndex(newVisibleSections[0]);
    }
  }, [formData, questionnaire.sections, currentSectionIndex]);

  const currentSection = questionnaire.sections[currentSectionIndex];
  const totalVisibleSections = visibleSections.length;
  const currentSectionNumber = visibleSections.indexOf(currentSectionIndex) + 1;
  
  const handleFieldChange = (id: string, value: any) => {
    onUpdate({ ...formData, [id]: value });
  };

  const handleNext = () => {
    // Valider la section actuelle
    const requiredFields = currentSection.questions
      .filter(q => q.required && shouldDisplaySection(currentSection, formData));
    
    const missingFields = requiredFields.filter(q => {
      const value = formData[q.id];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      toast.warning(`Veuillez remplir tous les champs obligatoires (${missingFields.length} manquant${missingFields.length > 1 ? 's' : ''})`);
      return;
    }
    
    // Passer à la section suivante visible
    const currentVisibleIndex = visibleSections.indexOf(currentSectionIndex);
    if (currentVisibleIndex < visibleSections.length - 1) {
      setCurrentSectionIndex(visibleSections[currentVisibleIndex + 1]);
    }
  };

  const handlePrevious = () => {
    // Revenir à la section précédente visible
    const currentVisibleIndex = visibleSections.indexOf(currentSectionIndex);
    if (currentVisibleIndex > 0) {
      setCurrentSectionIndex(visibleSections[currentVisibleIndex - 1]);
    }
  };

  const handleSubmitQuestionnaire = () => {
    // Valider tous les champs requis dans toutes les sections visibles
    const allRequiredFields = questionnaire.sections
      .filter(section => shouldDisplaySection(section, formData))
      .flatMap(section => section.questions)
      .filter(q => q.required && shouldDisplayQuestion(q, formData));
    
    const missingFields = allRequiredFields.filter(q => {
      const value = formData[q.id];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      toast.error(`Formulaire incomplet : ${missingFields.length} champ${missingFields.length > 1 ? 's' : ''} obligatoire${missingFields.length > 1 ? 's' : ''} manquant${missingFields.length > 1 ? 's' : ''}`);
      return;
    }
    
    onSubmit();
  };

  if (!currentSection || visibleSections.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p>Aucune section de formulaire disponible.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barre de progression */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm">
            Section {currentSectionNumber} sur {totalVisibleSections}
          </p>
          <p className="text-sm font-medium">
            {(currentSectionNumber / totalVisibleSections * 100).toFixed(0)}%
          </p>
        </div>
        <Progress value={(currentSectionNumber / totalVisibleSections) * 100} />
      </div>
      
      {/* Section de questionnaire actuelle */}
      <DynamicFormSection
        section={currentSection}
        formData={formData}
        onChange={handleFieldChange}
      />
      
      {/* Boutons de navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={visibleSections.indexOf(currentSectionIndex) === 0 || isSubmitting}
        >
          &larr; Précédent
        </Button>
        
        {visibleSections.indexOf(currentSectionIndex) < visibleSections.length - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            Suivant &rarr;
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmitQuestionnaire}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Génération en cours...' : 'Générer le Devis'}
          </Button>
        )}
      </div>
    </div>
  );
}
