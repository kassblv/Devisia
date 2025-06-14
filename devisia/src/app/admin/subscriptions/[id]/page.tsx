"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Types
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
  createdAt?: string;
  updatedAt?: string;
  activeSubscriptionsCount?: number;
}

interface Subscription {
  id: string;
  status: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export default function SubscriptionPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
  
  // État du formulaire
  const [planData, setPlanData] = useState<Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
    price: 0,
    interval: "MONTHLY",
    features: [
      { title: "Devis illimités", included: false },
      { title: "Clients illimités", included: false },
      { title: "Support prioritaire", included: false },
      { title: "Exports PDF personnalisés", included: false },
      { title: "Signature électronique", included: false },
    ],
    isActive: true,
    maxQuotes: 0,
    maxClients: 0,
  });

  // Charger les données du plan si non-nouveau
  useEffect(() => {
    if (isNew) return;

    const fetchPlanData = async () => {
      try {
        const res = await fetch(`/api/admin/subscriptions/${params.id}`);
        if (!res.ok) throw new Error("Erreur lors de la récupération du plan");
        
        const data = await res.json();
        
        // Mettre à jour l'état avec les données du plan
        setPlanData({
          name: data.name,
          description: data.description || "",
          price: data.price,
          interval: data.interval,
          features: data.features,
          isActive: data.isActive,
          maxQuotes: data.maxQuotes,
          maxClients: data.maxClients,
        });
        
        if (data.subscriptions) {
          setActiveSubscriptions(data.subscriptions);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Impossible de charger les détails du plan");
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [isNew, params.id]);

  // Gérer les modifications des champs
  const handleChange = (field: keyof typeof planData, value: any) => {
    setPlanData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Gérer les modifications des attributs numériques
  const handleNumberChange = (field: keyof typeof planData, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setPlanData((prev) => ({
        ...prev,
        [field]: numValue,
      }));
    }
  };

  // Gérer la modification des fonctionnalités
  const handleFeatureChange = (index: number, field: keyof SubscriptionPlanFeature, value: any) => {
    setPlanData((prev) => {
      const newFeatures = [...prev.features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return { ...prev, features: newFeatures };
    });
  };

  // Ajouter une nouvelle fonctionnalité
  const addFeature = () => {
    setPlanData((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", included: true }],
    }));
  };

  // Supprimer une fonctionnalité
  const removeFeature = (index: number) => {
    setPlanData((prev) => {
      const newFeatures = [...prev.features];
      newFeatures.splice(index, 1);
      return { ...prev, features: newFeatures };
    });
  };

  // Enregistrer le plan
  const savePlan = async () => {
    if (!planData.name || planData.price === undefined) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }
    
    // Valider les fonctionnalités
    const validFeatures = planData.features.filter(f => f.title.trim() !== "");
    
    // Si des fonctionnalités sont vides, les supprimer
    if (validFeatures.length !== planData.features.length) {
      setPlanData((prev) => ({
        ...prev,
        features: validFeatures,
      }));
    }

    setSaving(true);

    try {
      const url = isNew 
        ? "/api/admin/subscriptions" 
        : `/api/admin/subscriptions/${params.id}`;
      
      const method = isNew ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(planData)
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement du plan");
      
      const savedPlan = await res.json();
      
      toast.success(`Plan ${isNew ? 'créé' : 'mis à jour'} avec succès`);
      
      // Redirection vers la liste des plans après création
      if (isNew) {
        router.push("/admin/subscriptions");
      } else {
        // Rester sur la page d'édition
        setSaving(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(`Impossible de ${isNew ? 'créer' : 'mettre à jour'} le plan`);
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="mr-4" onClick={() => router.push("/admin/subscriptions")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isNew ? "Nouveau plan d'abonnement" : "Modifier un plan d'abonnement"}
            </h1>
            <p className="text-muted-foreground">
              {isNew
                ? "Créez un nouveau plan d'abonnement pour vos utilisateurs"
                : "Modifiez les détails et les fonctionnalités de ce plan d'abonnement"}
            </p>
          </div>
        </div>
        <Button onClick={savePlan} disabled={saving || loading}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Définissez les informations de base du plan d'abonnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nom du plan*</Label>
                    <Input
                      id="name"
                      placeholder="Premium"
                      value={planData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-7">
                    <Switch
                      id="isActive"
                      checked={planData.isActive}
                      onCheckedChange={(checked) => handleChange("isActive", checked)}
                    />
                    <Label htmlFor="isActive">Plan actif</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Une description détaillée du plan d'abonnement..."
                    value={planData.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tarification</CardTitle>
              <CardDescription>
                Définissez le prix et la fréquence de facturation du plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="price">Prix (€)*</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="19.99"
                    value={planData.price}
                    onChange={(e) => handleNumberChange("price", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="interval">Récurrence</Label>
                  <Select
                    value={planData.interval}
                    onValueChange={(value: "MONTHLY" | "YEARLY") => handleChange("interval", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une récurrence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Mensuel</SelectItem>
                      <SelectItem value="YEARLY">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limites d'utilisation</CardTitle>
              <CardDescription>
                Définissez les restrictions d'utilisation pour ce plan (0 = illimité)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="maxQuotes">Nombre de devis par mois</Label>
                  <Input
                    id="maxQuotes"
                    type="number"
                    min="0"
                    placeholder="0 pour illimité"
                    value={planData.maxQuotes}
                    onChange={(e) => handleNumberChange("maxQuotes", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxClients">Nombre de clients</Label>
                  <Input
                    id="maxClients"
                    type="number"
                    min="0"
                    placeholder="0 pour illimité"
                    value={planData.maxClients}
                    onChange={(e) => handleNumberChange("maxClients", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Fonctionnalités</CardTitle>
                <CardDescription>
                  Définissez les fonctionnalités incluses dans ce plan d'abonnement
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addFeature}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Ex: Accès à toutes les fonctionnalités"
                        value={feature.title}
                        onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={feature.included}
                        onCheckedChange={(checked) => handleFeatureChange(index, "included", checked)}
                      />
                      <Label className={cn(feature.included ? "text-primary" : "text-muted-foreground")}>
                        {feature.included ? "Inclus" : "Non inclus"}
                      </Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}

                {planData.features.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucune fonctionnalité définie. Cliquez sur "Ajouter" pour en créer une.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {!isNew && activeSubscriptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs actifs</CardTitle>
                <CardDescription>
                  Utilisateurs ayant un abonnement actif à ce plan ({activeSubscriptions.length})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeSubscriptions.map((sub) => (
                    <div 
                      key={sub.id} 
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50"
                    >
                      <div>
                        <div className="font-medium">
                          {sub.user.firstName} {sub.user.lastName || ""}
                        </div>
                        <div className="text-sm text-muted-foreground">{sub.user.email}</div>
                      </div>
                      <div>
                        <Badge variant={sub.status === "TRIAL" ? "outline" : "secondary"}>
                          {sub.status === "TRIAL" ? "Essai" : "Actif"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
