"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface Material {
  quantité: number;
  prix_unitaire: number;
}

interface Service {
  prix: number;
}

interface MainOeuvre {
  heures_estimees: number;
  taux_horaire: number;
}

interface QuoteTotalsProps {
  materiaux: Material[];
  postes: Service[];
  mainOeuvre: MainOeuvre;
  totalHT: number;
  totalTTC: number;
  setEditedQuote: (data: any) => void;
}

export default function QuoteTotals({
  materiaux,
  postes,
  mainOeuvre,
  totalHT,
  totalTTC,
  setEditedQuote
}: QuoteTotalsProps) {
  // Calcul des totaux
  const calculateMateriauxTotal = () => {
    return materiaux.reduce((acc, item) => acc + (item.quantité * item.prix_unitaire), 0);
  };

  const calculateServicesTotal = () => {
    return postes.reduce((acc, item) => acc + item.prix, 0);
  };

  const calculateMainOeuvreTotal = () => {
    return mainOeuvre.heures_estimees * mainOeuvre.taux_horaire;
  };

  // Calculer les totaux
  const materiauxTotal = calculateMateriauxTotal();
  const servicesTotal = calculateServicesTotal();
  const mainOeuvreTotal = calculateMainOeuvreTotal();
  
  // Total HT calculé
  const calculatedTotalHT = materiauxTotal + servicesTotal + mainOeuvreTotal;
  
  // Taux de TVA (20% par défaut)
  const handleTVAChange = (value: number) => {
    const newTotalTTC = calculatedTotalHT * (1 + value / 100);
    setEditedQuote((prev: any) => ({
      ...prev,
      tva: value,
      totalHT: calculatedTotalHT,
      totalTTC: newTotalTTC
    }));
  };

  // Taux de TVA actuel (20% par défaut)
  const tva = totalTTC > totalHT ? ((totalTTC / totalHT) - 1) * 100 : 20;

  return (
    <div className="space-y-6 p-4 bg-card border rounded-md">
      <h3 className="text-lg font-serif font-semibold">Résumé financier</h3>
      
      {/* Récapitulatif des montants */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">Total Matériaux</div>
          <div className="text-right font-mono">{formatCurrency(materiauxTotal)}</div>
          
          <div className="font-medium">Total Services</div>
          <div className="text-right font-mono">{formatCurrency(servicesTotal)}</div>
          
          <div className="font-medium">Total Main d'œuvre</div>
          <div className="text-right font-mono">{formatCurrency(mainOeuvreTotal)}</div>
          
          <div className="border-t pt-2 font-medium">Total HT</div>
          <div className="border-t pt-2 text-right font-mono font-medium">{formatCurrency(calculatedTotalHT)}</div>
        </div>
        
        {/* Configuration de la TVA */}
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label htmlFor="tva" className="text-right">Taux de TVA (%)</Label>
            <Input 
              id="tva" 
              type="number" 
              min="0" 
              max="100"
              step="0.1"
              value={tva} 
              onChange={(e) => handleTVAChange(parseFloat(e.target.value) || 0)}
              className="w-32 font-mono text-right"
            />
          </div>
        </div>
        
        {/* Total TTC */}
        <div className="bg-primary/5 p-4 rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-lg font-serif font-semibold">Total TTC</div>
            <div className="text-right text-lg font-mono font-bold">
              {formatCurrency(totalTTC || calculatedTotalHT * (1 + tva/100))}
            </div>
            
            <div className="text-sm text-muted-foreground">dont TVA</div>
            <div className="text-right text-sm font-mono text-muted-foreground">
              {formatCurrency((totalTTC || calculatedTotalHT * (1 + tva/100)) - calculatedTotalHT)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
