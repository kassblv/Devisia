"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface QuotePreviewProps {
  quote: any;
  client: any;
  companyInfo?: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    siret?: string;
    logo?: string;
  };
}

const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const QuotePreview = ({ quote, client, companyInfo }: QuotePreviewProps) => {
  // Valeurs par défaut pour l'entreprise si non fournies
  const company = companyInfo || {
    name: "Votre Entreprise",
    address: "123 Rue de l'Exemple, 75000 Paris",
    phone: "01 23 45 67 89",
    email: "contact@votreentreprise.com",
    website: "www.votreentreprise.com",
    siret: "123 456 789 00012",
    logo: "/logo-placeholder.svg"
  };
  
  // Status du devis avec badge de couleur
  const getStatusColor = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-secondary-100 text-secondary-600';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'DRAFT': return 'Brouillon';
      case 'SENT': return 'Envoyé';
      case 'APPROVED': return 'Approuvé';
      case 'REJECTED': return 'Refusé';
      default: return status || 'Brouillon';
    }
  };

  return (
    <Card className="w-full bg-white print:shadow-none border print:border-none">
      <CardContent className="p-6 md:p-8 space-y-6 print:p-4">
        {/* En-tête du document avec gradient et logo */}
        <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-primary/90 to-primary p-6 text-white shadow-lg print:bg-white print:text-black print:shadow-none print:border print:border-secondary-200">
          <div className="absolute top-0 right-0 w-40 h-40 -mt-8 -mr-8 bg-white/10 rounded-full blur-2xl transform rotate-45 print:hidden"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 bg-white/10 rounded-full blur-xl transform -rotate-12 print:hidden"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">DEVIS</span>
                <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getStatusColor(quote.status))}>
                  {getStatusLabel(quote.status)}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold">{quote.quoteNumber || "DEVIS-XXXX"}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Date: {formatDate(new Date())}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Validité: {formatDate(quote.expiryDate) || "30 jours"}</span>
                </div>
              </div>
            </div>
            
            {/* Logo et infos entreprise */}
            <div className="text-right space-y-2 flex-shrink-0">
              {company.logo && <img src={company.logo} alt="Logo" className="h-12 ml-auto mb-2" />}
              <h2 className="text-xl font-bold">{company.name}</h2>
              <div className="space-y-1 text-sm opacity-90">
                <p>{company.address}</p>
                <p>{company.phone}</p>
                <p>{company.email}</p>
                <p>SIRET: {company.siret}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations client et projet */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-secondary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.352-.035-.696-.1-1.028A5.001 5.001 0 0010 7z" clipRule="evenodd" />
              </svg>
              Client
            </h3>
            <div className="bg-secondary-50 p-4 rounded-md shadow-sm border border-secondary-100">
              <p className="font-semibold text-lg text-secondary-900">{client?.name || quote.clientName || "Client"}</p>
              <div className="mt-2 space-y-1 text-secondary-600">
                {(client?.email || quote.clientEmail) && (
                  <p className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 01-2 2H6a2 2 0 01-2-2V8.118z" />
                    </svg>
                    <span>{client?.email || quote.clientEmail}</span>
                  </p>
                )}
                {(client?.company || quote.clientCompany) && (
                  <p className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm-1 4h8v6H6V9z" clipRule="evenodd" />
                    </svg>
                    <span>{client?.company || quote.clientCompany}</span>
                  </p>
                )}
                {(client?.phone || quote.clientPhone) && (
                  <p className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{client?.phone || quote.clientPhone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Description du projet */}
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-secondary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              Détails du Projet
            </h3>
            <div className="bg-secondary-50 p-4 rounded-md shadow-sm border border-secondary-100">
              <h4 className="font-semibold text-lg text-secondary-900 mb-2">{quote.projet || "Projet de construction"}</h4>
              <p className="text-secondary-600 whitespace-pre-wrap text-sm">{quote.description || "Description du projet..."}</p>
            </div>
          </div>
        </div>

        {/* Section contenant tous les tableaux */}
        <div className="bg-secondary-50 rounded-md border border-secondary-100 shadow-sm p-3 sm:p-4 md:p-6 print:shadow-none">
          <h3 className="text-lg sm:text-xl font-bold text-secondary-900 flex items-center mb-4 sm:mb-5 border-b pb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Détails du Devis
          </h3>
          
          {/* Tableau des matériaux */}
          {quote.materiaux && quote.materiaux.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm sm:text-base font-semibold flex items-center text-secondary-600 mb-2 sm:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Matériaux et Équipements
              </h4>
              <div className="overflow-x-auto overflow-hidden rounded-md border border-secondary-200">
                <table className="w-full border-collapse bg-white text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-secondary-700">Description</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-secondary-700">Quantité</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-secondary-700">Unité</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-secondary-700">Prix unitaire</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-secondary-700">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.materiaux.map((item: any, index: number) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'} hover:bg-secondary-100`}>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-secondary-600">{item.nom}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right">{item.quantité}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right">{item.unité}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right">{formatCurrency(item.prix_unitaire)}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-semibold text-secondary-900">
                          {formatCurrency(item.quantité * item.prix_unitaire)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tableau des services */}
          {quote.postes && quote.postes.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm sm:text-base font-semibold flex items-center text-secondary-600 mb-2 sm:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7z" />
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm-1 4h8v6H6V9z" clipRule="evenodd" />
                </svg>
                Services et Prestations
              </h4>
              <div className="overflow-x-auto overflow-hidden rounded-md border border-secondary-200">
                <table className="w-full border-collapse bg-white text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-secondary-700">Description</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-secondary-700">Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.postes.map((item: any, index: number) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'} hover:bg-secondary-100`}>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-secondary-600">
                          <div>{item.nom}</div>
                          {item.description && (
                            <div className="text-xs text-secondary-500 mt-1">{item.description}</div>
                          )}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-semibold text-secondary-900">
                          {formatCurrency(item.prix)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Main d'œuvre */}
          {quote.main_oeuvre && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm sm:text-base font-semibold flex items-center text-secondary-600 mb-2 sm:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.352-.035-.696-.1-1.028A5.001 5.001 0 0010 7z" clipRule="evenodd" />
                </svg>
                Main d'œuvre
              </h4>
              <div className="overflow-x-auto overflow-hidden rounded-md border border-secondary-200">
                <table className="w-full border-collapse bg-white text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-secondary-700">Description</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-secondary-700">Heures</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-secondary-700">Taux horaire</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-secondary-700">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-secondary-100">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-secondary-600">Main d'œuvre</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right">{quote.main_oeuvre.heures_estimees}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right">{formatCurrency(quote.main_oeuvre.taux_horaire)}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-semibold text-secondary-900">
                        {formatCurrency(quote.main_oeuvre.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Autres postes */}
          {quote.postes && quote.postes.length > 0 && (
            <div className="mb-8">
              <h4 className="text-base font-semibold flex items-center text-secondary-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Autres prestations
              </h4>
              <div className="overflow-hidden rounded-md border border-secondary-200">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
                      <th className="px-4 py-3 text-left text-sm font-medium text-secondary-700">Description</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-secondary-700">Prix HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.postes.map((item: any, index: number) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'} hover:bg-secondary-100`}>
                        <td className="px-4 py-3 text-sm font-medium text-secondary-600">{item.nom}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-secondary-900">{formatCurrency(item.prix)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Résumé des totaux */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-4 mt-8">
          {/* Partie gauche - Conditions et mentions légales */}
          <div className="border rounded-md p-5 bg-secondary-50 max-w-md space-y-2 w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-secondary-600 border-b pb-2">Conditions de règlement</h3>
            <div className="text-sm text-secondary-600 space-y-2">
              <p>Acompte de 30% à la signature, solde à la fin des travaux.</p>
              <p>Ce devis est valable 30 jours à compter de sa date d'émission.</p>
              <p>Les travaux seront réalisés selon les règles de l'art et conformément aux normes en vigueur.</p>
              <p className="text-xs text-secondary-500 pt-2">TVA non applicable, article 293B du Code Général des Impôts.</p>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-base font-medium mb-2">Bon pour accord</h3>
              <div className="flex md:flex-row flex-col gap-4">
                <div className="flex-1">
                  <p className="text-xs text-secondary-500 mb-1">Date et signature du client:</p>
                  <div className="h-16 border border-dashed border-secondary-300 rounded-md"></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-secondary-500 mb-1">Cachet de l'entreprise:</p>
                  <div className="h-16 border border-dashed border-secondary-300 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Partie droite - Totaux */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-md border border-primary/20 p-5 md:w-1/2 w-full">
            <h3 className="text-lg font-bold text-secondary-600 mb-4 pb-2 border-b border-primary/20">Récapitulatif</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Total matériaux:</span>
                <span className="font-medium">{formatCurrency(quote.materiaux?.reduce((sum: number, item: any) => sum + (item.quantité * item.prix_unitaire), 0) || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Total main d'œuvre:</span>
                <span className="font-medium">{formatCurrency(quote.main_oeuvre?.total || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Autres prestations:</span>
                <span className="font-medium">{formatCurrency(quote.postes?.reduce((sum: number, item: any) => sum + item.prix, 0) || 0)}</span>
              </div>
            </div>
            
            <div className="border-t border-primary/20 pt-3 pb-2">
              <div className="flex justify-between font-medium">
                <span>Total HT:</span>
                <span>{formatCurrency(quote.total_ht)}</span>
              </div>
              <div className="flex justify-between text-sm my-1">
                <span className="text-secondary-600">TVA (20%):</span>
                <span>{formatCurrency(quote.tva)}</span>
              </div>
            </div>
            
            <div className="bg-primary/20 rounded-md p-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL TTC:</span>
                <span>{formatCurrency(quote.total_ttc)}</span>
              </div>
            </div>
            
            {/* Conditions de paiement */}
            <div className="mt-6 pt-4 border-t border-primary/20">
              <h4 className="text-sm font-semibold text-secondary-600 mb-2">Échéancier de paiement</h4>
              <div className="flex justify-between text-sm">
                <span>Acompte (30%):</span>
                <span className="font-medium">{formatCurrency(quote.total_ttc * 0.3)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Solde à régler:</span>
                <span className="font-medium">{formatCurrency(quote.total_ttc * 0.7)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotePreview;
