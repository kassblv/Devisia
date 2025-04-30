"use client";

import AuthStatus from "@/components/auth/AuthStatus";
import { Card, CardHeader } from "@/components/ui";
import Link from "next/link";

export default function AuthTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="mb-4">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            ← Retour à l'accueil
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900">Test d'Authentification</h1>
            <p className="text-gray-600 mt-1">
              Cette page vous permet de tester si l'authentification fonctionne correctement.
            </p>
          </CardHeader>
          
          <div className="mt-4">
            <AuthStatus />
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Navigation rapide</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 border border-primary-200 bg-primary-50 hover:bg-primary-100 rounded-md p-3 block">
                Page de connexion
              </Link>
              <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 border border-primary-200 bg-primary-50 hover:bg-primary-100 rounded-md p-3 block">
                Page d'inscription
              </Link>
              <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 border border-primary-200 bg-primary-50 hover:bg-primary-100 rounded-md p-3 block">
                Tableau de bord (protégé)
              </Link>
              <Link href="/api/auth/signout" className="text-red-600 hover:text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 rounded-md p-3 block">
                Se déconnecter
              </Link>
            </div>
          </div>
        </Card>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">État du thème</h2>
            </CardHeader>
            
            <div className="mt-4">
              <p className="text-gray-700 mb-4">
                Cette section montre comment le système de thème est correctement appliqué à l'interface.
              </p>
              
              <h3 className="font-medium text-gray-900 mb-2">Couleurs primaires</h3>
              <div className="flex gap-2 mb-4 flex-wrap">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="text-center">
                    <div 
                      className={`w-12 h-12 rounded-md bg-primary-${shade}`}
                      title={`primary-${shade}`}
                    ></div>
                    <span className="text-xs">{shade}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2">Couleurs secondaires</h3>
              <div className="flex gap-2 mb-4 flex-wrap">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="text-center">
                    <div 
                      className={`w-12 h-12 rounded-md bg-secondary-${shade}`}
                      title={`secondary-${shade}`}
                    ></div>
                    <span className="text-xs">{shade}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2">Statuts des devis</h3>
              <div className="flex gap-3 flex-wrap">
                <div className="inline-flex px-2.5 py-1 bg-status-draft-bg text-status-draft-text rounded-full text-sm font-medium">
                  Brouillon
                </div>
                <div className="inline-flex px-2.5 py-1 bg-status-sent-bg text-status-sent-text rounded-full text-sm font-medium">
                  Envoyé
                </div>
                <div className="inline-flex px-2.5 py-1 bg-status-approved-bg text-status-approved-text rounded-full text-sm font-medium">
                  Approuvé
                </div>
                <div className="inline-flex px-2.5 py-1 bg-status-rejected-bg text-status-rejected-text rounded-full text-sm font-medium">
                  Refusé
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
