"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileDown, Download } from "lucide-react";

interface QuoteFormData {
  // Informations générales
  id?: string;
  quoteNumber?: string;
  projet: string;
  description: string;
  status: string;
  expiryDate: string;
  clientId: string;
  clientName?: string;
  clientEmail?: string;
  
  // Matériaux
  materiaux: {
    id?: string;
    nom: string;
    description?: string;
    quantité: number;
    unité: string;
    prix_unitaire: number;
  }[];
  
  // Main d'œuvre
  main_oeuvre: {
    heures_estimees: number;
    taux_horaire: number;
    total: number; // Calculé automatiquement
  };
  
  // Services et prestations
  postes: {
    id?: string;
    nom: string;
    description?: string;
    prix: number;
  }[];
  
  // Totaux (calculés automatiquement)
  total_ht: number;
  tva: number;
  total_ttc: number;
}

export default function EditQuote({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // Définir un état unique pour toutes les données du devis
  const [quoteFormData, setQuoteFormData] = useState<QuoteFormData>({
    projet: "",
    description: "",
    status: "DRAFT",
    expiryDate: "",
    clientId: "",
    clientName: "",
    clientEmail: "",
    materiaux: [],
    main_oeuvre: {
      heures_estimees: 0,
      taux_horaire: 0,
      total: 0
    },
    postes: [],
    total_ht: 0,
    tva: 0,
    total_ttc: 0
  });

  // Calcul automatique des totaux
  useEffect(() => {
    const calculateTotals = () => {
      // Calcul du total des matériaux
      const materiauxTotal = quoteFormData.materiaux.reduce((sum, item) => {
        return sum + (item.quantité * item.prix_unitaire);
      }, 0);
      
      // Calcul du total de la main d'œuvre
      const mainOeuvreTotal = quoteFormData.main_oeuvre.heures_estimees * quoteFormData.main_oeuvre.taux_horaire;
      
      // Mise à jour du total de la main d'oeuvre
      setQuoteFormData(prev => ({
        ...prev,
        main_oeuvre: {
          ...prev.main_oeuvre,
          total: mainOeuvreTotal
        }
      }));
      
      // Calcul du total des postes
      const postesTotal = quoteFormData.postes.reduce((sum, item) => {
        return sum + item.prix;
      }, 0);
      
      // Calcul du total HT
      const totalHT = materiauxTotal + mainOeuvreTotal + postesTotal;
      
      // Calcul de la TVA (20% par défaut)
      const tva = totalHT * 0.2;
      
      // Calcul du total TTC
      const totalTTC = totalHT + tva;
      
      // Mise à jour des totaux
      setQuoteFormData(prev => ({
        ...prev,
        total_ht: totalHT,
        tva: tva,
        total_ttc: totalTTC
      }));
    };
    
    calculateTotals();
  }, [
    quoteFormData.materiaux, 
    quoteFormData.main_oeuvre.heures_estimees, 
    quoteFormData.main_oeuvre.taux_horaire, 
    quoteFormData.postes
  ]);
  
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/quotes/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du devis");
        }
        
        const data = await response.json();
        console.log("Données reçues de l'API:", data);
        
        // Formatage des données pour correspondre à notre structure
        const formattedData: Partial<QuoteFormData> = {
          id: data.id,
          quoteNumber: data.quoteNumber || "",
          projet: data.projet || "",
          description: data.description || data.notes || "",
          status: data.status || "DRAFT",
          expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split("T")[0] : "",
          clientId: data.clientId || (data.client?.id || ""),
          clientName: data.clientName || (data.client?.name || ""),
          clientEmail: data.clientEmail || (data.client?.email || ""),
          
          // Données de matériaux - utiliser directement les matériaux s'ils existent
          materiaux: Array.isArray(data.materiaux) && data.materiaux.length > 0
            ? data.materiaux.map((m: any) => ({
                id: m.id,
                nom: m.nom || "",
                description: m.description || "",
                quantité: typeof m.quantité === 'number' ? m.quantité : (typeof m.quantite === 'number' ? m.quantite : 1),
                unité: m.unité || m.unite || "unité",
                prix_unitaire: typeof m.prix_unitaire === 'number' ? m.prix_unitaire : 0
              }))
            : (Array.isArray(data.items) 
                ? data.items.filter((item: any) => item.type === 'MATERIAL' || !item.type)
                    .map((item: any) => ({
                      id: item.id,
                      nom: item.description || "",
                      description: "",
                      quantité: item.quantity || 1,
                      unité: item.unit || "unité",
                      prix_unitaire: parseFloat(item.unitPrice) || 0
                    }))
                : []),
          
          // Données de main d'œuvre - utiliser directement les données de main d'œuvre si elles existent
          main_oeuvre: data.main_oeuvre && typeof data.main_oeuvre === 'object'
            ? {
                heures_estimees: typeof data.main_oeuvre.heures_estimees === 'number' ? data.main_oeuvre.heures_estimees : 0,
                taux_horaire: typeof data.main_oeuvre.taux_horaire === 'number' ? data.main_oeuvre.taux_horaire : 0,
                total: typeof data.main_oeuvre.total === 'number' ? data.main_oeuvre.total : 0
              }
            : {
                heures_estimees: 0,
                taux_horaire: 0,
                total: 0
              },
          
          // Données de postes/services - utiliser directement les postes s'ils existent
          postes: Array.isArray(data.postes) && data.postes.length > 0
            ? data.postes.map((p: any) => ({
                id: p.id,
                nom: p.nom || "",
                description: p.description || "", 
                prix: typeof p.prix === 'number' ? p.prix : 0
              }))
            : (Array.isArray(data.items) 
                ? data.items.filter((item: any) => item.type === 'SERVICE' || !item.type)
                    .map((item: any) => ({
                      id: item.id,
                      nom: item.description || "",
                      description: item.details || "",
                      prix: parseFloat(item.unitPrice) * (item.quantity || 1)
                    }))
                : []),
          
          // Totaux - utiliser les valeurs de l'API directement
          total_ht: typeof data.total_ht === 'number' ? data.total_ht : 
                   (typeof data.totalAmount === 'number' ? data.totalAmount : 0),
          tva: typeof data.tva === 'number' ? data.tva : 
               (typeof data.totalAmount === 'number' ? data.totalAmount * 0.2 : 0),
          total_ttc: typeof data.total_ttc === 'number' ? data.total_ttc : 
                    (typeof data.totalAmount === 'number' ? data.totalAmount * 1.2 : 0),
        };
        
        console.log("Données formatées pour le formulaire:", formattedData);
        
        // Également récupérer les données client si l'ID client est présent
        if (formattedData.clientId) {
          try {
            const clientResponse = await fetch(`/api/clients/${formattedData.clientId}`);
            if (clientResponse.ok) {
              const clientData = await clientResponse.json();
              formattedData.clientName = clientData.name;
              formattedData.clientEmail = clientData.email;
              console.log("Données client récupérées:", clientData);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des données client:", error);
          }
        }
        
        // Mettre à jour les données du formulaire
        setQuoteFormData(prev => ({
          ...prev,
          ...formattedData
        }));
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Impossible de charger le devis");
        setIsLoading(false);
      }
    };
    
    fetchQuote();
  }, [params.id]);
  
  // Fonctions pour gérer les matériaux
  const addMaterial = () => {
    setQuoteFormData(prev => ({
      ...prev,
      materiaux: [...prev.materiaux, { 
        nom: "", 
        description: "",
        quantité: 1, 
        unité: "unité", 
        prix_unitaire: 0 
      }]
    }));
    
    // Faire défiler la page vers le bas après ajout
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const updateMaterial = (index: number, field: string, value: any) => {
    const updatedMaterials = [...quoteFormData.materiaux];
    
    // Conversion des valeurs numériques
    if (field === 'quantité' || field === 'prix_unitaire') {
      value = parseFloat(value) || 0;
    }
    
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    
    setQuoteFormData(prev => ({
      ...prev,
      materiaux: updatedMaterials
    }));
  };

  const removeMaterial = (index: number) => {
    setQuoteFormData(prev => ({
      ...prev,
      materiaux: prev.materiaux.filter((_, i) => i !== index)
    }));
  };

  // Fonctions pour gérer les postes/services
  const addPoste = () => {
    setQuoteFormData(prev => ({
      ...prev,
      postes: [...prev.postes, { 
        nom: "", 
        description: "",
        prix: 0 
      }]
    }));
    
    // Faire défiler la page vers le bas après ajout
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const updatePoste = (index: number, field: string, value: any) => {
    const updatedPostes = [...quoteFormData.postes];
    
    // Conversion des valeurs numériques
    if (field === 'prix') {
      value = parseFloat(value) || 0;
    }
    
    updatedPostes[index] = { ...updatedPostes[index], [field]: value };
    
    setQuoteFormData(prev => ({
      ...prev,
      postes: updatedPostes
    }));
  };

  const removePoste = (index: number) => {
    setQuoteFormData(prev => ({
      ...prev,
      postes: prev.postes.filter((_, i) => i !== index)
    }));
  };

  // Mise à jour de la main d'œuvre
  const updateMainOeuvre = (field: string, value: any) => {
    // Conversion des valeurs numériques
    const numValue = parseFloat(value) || 0;
    
    // Calculer automatiquement le total de la main d'oeuvre
    let heures = quoteFormData.main_oeuvre.heures_estimees;
    let taux = quoteFormData.main_oeuvre.taux_horaire;
    
    if (field === 'heures_estimees') {
      heures = numValue;
    } else if (field === 'taux_horaire') {
      taux = numValue;
    }
    
    const total = heures * taux;
    
    setQuoteFormData(prev => ({
      ...prev,
      main_oeuvre: {
        ...prev.main_oeuvre,
        [field]: numValue,
        total: total
      }
    }));
  };
  
  // Fonction générique pour mettre à jour les champs du formulaire
  const handleInputChange = (field: string, value: any) => {
    setQuoteFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quoteFormData.projet || !quoteFormData.clientId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/quotes/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quoteFormData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du devis");
      }
      
      toast.success("Devis mis à jour avec succès");
      router.push("/dashboard/quotes");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour du devis");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction pour exporter le devis en PDF
  const handleExportPDF = async () => {
    try {
      setIsPdfGenerating(true);
      const response = await fetch(`/api/quotes/${params.id}/export-pdf`);
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'exportation du devis en PDF");
      }
      
      // Récupérer le blob du PDF
      const pdfBlob = await response.blob();
      
      // Créer une URL pour le blob
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Créer un lien de téléchargement et cliquer dessus
      const a = document.createElement('a');
      a.href = url;
      a.download = `devis-${quoteFormData.quoteNumber || params.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("PDF exporté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'exportation du PDF:", error);
      toast.error("Échec de l'exportation du PDF");
    } finally {
      setIsPdfGenerating(false);
    }
  };
  
  // Fonction pour régénérer le devis avec l'IA
  const handleRegenerateWithAI = async () => {
    try {
      setIsSubmitting(true);
      
      // Récupérer d'abord le client complet si on a l'ID
      let clientData = null;
      if (quoteFormData.clientId) {
        const clientResponse = await fetch(`/api/clients/${quoteFormData.clientId}`);
        if (clientResponse.ok) {
          clientData = await clientResponse.json();
        }
      }
      
      // Préparer les données pour l'IA
      const aiData = {
        client: clientData || {
          name: quoteFormData.clientName || "",
          email: quoteFormData.clientEmail || "",
        },
        description: quoteFormData.description,
        projet: quoteFormData.projet,
        // Ajouter d'autres données pertinentes si nécessaire
      };
      
      // Appeler l'API de génération de devis avec l'IA
      const response = await fetch("/api/devis/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aiData),
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la génération du devis avec l'IA");
      }
      
      const result = await response.json();
      
      // Mettre à jour le devis existant avec les données générées par l'IA
      if (result) {
        // Fusionner les données existantes du devis avec celles générées par l'IA
        const updatedQuoteData = {
          ...quoteFormData,
          // Ne pas écraser l'ID ou le numéro de devis existant
          materiaux: result.materiaux || quoteFormData.materiaux,
          postes: result.postes || quoteFormData.postes,
          main_oeuvre: result.main_oeuvre || quoteFormData.main_oeuvre,
          // Mettre à jour uniquement la description si elle était vide ou si l'utilisateur le souhaite
          description: quoteFormData.description || result.description || "",
        };
        
        // Mettre à jour l'état du formulaire
        setQuoteFormData(updatedQuoteData);
        
        toast.success("Devis régénéré avec succès par l'IA");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Échec de la génération avec l'IA");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p>Chargement du devis...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Modifier le Devis #{quoteFormData.quoteNumber}</h1>
        <Button
          onClick={() => router.back()}
          variant="outline"
        >
          Retour
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="materiaux">Matériaux</TabsTrigger>
            <TabsTrigger value="main-oeuvre">Main d'Œuvre</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          
          {/* Onglet Général */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>Informations de base du devis et du client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projet">Titre du projet *</Label>
                    <Input 
                      id="projet"
                      value={quoteFormData.projet}
                      onChange={(e) => handleInputChange('projet', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select 
                      value={quoteFormData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Statut du devis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="SENT">Envoyé</SelectItem>
                        <SelectItem value="APPROVED">Approuvé</SelectItem>
                        <SelectItem value="REJECTED">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nom du client</Label>
                    <Input 
                      id="clientName"
                      value={quoteFormData.clientName || ""}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email du client</Label>
                    <Input 
                      id="clientEmail"
                      type="email"
                      value={quoteFormData.clientEmail || ""}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Date d'expiration</Label>
                    <Input 
                      id="expiryDate"
                      type="date"
                      value={quoteFormData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description du projet</Label>
                  <Textarea 
                    id="description"
                    value={quoteFormData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Matériaux */}
          <TabsContent value="materiaux">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Matériaux et Équipements</CardTitle>
                  <Button type="button" onClick={addMaterial} variant="outline" size="sm">
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quoteFormData.materiaux.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Aucun matériau. Cliquez sur "Ajouter" pour commencer.
                  </div>
                ) : (
                  <div className="space-y-3 relative">
                    <Button
                      type="button"
                      onClick={addMaterial}
                      className="absolute -top-12 right-0"
                      size="sm"
                    >
                      + Ajouter un matériau
                    </Button>
                    {quoteFormData.materiaux.map((material, index) => (
                      <div key={index} className="bg-secondary-50 p-4 rounded-md shadow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <Label htmlFor={`material-name-${index}`}>Nom du matériau</Label>
                            <Input 
                              id={`material-name-${index}`}
                              value={material.nom} 
                              onChange={(e) => updateMaterial(index, 'nom', e.target.value)}
                              placeholder="Ex: Carrelage 60x60"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label htmlFor={`material-quantity-${index}`}>Quantité</Label>
                              <Input 
                                id={`material-quantity-${index}`}
                                type="number"
                                value={material.quantité} 
                                onChange={(e) => updateMaterial(index, 'quantité', e.target.value)}
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`material-unit-${index}`}>Unité</Label>
                              <Select 
                                value={material.unité}
                                onValueChange={(value) => updateMaterial(index, 'unité', value)}
                              >
                                <SelectTrigger id={`material-unit-${index}`}>
                                  <SelectValue placeholder="Unité" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unité">Unité</SelectItem>
                                  <SelectItem value="m²">m²</SelectItem>
                                  <SelectItem value="m">m</SelectItem>
                                  <SelectItem value="kg">kg</SelectItem>
                                  <SelectItem value="l">l</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor={`material-price-${index}`}>Prix unitaire</Label>
                              <Input 
                                id={`material-price-${index}`}
                                type="number"
                                value={material.prix_unitaire} 
                                onChange={(e) => updateMaterial(index, 'prix_unitaire', e.target.value)}
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <Label htmlFor={`material-description-${index}`}>Description (optionnelle)</Label>
                            <Textarea 
                              id={`material-description-${index}`}
                              value={material.description || ""} 
                              onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                              placeholder="Détails du matériau..."
                              rows={2}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Total: {formatCurrency(material.quantité * material.prix_unitaire)}
                          </div>
                          <Button 
                            type="button" 
                            onClick={() => removeMaterial(index)} 
                            variant="destructive" 
                            size="sm"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Main d'œuvre */}
          <TabsContent value="main-oeuvre">
            <Card>
              <CardHeader>
                <CardTitle>Main d'œuvre</CardTitle>
                <CardDescription>Estimation des heures de travail et du taux horaire</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary-50 p-4 rounded-md shadow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="labor-hours">Heures estimées</Label>
                      <Input 
                        id="labor-hours"
                        type="number"
                        value={quoteFormData.main_oeuvre.heures_estimees} 
                        onChange={(e) => updateMainOeuvre('heures_estimees', e.target.value)}
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="labor-rate">Taux horaire (€/h)</Label>
                      <Input 
                        id="labor-rate"
                        type="number"
                        value={quoteFormData.main_oeuvre.taux_horaire} 
                        onChange={(e) => updateMainOeuvre('taux_horaire', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="text-right mt-3 font-medium">
                    Total main d'œuvre: {formatCurrency(quoteFormData.main_oeuvre.total)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Services */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Services et prestations</CardTitle>
                  <Button type="button" onClick={addPoste} variant="outline" size="sm">
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quoteFormData.postes.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Aucun service. Cliquez sur "Ajouter" pour commencer.
                  </div>
                ) : (
                  <div className="space-y-3 relative">
                    <Button
                      type="button"
                      onClick={addPoste}
                      className="absolute -top-12 right-0"
                      size="sm"
                    >
                      + Ajouter un service
                    </Button>
                    {quoteFormData.postes.map((poste, index) => (
                      <div key={index} className="bg-secondary-50 p-4 rounded-md shadow mb-3">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                          <div className="md:col-span-3">
                            <Label htmlFor={`service-name-${index}`}>Nom du service</Label>
                            <Input 
                              id={`service-name-${index}`}
                              value={poste.nom} 
                              onChange={(e) => updatePoste(index, 'nom', e.target.value)}
                              placeholder="Ex: Installation électrique"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`service-price-${index}`}>Prix (€)</Label>
                            <Input 
                              id={`service-price-${index}`}
                              type="number"
                              value={poste.prix} 
                              onChange={(e) => updatePoste(index, 'prix', e.target.value)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`service-description-${index}`}>Description (optionnelle)</Label>
                          <Textarea 
                            id={`service-description-${index}`}
                            value={poste.description || ""} 
                            onChange={(e) => updatePoste(index, 'description', e.target.value)}
                            placeholder="Détails de la prestation..."
                            rows={2}
                          />
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button 
                            type="button" 
                            onClick={() => removePoste(index)} 
                            variant="destructive" 
                            size="sm"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Récapitulatif des totaux */}
        <Card className="mt-6 bg-primary/10 border border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">Récapitulatif</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total matériaux:</span>
                <span>{formatCurrency(quoteFormData.materiaux.reduce((sum, item) => sum + (item.quantité * item.prix_unitaire), 0))}</span>
              </div>
              <div className="flex justify-between">
                <span>Total main d'œuvre:</span>
                <span>{formatCurrency(quoteFormData.main_oeuvre.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total services:</span>
                <span>{formatCurrency(quoteFormData.postes.reduce((sum, item) => sum + item.prix, 0))}</span>
              </div>
              <div className="border-t border-secondary-200 pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total HT:</span>
                  <span>{formatCurrency(quoteFormData.total_ht)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (20%):</span>
                  <span>{formatCurrency(quoteFormData.tva)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total TTC:</span>
                  <span>{formatCurrency(quoteFormData.total_ttc)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t">
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/quotes")}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              
              <Button
                variant="outline"
                onClick={handleRegenerateWithAI}
                disabled={isSubmitting || isPdfGenerating}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  "Régénérer avec l'IA"
                )}
              </Button>
            </div>
            
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={isSubmitting || isPdfGenerating}
              >
                {isPdfGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    Exporter PDF
                  </>
                )}
              </Button>
              
              <Button 
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || isPdfGenerating}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}