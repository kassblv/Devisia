"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartAreaInteractive } from "@/components/charts/area-chart";
import { Eye, Pencil } from "lucide-react";

interface DashboardStats {
  totalQuotes: number;
  pendingQuotes: number;
  approvedQuotes: number;
  totalRevenue: number;
}

interface RecentQuote {
  id: string;
  quoteNumber: string;
  clientName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalQuotes: 0,
    pendingQuotes: 0,
    approvedQuotes: 0,
    totalRevenue: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/dashboard?userId=${session.user.id}`);
          const data = await response.json();
          
          if (response.ok) {
            setStats(data.stats);
            setRecentQuotes(data.recentQuotes);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données du tableau de bord:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session]);

  // Nous utilisons directement les stats et quotes actuels
  // Les composants Skeleton s'afficheront pendant le chargement
  const displayStats = stats;
  const displayQuotes = recentQuotes;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-slate-100 text-slate-700 border border-slate-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'SENT':
        return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
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

  return (
    <div className="h-full w-full pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Quotes Card - Style amélioré avec dégradé et ombre colorée */}
        <div className="bg-white dark:bg-gray-800 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 p-6 border border-indigo-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white p-4 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="ml-5">
              <h3 className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Total devis</h3>
              {loading ? (
                <Skeleton className="h-8 w-12 dark:bg-gray-700" />
              ) : (
                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{displayStats.totalQuotes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pending Quotes Card - Style amélioré avec dégradé et ombre colorée */}
        <div className="bg-white dark:bg-gray-800 bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-900/20 rounded-xl shadow-md hover:shadow-lg hover:shadow-amber-100 dark:hover:shadow-amber-900/20 p-6 border border-amber-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-4 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400">En attente</h3>
              {loading ? (
                <Skeleton className="h-8 w-12 dark:bg-gray-700" />
              ) : (
                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{displayStats.pendingQuotes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Approved Quotes Card - Style amélioré avec dégradé et ombre colorée */}
        <div className="bg-white dark:bg-gray-800 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/20 rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20 p-6 border border-emerald-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white p-4 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Approuvés</h3>
              {loading ? (
                <Skeleton className="h-8 w-12 dark:bg-gray-700" />
              ) : (
                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{displayStats.approvedQuotes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Total Revenue Card - Style amélioré avec dégradé et ombre colorée */}
        <div className="bg-white dark:bg-gray-800 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/20 rounded-xl shadow-md hover:shadow-lg hover:shadow-pink-100 dark:hover:shadow-pink-900/20 p-6 border border-pink-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-pink-400 to-pink-600 text-white p-4 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Chiffre d'affaires</h3>
              {loading ? (
                <Skeleton className="h-8 w-24 dark:bg-gray-700" />
              ) : (
                <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">{formatCurrency(displayStats.totalRevenue)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Graphique d'évolution du chiffre d'affaires */}
      <div className="mb-6">
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-[250px] w-full rounded-lg" />
          </div>
        ) : (
          <ChartAreaInteractive />
        )}
      </div>

      {/* Recent Quotes - Design amélioré */}
      <div className="bg-white dark:bg-gray-800 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/20 rounded-xl shadow-md border border-indigo-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="px-6 py-5 border-b border-indigo-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-serif font-semibold text-indigo-900 dark:text-white">Devis récents</h2>
          <Link
            href="/dashboard/quotes"
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center transition-colors duration-200 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 px-3 py-1 rounded-md"
          >
            Voir tous
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
        {displayQuotes.length === 0 && !loading ? (
          <div className="p-6 bg-indigo-50/30 dark:bg-indigo-950/20">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun devis</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Commencez par créer un nouveau devis.</p>
                <div className="mt-6">
                  <Link
                    href="/dashboard/quotes/new"
                    className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nouveau devis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">N° Devis</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Montant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                // Afficher des squelettes pendant le chargement
                Array(4).fill(0).map((_, index) => (
                  <tr key={`skeleton-row-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-24 dark:bg-gray-700" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-32 dark:bg-gray-700" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-20 dark:bg-gray-700" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-24 dark:bg-gray-700" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16 rounded-full dark:bg-gray-700" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Skeleton className="h-7 w-12 rounded-md dark:bg-gray-700" />
                        <Skeleton className="h-7 w-16 rounded-md dark:bg-gray-700" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : displayQuotes.length > 0 ? (
                displayQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-indigo-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{quote.quoteNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{quote.clientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(quote.totalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(quote.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${getStatusBadgeColor(quote.status)}`}>
                        {getStatusLabel(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/dashboard/quotes/${quote.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex mr-6">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link href={`/dashboard/quotes/${quote.id}/edit`} className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300 inline-flex">
                        <Pencil className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Aucun devis trouvé
                  </td>
                </tr>
              )}
            </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-serif font-semibold text-gray-900 dark:text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/quotes/new"
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow p-6 flex items-center transition-colors border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Créer un devis</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Générez un nouveau devis pour un client</p>
            </div>
          </Link>

          <Link
            href="/dashboard/clients"
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow p-6 flex items-center transition-colors border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Gérer les clients</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Consultez et modifiez vos clients</p>
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow p-6 flex items-center transition-colors border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.379.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Paramètres</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Personnalisez votre compte et vos devis</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
