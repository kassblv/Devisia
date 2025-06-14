"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuoteDetailsProps {
  editedQuote: any;
  setEditedQuote: (data: any) => void;
}

export default function QuoteDetails({ editedQuote, setEditedQuote }: QuoteDetailsProps) {
  return (
    <div className="space-y-4 p-4 bg-card border rounded-md">
      <h3 className="text-lg font-serif font-semibold mb-4">Informations générales</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Titre du devis */}
        <div className="grid gap-2">
          <Label htmlFor="title">Titre du devis</Label>
          <Input 
            id="title" 
            value={editedQuote.title || ""} 
            onChange={(e) => setEditedQuote({...editedQuote, title: e.target.value})} 
            placeholder="Ex: Rénovation électrique complète"
          />
        </div>
        
        {/* Numéro du devis */}
        <div className="grid gap-2">
          <Label htmlFor="quoteNumber">Numéro du devis</Label>
          <Input 
            id="quoteNumber" 
            value={editedQuote.number || ""} 
            onChange={(e) => setEditedQuote({...editedQuote, number: e.target.value})} 
            placeholder="Ex: DEV-2025-0001"
          />
        </div>

        {/* Validité du devis */}
        <div className="grid gap-2">
          <Label htmlFor="validity">Validité du devis (jours)</Label>
          <Input 
            id="validity" 
            type="number" 
            min="1"
            value={editedQuote.validity || 30} 
            onChange={(e) => setEditedQuote({...editedQuote, validity: parseInt(e.target.value)})} 
          />
        </div>

        {/* Statut */}
        <div className="grid gap-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={editedQuote.status || "DRAFT"} 
            onValueChange={(value) => setEditedQuote({...editedQuote, status: value})}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
              <SelectItem value="SENT">Envoyé</SelectItem>
              <SelectItem value="ACCEPTED">Accepté</SelectItem>
              <SelectItem value="REJECTED">Refusé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description / Notes */}
      <div className="grid gap-2">
        <Label htmlFor="description">Description / Notes</Label>
        <Textarea 
          id="description" 
          value={editedQuote.description || editedQuote.notes || ""} 
          onChange={(e) => setEditedQuote({
            ...editedQuote, 
            description: e.target.value,
            notes: e.target.value // Pour assurer la compatibilité
          })} 
          placeholder="Détails supplémentaires concernant ce devis..."
          rows={4}
        />
      </div>
    </div>
  );
}
