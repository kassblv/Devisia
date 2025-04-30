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

  // Pour la démo, nous utilisons des données fictives
  const demoQuotes: Quote[] = [
    {
      id: "1",
      quoteNumber: "DEV-2025-001",
      clientName: "Acme Inc.",
      clientEmail: "contact@acme.com",
      totalAmount: 3500,
      status: "APPROVED",
      createdAt: "2025-04-25T10:00:00.000Z",
      expiryDate: "2025-05-25T10:00:00.000Z",
    },
    {
      id: "2",
      quoteNumber: "DEV-2025-002",
      clientName: "TechSolutions SAS",
      clientEmail: "info@techsolutions.fr",
      totalAmount: 2200,
      status: "SENT",
      createdAt: "2025-04-27T14:30:00.000Z",
      expiryDate: "2025-05-27T14:30:00.000Z",
    },
    {
      id: "3",
      quoteNumber: "DEV-2025-003",
      clientName: "GlobalDesign",
      clientEmail: "projects@globaldesign.com",
      totalAmount: 1800,
      status: "DRAFT",
      createdAt: "2025-04-28T09:15:00.000Z",
      expiryDate: null,
    },
    {
      id: "4",
      quoteNumber: "DEV-2025-004",
      clientName: "StartupXYZ",
      clientEmail: "founder@startupxyz.io",
      totalAmount: 4200,
      status: "SENT",
      createdAt: "2025-04-29T11:45:00.000Z",
      expiryDate: "2025-05-29T11:45:00.000Z",
    },
    {
      id: "5",
      quoteNumber: "DEV-2025-005",
      clientName: "Local Business",
      clientEmail: "owner@localbusiness.fr",
      totalAmount: 950,
      status: "REJECTED",
      createdAt: "2025-04-20T15:10:00.000Z",
      expiryDate: "2025-05-20T15:10:00.000Z",
    },
    {
      id: "6",
      quoteNumber: "DEV-2025-006",
      clientName: "E-commerce Plus",
      clientEmail: "service@ecomplus.com",
      totalAmount: 5200,
      status: "APPROVED",
      createdAt: "2025-04-15T08:30:00.000Z",
      expiryDate: "2025-05-15T08:30:00.000Z",
    },
  ];

  const displayQuotes = loading ? demoQuotes : quotes;

  // Fonction pour filtrer les devis en fonction de la recherche et du filtre de statut
  const filteredQuotes = displayQuotes.filter(quote => {
    const matchesSearch = 
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Fonction pour trier les devis
  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
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
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-4 md:mb-0">
          Mes devis
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-pink-500 mt-2 rounded-full"></div>
        </h1>
        <Link
          href="/dashboard/quotes/new"
          className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-md text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau devis
        </Link>
      </div>

      {/* Filtres et recherche - Style amélioré */}
      <div className="bg-white bg-gradient-to-br from-white to-indigo-50/30 shadow-md hover:shadow-lg rounded-xl p-6 mb-8 border border-indigo-100 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="sr-only">Rechercher</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-indigo-200 rounded-lg py-2.5 bg-white shadow-sm transition-colors duration-200"
                placeholder="Rechercher un devis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-1/4">
            <label htmlFor="status-filter" className="sr-only">Filtrer par statut</label>
            <select
              id="status-filter"
              className="mt-1 block w-full py-2.5 px-3 border border-indigo-200 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
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

          <div className="w-full md:w-1/4">
            <label htmlFor="sort-by" className="sr-only">Trier par</label>
            <select
              id="sort-by"
              className="mt-1 block w-full py-2.5 px-3 border border-indigo-200 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
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

          <div className="w-full md:w-auto">
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {sortOrder === "asc" ? (
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              )}
              <span className="sr-only">{sortOrder === "asc" ? "Tri ascendant" : "Tri descendant"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste des devis */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedQuotes.length > 0 ? (
                sortedQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.quoteNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quote.clientName}</div>
                      <div className="text-sm text-gray-500">{quote.clientEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(quote.totalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(quote.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(quote.expiryDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(quote.status)}`}>
                        {getStatusLabel(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/dashboard/quotes/${quote.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir
                        </Link>
                        <Link
                          href={`/dashboard/quotes/${quote.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
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
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 mb-2">Aucun devis trouvé</p>
                      <Link
                        href="/dashboard/quotes/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
