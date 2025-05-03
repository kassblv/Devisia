"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  quoteCount: number;
  totalSpent: number;
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des clients");
        }
        
        const data = await response.json();
        setClients(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors de la récupération des clients");
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const sortedClients = [...filteredClients].sort((a, b) => {
    let compareResult = 0;
    
    if (sortBy === "name") {
      compareResult = a.name.localeCompare(b.name);
    } else if (sortBy === "email") {
      compareResult = a.email.localeCompare(b.email);
    } else if (sortBy === "company") {
      compareResult = (a.company || "").localeCompare(b.company || "");
    } else if (sortBy === "quoteCount") {
      compareResult = a.quoteCount - b.quoteCount;
    } else if (sortBy === "totalSpent") {
      compareResult = a.totalSpent - b.totalSpent;
    }
    
    return sortOrder === "asc" ? compareResult : -compareResult;
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="h-full w-full pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-indigo-900 dark:text-white mb-4 md:mb-0">
          Clients
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-400 to-pink-500 mt-2 rounded-full"></div>
        </h1>
        <button 
          onClick={() => router.push("/dashboard/clients/new")}
          className="flex items-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau Client
        </button>
      </div>
      
      <Card className="p-6 mb-8 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/20 border border-indigo-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full md:w-auto flex-1">
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-indigo-400 dark:text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, email ou entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors duration-200 placeholder-gray-400 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSort("name")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${sortBy === "name" ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
            >
              Nom {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("quoteCount")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${sortBy === "quoteCount" ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
            >
              Devis {sortBy === "quoteCount" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("totalSpent")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${sortBy === "totalSpent" ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
            >
              Total dépensé {sortBy === "totalSpent" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>
      </Card>
      
      {isLoading ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-60" />
            <Skeleton className="h-12 w-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-48 w-full rounded-xl dark:bg-gray-700" />
            ))}
          </div>
        </div>
      ) : sortedClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedClients.map((client) => (
            <Card 
              key={client.id} 
              className="p-6 transition-all duration-300 border border-indigo-100 dark:border-gray-700 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/20 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/30 transform hover:-translate-y-1 rounded-xl overflow-hidden"
            >
              <Link 
                href={`/dashboard/clients/${client.id}`}
                className="block"
              >
                <h2 className="text-xl font-bold mb-2 text-indigo-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center">
                  <span className="inline-block w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg text-white flex items-center justify-center mr-2 shadow-sm">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                  {client.name}
                </h2>
                <div className="text-gray-700 dark:text-gray-300 mb-4 pl-10">
                  <div className="flex items-center text-indigo-600 dark:text-indigo-300">
                    <svg className="h-4 w-4 mr-1 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {client.email}
                  </div>
                  {client.company && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <svg className="h-4 w-4 mr-1 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {client.company}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <svg className="h-4 w-4 mr-1 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {client.phone}
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-gray-700 flex justify-between text-sm">
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-md text-indigo-700 dark:text-indigo-300 font-medium">
                    {client.quoteCount} devis
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-md text-emerald-700 dark:text-emerald-300 font-medium">
                    {formatCurrency(client.totalSpent)}
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          {searchTerm ? (
            <p className="text-gray-700 dark:text-gray-300">Aucun client trouvé pour votre recherche.</p>
          ) : (
            <div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">Vous n'avez pas encore de clients.</p>
              <Button onClick={() => router.push("/dashboard/clients/new")} className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white">
                Créer votre premier client
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
