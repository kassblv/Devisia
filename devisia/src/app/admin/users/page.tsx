"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Types pour l'interface
interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  createdAt: string;
  quotesCount: number;
  subscription: {
    status: string;
    plan: string;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
  };
}

export default function UsersAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubscription, setFilterSubscription] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    // Redirection si l'utilisateur n'est pas administrateur
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }

    // Chargement des utilisateurs
    const fetchUsers = async () => {
      try {
        // Construction de l'URL avec les paramètres de pagination et filtres
        const searchParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: usersPerPage.toString()
        });
        
        if (searchQuery) {
          searchParams.append('search', searchQuery);
        }
        
        if (filterSubscription !== 'all') {
          searchParams.append('subscription', filterSubscription);
        }
        
        // Appel à l'API
        const response = await fetch(`/api/admin/users?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des utilisateurs");
        }
        
        const data = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
        toast.error("Erreur lors du chargement des utilisateurs");
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [status, router]);

  // Filtrage des utilisateurs en fonction de la recherche et du filtre d'abonnement
  useEffect(() => {
    let result = [...users];

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.email.toLowerCase().includes(query) || 
        `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(query) ||
        (user.companyName && user.companyName.toLowerCase().includes(query))
      );
    }

    // Filtre par type d'abonnement
    if (filterSubscription !== "all") {
      result = result.filter(user => {
        if (filterSubscription === "active") {
          return user.subscription.isActive;
        }
        if (filterSubscription === "trial") {
          return user.subscription.plan === "trial";
        }
        if (filterSubscription === "expired") {
          return !user.subscription.isActive;
        }
        return user.subscription.plan === filterSubscription;
      });
    }

    setFilteredUsers(result);
    setTotalPages(Math.ceil(result.length / usersPerPage));
    setCurrentPage(1); // Réinitialiser à la première page après un filtrage
  }, [users, searchQuery, filterSubscription]);

  // Pagination des utilisateurs
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
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

  // Gestion des actions sur les utilisateurs
  const handleUserAction = (action: string, userId: string) => {
    switch(action) {
      case "view":
        router.push(`/admin/users/${userId}`);
        break;
      case "edit-subscription":
        router.push(`/admin/users/${userId}/subscription`);
        break;
      case "disable":
        toast.success(`L'utilisateur a été désactivé`);
        break;
      case "enable":
        toast.success(`L'utilisateur a été activé`);
        break;
      default:
        break;
    }
  };

  // Affichage d'un écran de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-6">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-36" />
            </div>
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        <Button asChild>
          <Link href="/admin">
            Retour au tableau de bord
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="w-full md:w-1/2">
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/3">
              <Select
                value={filterSubscription}
                onValueChange={setFilterSubscription}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par abonnement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les abonnements</SelectItem>
                  <SelectItem value="active">Abonnements actifs</SelectItem>
                  <SelectItem value="trial">Essais</SelectItem>
                  <SelectItem value="expired">Expirés/Annulés</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Abonnement</TableHead>
                  <TableHead>Devis</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentPageUsers().map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-muted-foreground text-sm">{user.email}</div>
                        {user.companyName && (
                          <div className="text-muted-foreground text-xs">{user.companyName}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        user.subscription.isActive ? 
                          (user.subscription.plan === "premium" ? "default" : 
                           user.subscription.plan === "standard" ? "secondary" : 
                           "outline") : 
                          "destructive"
                      }>
                        {user.subscription.plan === "premium" ? "Premium" : 
                         user.subscription.plan === "standard" ? "Standard" :
                         user.subscription.plan === "trial" ? "Essai" : 
                         "Inactif"}
                      </Badge>
                      {user.subscription.endDate && (
                        <div className="text-muted-foreground text-xs mt-1">
                          Expire: {formatDate(user.subscription.endDate)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.quotesCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction("view", user.id)}>
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction("edit-subscription", user.id)}>
                            Gérer l'abonnement
                          </DropdownMenuItem>
                          {user.subscription.isActive ? (
                            <DropdownMenuItem onClick={() => handleUserAction("disable", user.id)}>
                              Désactiver le compte
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUserAction("enable", user.id)}>
                              Activer le compte
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {getCurrentPageUsers().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Précédent
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
