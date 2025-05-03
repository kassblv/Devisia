"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

  // Composant Shimmer pour les lignes de chargement
  const QuoteShimmerRow = ({ index }: { index: number }) => (
    <tr key={`shimmer-${index}`} className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-48"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end space-x-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-14"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </td>
    </tr>
  );

  const displayQuotes = loading ? [] : quotes;

  // Fonction pour filtrer les devis en fonction de la recherche et du filtre de statut
  const filteredQuotesBySearch = quotes.filter(quote =>
    quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuotesByStatus = statusFilter === 'all'
    ? filteredQuotesBySearch
    : filteredQuotesBySearch.filter(quote => quote.status.toLowerCase() === statusFilter);

  // Fonction pour trier les devis
  const filteredQuotes = [...filteredQuotesByStatus].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === "createdAt") {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "expiryDate") {
      // Si l'un des deux est null, le placer à la fin
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      comparison = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    } else if (sortBy === "totalAmount") {
      comparison = a.totalAmount - b.totalAmount;
    } else if (sortBy === "clientName") {
      comparison = a.clientName.localeCompare(b.clientName);
    } else if (sortBy === "quoteNumber") {
      comparison = a.quoteNumber.localeCompare(b.quoteNumber);
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

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

      {/* Liste des devis */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSortOrder("quoteNumber")}>
                  <div className="flex items-center">
                    <span>N° Devis</span>
                    {sortBy === "quoteNumber" && (
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSortOrder("clientName")}>
                  <div className="flex items-center">
                    <span>Client</span>
                    {sortBy === "clientName" && (
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSortOrder("totalAmount")}>
                  <div className="flex items-center">
                    <span>Montant</span>
                    {sortBy === "totalAmount" && (
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSortOrder("createdAt")}>
                  <div className="flex items-center">
                    <span>Créé le</span>
                    {sortBy === "createdAt" && (
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSortOrder("expiryDate")}>
                  <div className="flex items-center">
                    <span>Expire le</span>
                    {sortBy === "expiryDate" && (
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                // Afficher des shimmer pendant le chargement
                Array.from({ length: 6 }).map((_, index) => (
                  <QuoteShimmerRow key={index} index={index} />
                ))
              ) : filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{quote.quoteNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{quote.clientName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">{quote.clientEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(quote.totalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(quote.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(quote.expiryDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(quote.status)}`}>
                        {getStatusLabel(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/dashboard/quotes/${quote.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Voir
                        </Link>
                        <Link
                          href={`/dashboard/quotes/${quote.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => {
                            // Fonction pour supprimer un devis (à implémenter)
                            if (window.confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
                              // Appel API de suppression
                            }
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-300">
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
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
