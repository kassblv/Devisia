"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { IconEdit, IconTrash, IconMail, IconPhone, IconBuildingSkyscraper, IconFileInvoice, IconCreditCard } from "@tabler/icons-react";

interface Quote {
  id: string;
  quoteNumber: string;
  totalAmount: number;
  status: string;
  expiryDate: string | null;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  kbis: string | null;
  vatNumber: string | null;
  notes: string | null;
  quoteCount: number;
  totalSpent: number;
  quotes: Quote[];
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/clients/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Client non trouvé");
            setTimeout(() => {
              router.push("/dashboard/clients");
            }, 1500);
            return;
          }
          throw new Error("Erreur lors de la récupération du client");
        }
        
        const data = await response.json();
        setClient(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors de la récupération du client");
        setIsLoading(false);
      }
    };
    
    fetchClient();
  }, [params.id, router]);
  
  const handleEdit = () => {
    router.push(`/dashboard/clients/${params.id}/edit`);
  };
  
  const handleNewQuote = () => {
    if (client) {
      router.push(`/dashboard/quotes/new?clientId=${client.id}`);
    }
  };
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/clients/${params.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du client");
      }
      
      toast.success("Client supprimé avec succès");
      
      // Redirection après un court délai pour permettre à l'utilisateur de voir le toast
      setTimeout(() => {
        router.push("/dashboard/clients");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression du client");
      setShowDeleteModal(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return "bg-gray-100 text-gray-800";
      case 'SENT':
        return "bg-blue-100 text-blue-800";
      case 'APPROVED':
        return "bg-green-100 text-green-800";
      case 'REJECTED':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return "Brouillon";
      case 'SENT':
        return "Envoyé";
      case 'APPROVED':
        return "Approuvé";
      case 'REJECTED':
        return "Refusé";
      default:
        return status;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-6 w-full mb-6" />
              <Skeleton className="h-8 w-full mb-3" />
              <Skeleton className="h-24 w-full" />
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <Skeleton className="h-8 w-full mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>
            
            <Card className="p-6">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Client non trouvé</h1>
        <Button
          onClick={() => router.push("/dashboard/clients")}
          variant="default"
        >
          Retour à la liste des clients
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-indigo-900">
          {client.name}
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-pink-500 mt-2 rounded-full"></div>
        </h1>
        <div className="flex space-x-3">
          <Button
            onClick={handleEdit}
            variant="outline"
            className="flex items-center"
          >
            <IconEdit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button
            onClick={() => setShowDeleteModal(true)}
            variant="destructive"
            className="flex items-center"
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informations de contact</h2>
            
            <div className="space-y-4">
              {client.email && (
                <div className="flex items-center">
                  <IconMail className="h-5 w-5 text-gray-500 mr-2" />
                  <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                    {client.email}
                  </a>
                </div>
              )}
              
              {client.phone && (
                <div className="flex items-center">
                  <IconPhone className="h-5 w-5 text-gray-500 mr-2" />
                  <a href={`tel:${client.phone}`} className="text-blue-600 hover:underline">
                    {client.phone}
                  </a>
                </div>
              )}
              
              {client.company && (
                <div className="flex items-center">
                  <IconBuildingSkyscraper className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{client.company}</span>
                </div>
              )}
              
              {client.address && (
                <div className="flex items-start">
                  <IconBuildingSkyscraper className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <span>{client.address}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Informations administratives</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {client.kbis && (
                  <div>
                    <span className="text-sm text-gray-500 block">N° KBIS</span>
                    <span className="font-medium">{client.kbis}</span>
                  </div>
                )}
                
                {client.vatNumber && (
                  <div>
                    <span className="text-sm text-gray-500 block">N° TVA</span>
                    <span className="font-medium">{client.vatNumber}</span>
                  </div>
                )}
              </div>
            </div>
            
            {client.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="text-gray-700 whitespace-pre-line">{client.notes}</p>
              </div>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <IconFileInvoice className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Nombre de devis</span>
                    <span className="text-2xl font-bold">{client.quoteCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <IconCreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Total dépensé</span>
                    <span className="text-2xl font-bold">{formatCurrency(client.totalSpent)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-right">
              <Button 
                onClick={handleNewQuote}
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Créer un nouveau devis
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Devis récents</h2>
              <Button
                onClick={() => router.push(`/dashboard/quotes?clientId=${client.id}`)}
                variant="outline"
                size="sm"
              >
                Voir tous les devis
              </Button>
            </div>
            
            {client.quotes && client.quotes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3 rounded-tl-lg">Numéro</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3 rounded-tr-lg">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {client.quotes.slice(0, 5).map((quote) => (
                      <tr
                        key={quote.id}
                        onClick={() => router.push(`/dashboard/quotes/${quote.id}`)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-4 py-3">{quote.quoteNumber}</td>
                        <td className="px-4 py-3">{formatDate(quote.createdAt)}</td>
                        <td className="px-4 py-3">{formatCurrency(quote.totalAmount)}</td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(quote.status)}>
                            {getStatusLabel(quote.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>Aucun devis pour ce client</p>
                <Button 
                  onClick={handleNewQuote}
                  variant="default"
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  Créer un devis
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible et 
              supprimera également toutes les données associées à ce client.
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleDelete}
                variant="destructive"
              >
                Supprimer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
