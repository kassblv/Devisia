"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

export default function NewQuote() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // États pour les clients et la sélection
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  
  // États pour les détails du client (pour le nouveau client ou si aucun client sélectionné)
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    { description: "", quantity: 1, unitPrice: 0, discount: 0 },
  ]);
  
  // Charger les clients depuis l'API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        if (response.ok) {
          const clientsData = await response.json();
          setClients(clientsData);
        } else {
          console.error("Erreur lors du chargement des clients");
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoadingClients(false);
      }
    };
    
    if (session?.user) {
      fetchClients();
    }
  }, [session]);
  
  // Mettre à jour les champs du client lorsqu'un client est sélectionné
  useEffect(() => {
    if (selectedClientId) {
      const selectedClient = clients.find(client => client.id === selectedClientId);
      if (selectedClient) {
        setClientName(selectedClient.name);
        setClientEmail(selectedClient.email || "");
        setClientCompany(selectedClient.company || "");
        setClientPhone(selectedClient.phone || "");
      }
    } else if (!showNewClientForm) {
      // Réinitialiser les champs si aucun client n'est sélectionné et qu'on n'est pas en mode nouveau client
      setClientName("");
      setClientEmail("");
      setClientCompany("");
      setClientPhone("");
    }
  }, [selectedClientId, clients, showNewClientForm]);
  
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
    
    // Validation des champs obligatoires
    if ((!selectedClientId && !clientName) || quoteItems.some(item => !item.description)) {
      alert("Veuillez sélectionner un client ou créer un nouveau client et remplir tous les champs obligatoires");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Créer un nouveau client si nécessaire
      let clientId = selectedClientId;
      
      if (!clientId && showNewClientForm) {
        const clientResponse = await fetch("/api/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: clientName,
            email: clientEmail,
            company: clientCompany,
            phone: clientPhone,
          }),
        });
        
        if (!clientResponse.ok) {
          const errorData = await clientResponse.json();
          throw new Error(errorData.message || "Erreur lors de la création du client");
        }
        
        const newClient = await clientResponse.json();
        clientId = newClient.id;
      }
      
      // Créer le devis
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId,
          clientName,
          clientEmail,
          clientCompany,
          clientPhone,
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
      alert("Erreur lors de la création du devis: " + (error instanceof Error ? error.message : String(error)));
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Informations du client</h2>
            {!showNewClientForm && (
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewClientForm(true);
                  setSelectedClientId("");
                }}
              >
                Nouveau client
              </Button>
            )}
          </div>
          
          {!showNewClientForm ? (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Sélectionner un client existant *</label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    setShowNewClientForm(false);
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Sélectionner un client --</option>
                  {isLoadingClients ? (
                    <option disabled>Chargement des clients...</option>
                  ) : (
                    clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} {client.company ? `(${client.company})` : ''}
                      </option>
                    ))
                  )}
                </select>
                <Button 
                  type="button"
                  variant="link"
                  onClick={() => {
                    setShowNewClientForm(true);
                    setSelectedClientId("");
                  }}
                >
                  Créer un client
                </Button>
              </div>
              
              {selectedClientId && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Nom</span>
                      <span className="block mt-1">{clientName}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Email</span>
                      <span className="block mt-1">{clientEmail || "Non renseigné"}</span>
                    </div>
                    {clientCompany && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Entreprise</span>
                        <span className="block mt-1">{clientCompany}</span>
                      </div>
                    )}
                    {clientPhone && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Téléphone</span>
                        <span className="block mt-1">{clientPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Nouveau client</h3>
                <Button 
                  type="button"
                  variant="link"
                  onClick={() => {
                    setShowNewClientForm(false);
                    setClientName("");
                    setClientEmail("");
                    setClientCompany("");
                    setClientPhone("");
                  }}
                >
                  Annuler
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du client *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={showNewClientForm}
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
                  <label className="block text-sm font-medium mb-1">Entreprise</label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <div className="mt-4">
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
