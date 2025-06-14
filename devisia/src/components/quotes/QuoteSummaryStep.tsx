"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Client {
  id: string;
  name: string;
  email?: string;
}

interface QuoteSummaryStepProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showClientResults: boolean;
  setShowClientResults: (show: boolean) => void;
  filteredClients: Client[];
  handleClientSelection: (clientId: string) => void;
  currentStep: number;
  formatQuestionnaireDataForDisplay: () => { label: string; value: any }[];
  userInstructions: string;
  prevStep: () => void;
  isSubmitting: boolean;
}

export default function QuoteSummaryStep({
  searchTerm,
  setSearchTerm,
  showClientResults,
  setShowClientResults,
  filteredClients,
  handleClientSelection,
  currentStep,
  formatQuestionnaireDataForDisplay,
  userInstructions,
  prevStep,
  isSubmitting
}: QuoteSummaryStepProps) {
  const formattedItems = formatQuestionnaireDataForDisplay();
  
  return (
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
              <Button variant="outline" size="sm" onClick={() => prevStep()} disabled={Number(currentStep) === 1}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                Modifier
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative w-full">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <div className="w-full">
                    <Input
                      type="text"
                      placeholder="Rechercher un client..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowClientResults(true);
                        
                      }}
                      onFocus={() => setShowClientResults(true)}
                      className="h-9 w-full"
                    />
                    {showClientResults && searchTerm && (
                      <div className="absolute z-10 w-full mt-1 bg-background rounded-md border shadow-md max-h-56 overflow-auto">
                        {filteredClients.length > 0 ? (
                          filteredClients.map(client => (
                            <div
                              key={client.id}
                              className="px-3 py-2 cursor-pointer hover:bg-secondary"
                              onClick={() => handleClientSelection(client.id)}
                            >
                              {client.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-muted-foreground">Aucun client trouvé</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section Détails du projet */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Détails du Projet</h3>
              <Button variant="outline" size="sm" onClick={() => prevStep()} disabled={Number(currentStep) === 2}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                Modifier
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {formattedItems.map((item) => (
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
              <Button variant="outline" size="sm" onClick={() => prevStep()} disabled={Number(currentStep) === 3}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                Modifier
              </Button>
            </div>
            <div className="bg-muted rounded p-2 flex justify-between items-center">
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
  );
}
