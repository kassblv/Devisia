"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserInfo } from "./components/UserInfo";
import { UserStats } from "./components/UserStats";
import { UserQuotes } from "./components/UserQuotes";
import { UserClients } from "./components/UserClients";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

// Définition de l'interface pour les données utilisateur
interface UserDetail {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalQuotes: number;
    totalClients: number;
    totalQuoteAmount: number;
    averageQuoteAmount: number;
  };
  subscription: {
    status: string;
    plan: string;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    price: number;
    nextBillingDate: string | null;
    paymentMethod: string | null;
  };
  quotes: Array<{
    id: string;
    quoteNumber: string;
    totalAmount: number;
    status: string;
    expiryDate: string | null;
    createdAt: string;
    projet: string | null;
    clientId: string | null;
    client: {
      name: string | null;
      email: string | null;
      company: string | null;
    } | null;
  }>;
  clients: Array<{
    id: string;
    name: string | null;
    email: string | null;
    company: string | null;
    createdAt: string;
    _count: {
      quotes: number;
    };
  }>;
}

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirection si l'utilisateur n'est pas authentifié
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    // Récupération des détails de l'utilisateur
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/admin/users/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des détails de l'utilisateur");
        }
        
        const data = await response.json();
        setUser(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors du chargement des détails de l'utilisateur");
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, router, status]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 space-y-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Utilisateur non trouvé</h2>
          <p className="text-gray-500 mt-2">
            Cet utilisateur n'existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Détails utilisateur</h1>
        <Button variant="ghost" onClick={() => router.back()} size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
      </div>
      
      <UserInfo user={user} />
      
      <UserStats stats={user.stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserQuotes quotes={user.quotes} />
        <UserClients clients={user.clients} />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <Button variant="ghost" disabled className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 border rounded-md">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border rounded-md p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
