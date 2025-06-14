"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialsTab from "./tabs/MaterialsTab";
import ServicesTab from "./tabs/ServicesTab";
import QuoteTotals from "./tabs/QuoteTotals";
import QuoteDetails from "./tabs/QuoteDetails";
import RevisionSection from "./RevisionSection";

interface QuoteEditStepProps {
  generatedQuote: any;
  editedQuote: any;
  setEditedQuote: (data: any) => void;
  revisionInstructions: string;
  setRevisionInstructions: (value: string) => void;
  isSubmitting: boolean;
  regenerateQuote: () => Promise<void>;
  saveEditedQuote: () => Promise<void>;
}

export default function QuoteEditStep({
  generatedQuote,
  editedQuote,
  setEditedQuote,
  revisionInstructions,
  setRevisionInstructions,
  isSubmitting,
  regenerateQuote,
  saveEditedQuote
}: QuoteEditStepProps) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Édition du Devis</CardTitle>
        <CardDescription>
          Le devis a été généré. Vous pouvez le modifier avant de le sauvegarder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="details" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="materiaux">Matériaux</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="total">Totaux</TabsTrigger>
          </TabsList>
          
          {/* Onglet Détails */}
          <TabsContent value="details">
            <QuoteDetails 
              editedQuote={editedQuote} 
              setEditedQuote={setEditedQuote} 
            />
          </TabsContent>
          
          {/* Onglet Matériaux */}
          <TabsContent value="materiaux">
            <MaterialsTab 
              materiaux={editedQuote.materiaux || []} 
              setMateriaux={(newMateriaux) => setEditedQuote({...editedQuote, materiaux: newMateriaux})}
            />
          </TabsContent>
          
          {/* Onglet Services/Main d'œuvre */}
          <TabsContent value="services">
            <ServicesTab
              postes={editedQuote.postes || []} 
              setPostes={(newPostes) => setEditedQuote({...editedQuote, postes: newPostes})}
              mainOeuvre={editedQuote.main_oeuvre || { heures_estimees: 0, taux_horaire: 0 }}
              setMainOeuvre={(newMainOeuvre) => setEditedQuote({...editedQuote, main_oeuvre: newMainOeuvre})}
            />
          </TabsContent>
          
          {/* Onglet Totaux */}
          <TabsContent value="total">
            <QuoteTotals
              materiaux={editedQuote.materiaux || []}
              postes={editedQuote.postes || []}
              mainOeuvre={editedQuote.main_oeuvre || { heures_estimees: 0, taux_horaire: 0 }}
              totalHT={editedQuote.totalHT || 0}
              totalTTC={editedQuote.totalTTC || 0}
              setEditedQuote={setEditedQuote}
            />
          </TabsContent>
        </Tabs>
        
        {/* Section Révision */}
        <RevisionSection
          revisionInstructions={revisionInstructions}
          setRevisionInstructions={setRevisionInstructions}
          isSubmitting={isSubmitting}
          regenerateQuote={regenerateQuote}
          saveEditedQuote={saveEditedQuote}
        />
      </CardContent>
    </Card>
  );
}
