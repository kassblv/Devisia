"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table"; // Import the new DataTable component
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  expiryDate: string | null;
}

export default function QuotesPage() {
  const { data: session } = useSession();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/quotes?userId=${session.user.id}`);
          const data = await response.json();
          
          if (response.ok) {
            setQuotes(data.quotes);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des devis:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session?.user?.id) {
      fetchQuotes();
    }
  }, [session]);

  // Fonction pour filtrer les devis en fonction du terme de recherche et du filtre de statut
  const filteredQuotes = useMemo(() => {
    return [...quotes].filter(quote => {
      // Filtre de recherche
      const searchMatch = 
        (quote.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clientName?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtre de statut
      const statusMatch = statusFilter === 'all' || quote.status === statusFilter;
      
      return searchMatch && statusMatch;
    });
  }, [quotes, searchTerm, statusFilter]);

  // Fonction pour trier les devis
  const sortedQuotes = useMemo(() => {
    return [...filteredQuotes].sort((a, b) => {
      if (sortBy === 'createdAt') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'amount') {
        const amountA = a.totalAmount || 0;
        const amountB = b.totalAmount || 0;
        return sortOrder === 'asc' ? amountA - amountB : amountB - amountA;
      } else if (sortBy === 'expiryDate') {
        const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : 0;
        const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : 0;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // Par défaut, tri par quoteNumber
        const numA = a.quoteNumber || '';
        const numB = b.quoteNumber || '';
        return sortOrder === 'asc' ? numA.localeCompare(numB) : numB.localeCompare(numA);
      }
    });
  }, [filteredQuotes, sortBy, sortOrder]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "viewed":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "expired":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Brouillon';
      case 'SENT':
        return 'Envoyé';
      case 'APPROVED':
        return 'Approuvé';
      case 'REJECTED':
        return 'Refusé';
      default:
        return status;
    }
  };

  const toggleSortOrder = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900 dark:text-white mb-2">
            Mes devis
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-400 to-pink-500 mb-4 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 md:mb-0">
            Gérez et suivez tous vos devis en un seul endroit
          </p>
        </div>
        <Link
          href="/dashboard/quotes/new"
          className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-md text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-900 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg self-start md:self-center"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau devis
        </Link>
      </div>

      {/* Filtres et recherche - Style amélioré */}
      <div className="bg-white dark:bg-gray-800 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/20 shadow-md hover:shadow-lg rounded-xl p-6 mb-6 border border-indigo-100 dark:border-gray-700 transition-all duration-300">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filtres et recherche</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1 lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher par numéro, client..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="status-filter" className="sr-only">Filtrer par statut</label>
            <select
              className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="DRAFT">Brouillons</option>
              <option value="SENT">Envoyés</option>
              <option value="APPROVED">Approuvés</option>
              <option value="REJECTED">Refusés</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort-by" className="sr-only">Trier par</label>
            <select
              id="sort-by"
              className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                if (sortBy !== e.target.value) {
                  setSortOrder("asc");
                }
              }}
            >
              <option value="createdAt">Date de création</option>
              <option value="expiryDate">Date d'expiration</option>
              <option value="totalAmount">Montant</option>
              <option value="clientName">Nom du client</option>
              <option value="quoteNumber">Numéro de devis</option>
            </select>
          </div>

          <div>
            <label htmlFor="page-size" className="sr-only">Nombre de devis par page</label>
            <select
              id="page-size"
              className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setSortBy('date');
              setSortOrder('desc');
            }}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Liste des devis avec DataTable */}
      <DataTable
        columns={[
          {
            key: "quoteNumber",
            header: "N° Devis",
            cell: (quote) => (
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {quote.quoteNumber}
              </span>
            ),
            sortable: true
          },
          {
            key: "client",
            header: "Client",
            cell: (quote) => (
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{quote.clientName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">{quote.clientEmail}</div>
              </div>
            ),
            sortable: true
          },
          {
            key: "totalAmount",
            header: "Montant",
            cell: (quote) => (
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {formatCurrency(quote.totalAmount)}
              </span>
            ),
            sortable: true,
            // Masquer cette colonne sur les écrans très petits
            hidden: (width) => width < 640
          },
          {
            key: "createdAt",
            header: "Créé le",
            cell: (quote) => (
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {formatDate(quote.createdAt)}
              </span>
            ),
            sortable: true,
            // Masquer cette colonne sur les petits écrans
            hidden: (width) => width < 768
          },
          {
            key: "expiryDate",
            header: "Expire le",
            cell: (quote) => (
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {formatDate(quote.expiryDate)}
              </span>
            ),
            sortable: true,
            // Masquer cette colonne sur les petits écrans
            hidden: (width) => width < 900
          },
          {
            key: "status",
            header: "Statut",
            cell: (quote) => (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(quote.status)}`}>
                {getStatusLabel(quote.status)}
              </span>
            )
          },
          {
            key: "actions",
            header: "Actions",
            cell: (quote) => (
              <div className="flex items-center justify-end space-x-2">
                {/* Bouton Voir */}
                <div className="relative group">
                  <Link
                    href={`/dashboard/quotes/${quote.id}`}
                    className="inline-flex items-center justify-center p-2 rounded-full text-primary bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
                    aria-label="Voir le devis"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                  <div className="absolute z-10 w-24 px-2 py-1 text-xs text-center text-white bg-gray-700 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 bottom-full mb-1 left-1/2 transform -translate-x-1/2 transition-opacity duration-200">
                    Voir le devis
                    <svg className="absolute text-gray-700 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                  </div>
                </div>
                
                {/* Bouton Modifier */}
                <div className="relative group">
                  <Link
                    href={`/dashboard/quotes/${quote.id}/edit`}
                    className="inline-flex items-center justify-center p-2 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                    aria-label="Modifier le devis"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <div className="absolute z-10 w-24 px-2 py-1 text-xs text-center text-white bg-gray-700 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 bottom-full mb-1 left-1/2 transform -translate-x-1/2 transition-opacity duration-200">
                    Modifier
                    <svg className="absolute text-gray-700 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                  </div>
                </div>
                
                {/* Menu d'actions */}
                <div className="relative group">
                  <button
                    className="inline-flex items-center justify-center p-2 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
                    aria-label="Plus d'actions"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  <div className="absolute z-20 mt-1 right-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden transform scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto origin-top-right transition-all duration-200">
                    <div className="py-1">
                      <button
                        onClick={async () => {
                          try {
                            // Fonction pour dupliquer un devis
                            const response = await fetch(`/api/quotes/${quote.id}/duplicate`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              }
                            });
                            
                            if (response.ok) {
                              toast.success('Devis dupliqué avec succès!');
                              // Recharger la page pour afficher le nouveau devis
                              window.location.reload();
                            } else {
                              toast.error('Erreur lors de la duplication du devis');
                            }
                          } catch (error) {
                            console.error('Erreur:', error);
                            toast.error('Une erreur est survenue');
                          }
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        Dupliquer
                      </button>
                      <button
                        onClick={() => {
                          // Fonction pour marquer comme envoyé
                          if (window.confirm(`Marquer le devis ${quote.quoteNumber} comme envoyé?`)) {
                            // Appel API à implémenter
                          }
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Marquer comme envoyé
                      </button>
                      <button
                        onClick={() => {
                          // Fonction pour supprimer un devis
                          if (window.confirm(`Êtes-vous sûr de vouloir supprimer le devis ${quote.quoteNumber}?`)) {
                            // Appel API de suppression à implémenter
                          }
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ),
            className: "text-right"
          }
        ]}
        data={sortedQuotes}
        keyField="id"
        defaultSortColumn={sortBy}
        defaultSortDirection={sortOrder}
        pagination={true}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={filteredQuotes.length}
        onPageChange={setCurrentPage}
        onSortChange={(column, direction) => {
          setSortBy(column);
          setSortOrder(direction);
        }}
        isLoading={loading}
        scrollable={false} // Désactiver le scroll horizontal
        emptyState={
          <div className="flex flex-col items-center justify-center">
            <svg className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-300 mb-2">Aucun devis trouvé</p>
            <Link
              href="/dashboard/quotes/new"
              className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-md text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer un devis
            </Link>
          </div>
        }
        rowClassName={(row) => `hover:bg-gray-50 dark:hover:bg-gray-700`}
        headerClassName="bg-gray-50 dark:bg-gray-700"
      />
    </div>
  );
}
