"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ClientSelectionStep from "./ClientSelectionStep";
import QuestionnaireStep from "./QuestionnaireStep";
import DetailsStep from "./DetailsStep";
import QuoteSummaryStep from "./QuoteSummaryStep";
import QuoteEditStep from "./QuoteEditStep";
import QuotePreview from "./QuotePreview";
import useQuoteGenerator from "@/hooks/useQuoteGenerator";

export default function NewQuoteGenerator() {
  const {
    currentStep,
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
    editedQuote,
    setEditedQuote,
    isSubmitting,
    revisionInstructions,
    setRevisionInstructions,
    clients,
    domains,
    prevStep,
    handleNextStep,
    regenerateQuote,
    saveEditedQuote,
    generateAndDownloadPDF
  } = useQuoteGenerator();

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <ClientSelectionStep 
            client={selectedClient}
            setClient={setSelectedClient}
            domain={selectedDomain}
            setDomain={setSelectedDomain}
            clients={clients}
            domains={domains}
          />
        );
      case 2:
        return (
          <QuestionnaireStep 
            useQuestionnaire={useQuestionnaire}
            setUseQuestionnaire={setUseQuestionnaire}
            questionnaireData={questionnaireData}
            setQuestionnaireData={setQuestionnaireData}
            selectedDomain={selectedDomain}
          />
        );
      case 3:
        return (
          <DetailsStep 
            quoteDetails={quoteDetails}
            setQuoteDetails={setQuoteDetails}
            selectedDomain={selectedDomain}
          />
        );
      case 4:
        return (
          <QuoteSummaryStep 
            questionnaireData={questionnaireData}
            quoteDetails={quoteDetails}
            selectedDomain={selectedDomain}
            clients={clients}
            selectedClient={selectedClient}
            isSubmitting={isSubmitting}
          />
        );
      case 5:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="order-2 lg:order-1">
              <QuoteEditStep 
                generatedQuote={generatedQuote}
                editedQuote={editedQuote}
                setEditedQuote={setEditedQuote}
                revisionInstructions={revisionInstructions}
                setRevisionInstructions={setRevisionInstructions}
                isSubmitting={isSubmitting}
                regenerateQuote={regenerateQuote}
                saveEditedQuote={saveEditedQuote}
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-lg p-3 mb-4">
                <h2 className="font-serif text-lg font-semibold mb-2">Aperçu du devis</h2>
                <div className="border rounded-md overflow-hidden" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                  <div id="quote-preview" className="p-4 bg-white">
                    {editedQuote && <QuotePreview quote={editedQuote} />}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={generateAndDownloadPDF} className="w-full md:w-auto">
                    Télécharger en PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-semibold">Création d'un nouveau devis</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Étape {currentStep} sur 5</span>
        </div>
      </div>
      
      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        ></div>
      </div>
      
      {renderStepContent()}
      
      {currentStep < 5 && (
        <>
          <Separator className="my-6" />
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Précédent
            </Button>
            
            <Button 
              onClick={handleNextStep}
              disabled={isSubmitting}
            >
              {currentStep === 4 ? (isSubmitting ? "Génération..." : "Générer le devis") : "Suivant"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
