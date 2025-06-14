"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  ArrowUpDown,
  Copy
} from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Types pour les plans d'abonnement
interface SubscriptionPlanFeature {
  title: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: "MONTHLY" | "YEARLY";
  features: SubscriptionPlanFeature[];
  isActive: boolean;
  maxQuotes: number;
  maxClients: number;
  createdAt: string;
  updatedAt: string;
  activeSubscriptionsCount?: number;
}

interface SubscriptionStats {
  totalPlans: number;
  activePlans: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  monthlyRevenue: number;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingPlan, setDeletingPlan] = useState<string | null>(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<keyof SubscriptionPlan>("price");

  // Charger les plans d'abonnement
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/admin/subscriptions");
        if (!res.ok) throw new Error("Erreur lors de la récupération des plans");
        
        const data = await res.json();
        setPlans(data);
        
        // Charger les statistiques
        const statsRes = await fetch("/api/admin/subscriptions", {
          method: "PATCH"
        });
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Impossible de charger les plans d'abonnement");
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  // Fonction pour trier les plans
  const sortPlans = (field: keyof SubscriptionPlan) => {
    if (sortField === field) {
      // Inverser l'ordre si on clique sur le même champ
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Nouveau champ, commencer par ordre ascendant
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Appliquer le tri
  const sortedPlans = [...plans].sort((a, b) => {
    if (sortField === "price") {
      return sortOrder === "asc" 
        ? a[sortField] - b[sortField] 
        : b[sortField] - a[sortField];
    }
    
    // Pour les champs de type string
    if (typeof a[sortField] === "string") {
      const aValue = String(a[sortField]).toLowerCase();
      const bValue = String(b[sortField]).toLowerCase();
      return sortOrder === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Pour les autres types
    return 0;
  });

  // Fonction pour changer le statut actif/inactif
  const togglePlanStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      if (!res.ok) throw new Error("Erreur lors de la mise à jour du statut");
      
      const updatedPlan = await res.json();
      
      // Mettre à jour la liste des plans
      setPlans(plans.map(plan => 
        plan.id === id ? {...plan, isActive: !currentStatus} : plan
      ));
      
      toast.success(`Le plan ${updatedPlan.name} est maintenant ${!currentStatus ? "actif" : "inactif"}`);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de mettre à jour le statut du plan");
    }
  };

  // Fonction pour supprimer un plan
  const deletePlan = async () => {
    if (!deletingPlan) return;
    
    try {
      const res = await fetch(`/api/admin/subscriptions/${deletingPlan}`, {
        method: "DELETE"
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        
        // Si le plan a des abonnements actifs
        if (res.status === 400 && errorData.activeSubscriptions) {
          toast.error(`Impossible de supprimer: ${errorData.activeSubscriptions} abonnement(s) actif(s) utilisent ce plan`);
          setConfirmDeleteDialogOpen(false);
          setDeletingPlan(null);
          return;
        }
        
        throw new Error("Erreur lors de la suppression du plan");
      }
      
      // Mettre à jour la liste des plans
      setPlans(plans.filter(plan => plan.id !== deletingPlan));
      
      toast.success("Plan supprimé avec succès");
      setConfirmDeleteDialogOpen(false);
      setDeletingPlan(null);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de supprimer le plan");
    }
  };

  // Fonction pour dupliquer un plan
  const duplicatePlan = async (plan: SubscriptionPlan) => {
    try {
      // Créer une copie du plan sans l'ID
      const { id, createdAt, updatedAt, activeSubscriptionsCount, ...planData } = plan;
      
      // Modifier le nom pour indiquer qu'il s'agit d'une copie
      const newPlanData = {
        ...planData,
        name: `${planData.name} (copie)`,
        isActive: false // Désactiver par défaut la copie
      };
      
      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPlanData)
      });
      
      if (!res.ok) throw new Error("Erreur lors de la duplication du plan");
      
      const newPlan = await res.json();
      
      // Ajouter le nouveau plan à la liste
      setPlans([...plans, {...newPlan, features: planData.features}]);
      
      toast.success("Plan dupliqué avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de dupliquer le plan");
    }
  };

  // Conteneur des statistiques
  const StatsContainer = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Plans d'abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold">{stats?.totalPlans || 0}</div>
            <div className="text-sm text-muted-foreground">
              {stats?.activePlans || 0} <span>actifs</span>
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
            <div className="text-2xl font-bold">{stats?.activeSubscriptions || 0}</div>
            <div className="text-sm text-muted-foreground">
              {stats?.trialSubscriptions || 0} <span>en essai</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Revenu mensuel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats?.monthlyRevenue || 0)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Taux de conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.totalSubscriptions 
              ? Math.round((stats.activeSubscriptions / stats.totalSubscriptions) * 100) 
              : 0}%
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Abonnements</h1>
          <p className="text-muted-foreground">
            Gérez vos plans d'abonnement et leurs options
          </p>
        </div>
        <Button onClick={() => router.push("/admin/subscriptions/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau plan
        </Button>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <StatsContainer />
          
          <Card>
            <CardHeader>
              <CardTitle>Plans d'abonnement</CardTitle>
              <CardDescription>
                {plans.length} plans disponibles, {plans.filter(p => p.isActive).length} actifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => sortPlans("name")} className="cursor-pointer">
                      Nom <ArrowUpDown className="inline h-4 w-4" />
                    </TableHead>
                    <TableHead onClick={() => sortPlans("price")} className="cursor-pointer">
                      Prix <ArrowUpDown className="inline h-4 w-4" />
                    </TableHead>
                    <TableHead>Récurrence</TableHead>
                    <TableHead>Limites</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Utilisateurs</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPlans.length > 0 ? (
                    sortedPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>{formatCurrency(plan.price)}</TableCell>
                        <TableCell>
                          {plan.interval === "MONTHLY" ? "Mensuel" : "Annuel"}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            {plan.maxQuotes > 0 ? `${plan.maxQuotes} devis / mois` : "Illimité"}
                            <br />
                            {plan.maxClients > 0 ? `${plan.maxClients} clients` : "Illimité"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={plan.isActive} 
                            onCheckedChange={() => togglePlanStatus(plan.id, plan.isActive)}
                            aria-label="Activer/désactiver le plan" 
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant={plan.activeSubscriptionsCount ? "secondary" : "outline"}>
                            {plan.activeSubscriptionsCount || 0} actif(s)
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => duplicatePlan(plan)}
                              title="Dupliquer"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => router.push(`/admin/subscriptions/${plan.id}`)}
                              title="Éditer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                setDeletingPlan(plan.id);
                                setConfirmDeleteDialogOpen(true);
                              }}
                              disabled={!!plan.activeSubscriptionsCount}
                              title={plan.activeSubscriptionsCount ? "Ne peut pas être supprimé (utilisé)" : "Supprimer"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Aucun plan d'abonnement trouvé.
                        <br />
                        <Button variant="secondary" className="mt-4" onClick={() => router.push("/admin/subscriptions/new")}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Créer un plan
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Dialog de confirmation de suppression */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le plan d'abonnement</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce plan d'abonnement ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={deletePlan}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
