"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Types pour les statistiques
interface AdminStats {
  totalUsers: number;
  newUsersLastMonth: number;
  activeSubscriptions: number;
  trialUsers: number;
  totalQuotes: number;
  quotesThisMonth: number;
  revenueTotal: number;
  revenueMRR: number;
}

// Types pour les utilisateurs récents
interface RecentUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  quotesCount: number;
  subscriptionStatus?: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  useEffect(() => {
    // Redirection si l'utilisateur n'est pas administrateur
    // À implémenter: vérification du rôle administrateur
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }

    // Chargement des statistiques du tableau de bord
    const fetchDashboardData = async () => {
      try {
        // Récupération des statistiques depuis l'API
        const statsResponse = await fetch("/api/admin/stats");
        if (!statsResponse.ok) {
          throw new Error("Erreur lors de la récupération des statistiques");
        }
        const statsData = await statsResponse.json();
        setStats(statsData);
        
        // Récupération des utilisateurs récents
        const usersResponse = await fetch("/api/admin/users?page=1&limit=4");
        if (!usersResponse.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs récents");
        }
        const usersData = await usersResponse.json();
        
        // Transformer les données des utilisateurs au format attendu
        const recentUsersData = usersData.users.map((user: any) => ({
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          createdAt: user.createdAt,
          quotesCount: user.quotesCount,
          subscriptionStatus: user.subscription?.plan
        }));
        setRecentUsers(recentUsersData);

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [status, router]);

  // Affichage d'un écran de chargement
  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-8">Tableau de bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Formatage des valeurs monétaires
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  // Formatage des dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/users">
              Gérer les utilisateurs
            </Link>
          </Button>
          <Button variant="outline">
            Exporter les données
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{stats?.totalUsers}</div>
              <div className="text-sm text-green-600">
                +{stats?.newUsersLastMonth} <span className="text-muted-foreground">ce mois</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Abonnements actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{stats?.activeSubscriptions}</div>
              <div className="text-sm text-muted-foreground">
                {stats?.trialUsers} <span className="text-muted-foreground">en essai</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Devis générés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{stats?.totalQuotes}</div>
              <div className="text-sm text-green-600">
                +{stats?.quotesThisMonth} <span className="text-muted-foreground">ce mois</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenu mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{formatCurrency(stats?.revenueMRR || 0)}</div>
              <div className="text-sm text-muted-foreground">
                Total: {formatCurrency(stats?.revenueTotal || 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Utilisateurs récents</CardTitle>
              <CardDescription>
                Les {recentUsers.length} derniers utilisateurs inscrits sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2 font-medium">Utilisateur</th>
                      <th className="pb-2 font-medium">Inscription</th>
                      <th className="pb-2 font-medium">Devis</th>
                      <th className="pb-2 font-medium">Abonnement</th>
                      <th className="pb-2 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-muted-foreground text-xs">{user.email}</div>
                        </td>
                        <td className="py-3">{formatDate(user.createdAt)}</td>
                        <td className="py-3">{user.quotesCount}</td>
                        <td className="py-3">
                          <Badge variant={
                            user.subscriptionStatus === 'premium' ? 'default' :
                            user.subscriptionStatus === 'standard' ? 'secondary' : 'outline'
                          }>
                            {user.subscriptionStatus || 'Aucun'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/users/${user.id}`}>Détails</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" asChild>
                  <Link href="/admin/users">
                    Voir tous les utilisateurs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Aperçu des abonnements</CardTitle>
              <CardDescription>
                Distribution des abonnements actifs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div>Premium</div>
                  <div className="font-medium">34</div>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div>Standard</div>
                  <div className="font-medium">42</div>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '55%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div>Essai</div>
                  <div className="font-medium">32</div>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-muted-foreground/60 h-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/subscriptions">
                    Gérer les abonnements
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
