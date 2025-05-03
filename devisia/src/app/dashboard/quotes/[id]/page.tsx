"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { IconEdit, IconDownload, IconCheck, IconX, IconCalendar, IconCreditCard, IconUser, IconMail } from "@tabler/icons-react";

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientEmail: string | null;
  dueDate: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: QuoteItem[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const calculateItemTotal = (item: QuoteItem) => {
  return item.quantity * item.unitPrice * (1 - item.discount / 100);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'DRAFT': return 'gray';
    case 'SENT': return 'blue';
    case 'APPROVED': return 'green';
    case 'REJECTED': return 'red';
    case 'EXPIRED': return 'yellow';
    default: return 'gray';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'DRAFT': return 'Brouillon';
    case 'SENT': return 'Envoyé';
    case 'APPROVED': return 'Approuvé';
    case 'REJECTED': return 'Refusé';
    case 'EXPIRED': return 'Expiré';
    default: return status;
  }
};

export default function QuoteDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState<Quote | null>(null);
  
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/quotes/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du devis");
        }
        
        const data = await response.json();
        setQuote(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Impossible de charger le devis");
        setTimeout(() => {
          router.push("/dashboard/quotes");
        }, 1500);
      }
    };
    
    fetchQuote();
  }, [params.id, router]);
  
  const handleEdit = () => {
    router.push(`/dashboard/quotes/${params.id}/edit`);
  };
  
  const handleExportPDF = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}/export-pdf`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'exportation en PDF");
      }
      
      // Télécharger le PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devis-${quote?.quoteNumber || params.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'exportation en PDF");
    }
  };
  
  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut");
      }
      
      // Mettre à jour l'état local
      setQuote((prev) => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };
  
  const calculateSubtotal = () => {
    if (!quote || !quote.items) return 0;
    return quote.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Chargement du devis...</p>
      </div>
    );
  }
  
  if (!quote) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Devis non trouvé</p>
        <Button onClick={() => router.push("/dashboard/quotes")} className="mt-4">
          Retour à la liste des devis
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Devis #{quote.quoteNumber}</h1>
          <div className="flex items-center mt-2">
            <Badge color={getStatusColor(quote.status)}>
              {getStatusLabel(quote.status)}
            </Badge>
            <span className="ml-4 text-sm text-gray-500">
              Créé le {formatDate(quote.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Retour
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            Modifier
          </Button>
          <Button onClick={handleExportPDF}>
            Exporter en PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">Détails du devis</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Client</h3>
              <p className="text-lg">{quote.clientName}</p>
              {quote.clientEmail && (
                <p className="text-gray-600">{quote.clientEmail}</p>
              )}
            </div>
            
            {quote.dueDate && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Date d'échéance</h3>
                <p>{formatDate(quote.dueDate)}</p>
              </div>
            )}
            
            {quote.notes && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
                <p className="whitespace-pre-line">{quote.notes}</p>
              </div>
            )}
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Articles</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-right">Quantité</th>
                    <th className="py-2 px-4 text-right">Prix unitaire</th>
                    <th className="py-2 px-4 text-right">Remise</th>
                    <th className="py-2 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4">{item.description}</td>
                      <td className="py-3 px-4 text-right">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 px-4 text-right">{item.discount}%</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(calculateItemTotal(item))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-right font-bold">
                      Total
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-lg">
                      {formatCurrency(calculateSubtotal())}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            
            <div className="flex flex-col gap-2">
              {quote.status === "DRAFT" && (
                <Button 
                  onClick={() => handleUpdateStatus("SENT")}
                  className="w-full"
                >
                  Marquer comme envoyé
                </Button>
              )}
              
              {quote.status === "SENT" && (
                <>
                  <Button 
                    onClick={() => handleUpdateStatus("APPROVED")}
                    className="w-full"
                    color="success"
                  >
                    Marquer comme approuvé
                  </Button>
                  <Button 
                    onClick={() => handleUpdateStatus("REJECTED")}
                    className="w-full"
                    color="danger"
                  >
                    Marquer comme refusé
                  </Button>
                </>
              )}
              
              <Button 
                variant="outline"
                onClick={handleExportPDF}
                className="w-full mt-2"
              >
                Exporter en PDF
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleEdit}
                className="w-full mt-2"
              >
                Modifier le devis
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Historique</h2>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 mr-3"></div>
                <div>
                  <p className="font-medium">Devis créé</p>
                  <p className="text-sm text-gray-500">{formatDate(quote.createdAt)}</p>
                </div>
              </div>
              
              {quote.createdAt !== quote.updatedAt && (
                <div className="flex items-start">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 mr-3"></div>
                  <div>
                    <p className="font-medium">Dernière modification</p>
                    <p className="text-sm text-gray-500">{formatDate(quote.updatedAt)}</p>
                  </div>
                </div>
              )}
              
              {/* Ici, on pourrait ajouter d'autres événements de l'historique si on les stockait en base de données */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
