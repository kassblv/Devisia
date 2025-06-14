"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface RevisionSectionProps {
  revisionInstructions: string;
  setRevisionInstructions: (value: string) => void;
  isSubmitting: boolean;
  regenerateQuote: () => Promise<void>;
  saveEditedQuote: () => Promise<void>;
}

export default function RevisionSection({
  revisionInstructions,
  setRevisionInstructions,
  isSubmitting,
  regenerateQuote,
  saveEditedQuote
}: RevisionSectionProps) {
  return (
    <div className="mt-6 space-y-4">
      <Separator />
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-lg font-serif font-semibold">Actions</h3>

          {/* Section pour régénérer le devis */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">Régénérer avec de nouvelles instructions</label>
            <Textarea
              value={revisionInstructions}
              onChange={(e) => setRevisionInstructions(e.target.value)}
              placeholder="Entrez vos instructions pour améliorer ou modifier le devis... (ex: 'Ajouter une remise de 5%', 'Détailler davantage les postes de main d'œuvre')"
              rows={3}
              className="mb-2"
            />
            <Button 
              onClick={regenerateQuote} 
              disabled={isSubmitting || !revisionInstructions.trim()}
              className="w-full"
            >
              {isSubmitting ? "Régénération..." : "✨ Régénérer le devis"}
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Actions de sauvegarde */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button 
                onClick={saveEditedQuote} 
                disabled={isSubmitting} 
                className="flex-1"
              >
                {isSubmitting ? "Sauvegarde..." : "Enregistrer les modifications"}
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                asChild
              >
                <a href="/dashboard/quotes">Terminer</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
