"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { IconArrowLeft } from "@tabler/icons-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  kbis: string | null;
  vatNumber: string | null;
  notes: string | null;
}

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [kbis, setKbis] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [notes, setNotes] = useState("");
  
  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/clients/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Client non trouvé");
            setTimeout(() => {
              router.push("/dashboard/clients");
            }, 1500);
            return;
          }
          throw new Error("Erreur lors de la récupération du client");
        }
        
        const data = await response.json();
        
        // Initialiser les états avec les données du client
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setCompany(data.company || "");
        setAddress(data.address || "");
        setKbis(data.kbis || "");
        setVatNumber(data.vatNumber || "");
        setNotes(data.notes || "");
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors de la récupération du client");
        setIsLoading(false);
      }
    };
    
    fetchClient();
  }, [params.id, router]);
  
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "L'email est invalide";
    }
    
    if (phone && !/^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone)) {
      newErrors.phone = "Le numéro de téléphone est invalide";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/clients/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          address,
          kbis,
          vatNumber,
          notes,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Une erreur est survenue lors de la mise à jour du client");
      }
      
      toast.success("Client mis à jour avec succès");
      
      // Redirection après un court délai pour permettre à l'utilisateur de voir le toast
      setTimeout(() => {
        router.push(`/dashboard/clients/${params.id}`);
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        
        <Card className="p-6">
          <Skeleton className="h-7 w-64 mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <Skeleton className="h-5 w-20 mb-2" />
          <Skeleton className="h-20 w-full mb-6" />
          
          <Skeleton className="h-10 w-32 ml-auto" />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <IconArrowLeft className="h-4 w-4 mr-1" />
        Retour
      </button>
      
      <h1 className="text-3xl font-bold text-indigo-900 mb-8">
        Modifier le client
        <div className="h-1 w-32 bg-gradient-to-r from-indigo-400 to-pink-500 mt-2 rounded-full"></div>
      </h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="name">Nom <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du client"
                className={errors.name ? "border-red-300" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                className={errors.email ? "border-red-300" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className={errors.phone ? "border-red-300" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nom de l'entreprise"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Adresse complète"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="kbis">Numéro KBIS</Label>
              <Input
                id="kbis"
                value={kbis}
                onChange={(e) => setKbis(e.target.value)}
                placeholder="123 456 789"
              />
            </div>
            <div>
              <Label htmlFor="vatNumber">Numéro de TVA</Label>
              <Input
                id="vatNumber"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="FR 12 345 678 901"
              />
            </div>
          </div>
          
          <div className="mb-8">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes supplémentaires sur ce client..."
              rows={5}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="mr-3"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
