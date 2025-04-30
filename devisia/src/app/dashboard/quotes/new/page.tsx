"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export default function NewQuote() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    { description: "", quantity: 1, unitPrice: 0, discount: 0 },
  ]);
  
  const addItem = () => {
    setQuoteItems([
      ...quoteItems,
      { description: "", quantity: 1, unitPrice: 0, discount: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const updatedItems = [...quoteItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setQuoteItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return quoteItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
      return sum + itemTotal;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    // Vous pourriez ajouter d'autres calculs ici (taxes, frais supplémentaires, etc.)
    return subtotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || quoteItems.some(item => !item.description)) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          clientEmail,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          notes,
          status: "DRAFT",
          items: quoteItems,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création du devis");
      }
      
      router.push("/dashboard/quotes");
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création du devis");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nouveau Devis</h1>
        <Button
          onClick={() => router.back()}
          variant="outline"
        >
          Retour
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Informations du client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom du client *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email du client</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date d'échéance</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Card>
        
        <Card className="mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Articles</h2>
            <Button 
              type="button" 
              onClick={addItem} 
              variant="outline"
            >
              Ajouter un article
            </Button>
          </div>
          
          {quoteItems.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Article {index + 1}</h3>
                {quoteItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantité</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix unitaire (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Remise (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.discount}
                    onChange={(e) => updateItem(index, "discount", parseFloat(e.target.value))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 text-right">
            <div className="text-lg font-medium">
              Sous-total: {calculateSubtotal().toFixed(2)} €
            </div>
            <div className="text-xl font-bold mt-2">
              Total: {calculateTotal().toFixed(2)} €
            </div>
          </div>
        </Card>
        
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            placeholder="Ajoutez des informations complémentaires à votre devis..."
          />
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Création en cours..." : "Créer le devis"}
          </Button>
        </div>
      </form>
    </div>
  );
}
