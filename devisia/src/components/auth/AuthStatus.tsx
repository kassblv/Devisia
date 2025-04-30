"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui";
import { useTheme } from "@/styles/theme/useTheme";

/**
 * Composant pour tester l'état de l'authentification
 * Affiche le statut de la session et les informations utilisateur
 */
export default function AuthStatus() {
  const { data: session, status } = useSession();
  const theme = useTheme();

  if (status === "loading") {
    return (
      <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
        <p className="text-primary-700">Chargement de la session...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-4 bg-error/10 rounded-lg border border-error/20">
        <p className="text-error mb-2">Non authentifié</p>
        <p className="text-gray-700 mb-4">Vous n'êtes pas connecté à l'application.</p>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => window.location.href = '/auth/login'}>
            Se connecter
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/auth/register'}>
            S'inscrire
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
      <p className="text-success font-semibold mb-2">Authentifié</p>
      <div className="bg-white p-3 rounded-md border border-gray-200 mb-3">
        <p className="text-gray-700 mb-1"><span className="font-semibold">ID:</span> {session?.user?.id}</p>
        <p className="text-gray-700 mb-1"><span className="font-semibold">Email:</span> {session?.user?.email}</p>
        <p className="text-gray-700"><span className="font-semibold">Nom:</span> {session?.user?.name || 'Non défini'}</p>
      </div>
      <Button 
        variant="outline" 
        onClick={() => window.location.href = '/api/auth/signout'}
      >
        Se déconnecter
      </Button>
    </div>
  );
}
