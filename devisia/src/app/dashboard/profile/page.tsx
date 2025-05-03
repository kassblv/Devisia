"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  position: string | null;
  phone: string | null;
  createdAt: string;
  companyLogo?: string | null;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch("/api/user/profile");
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du profil");
        }
        
        const data = await response.json();
        setProfile(data);
        
        // Initialiser les états avec les données du profil
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setCompany(data.company || "");
        setPosition(data.position || "");
        setPhone(data.phone || "");
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [session]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          company,
          position,
          phone,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du profil");
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      
      // Mettre à jour la session pour refléter les changements
      await update({
        ...session,
        user: {
          ...session?.user,
          name: `${firstName || ''} ${lastName || ''}`.trim() || session?.user?.email,
        },
      });
      
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !session?.user) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Skeleton className="h-7 w-64 mb-6" />
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="p-6">
              <Skeleton className="h-7 w-40 mb-4" />
              <Skeleton className="h-32 w-32 mx-auto rounded-full mb-4" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full mt-2" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={session.user.email || ""}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  L'email ne peut pas être modifié.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Entreprise</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Poste</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour le profil"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Compte</h2>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium">Membre depuis</p>
                <p className="text-gray-600">
                  {profile?.createdAt 
                    ? new Date(profile.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long', 
                        year: 'numeric'
                      })
                    : "Date inconnue"}
                </p>
              </div>
              
              <div>
                <p className="font-medium">Type de compte</p>
                <p className="text-gray-600">Standard</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Button
                color="danger"
                variant="outline"
                className="w-full"
              >
                Changer de mot de passe
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Logo de votre entreprise</h2>
            
            <div className="border-2 border-dashed rounded-lg p-6 text-center mb-4">
              {profile?.companyLogo ? (
                <div className="relative">
                  <img 
                    src={profile.companyLogo} 
                    alt="Logo de l'entreprise" 
                    className="max-w-full h-auto max-h-48 mx-auto"
                  />
                  <button 
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Supprimer le logo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Aucun logo téléchargé</p>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-3">
                Téléchargez le logo de votre entreprise pour l'afficher sur vos devis.
                Formats acceptés : PNG, JPG, SVG. Taille max : 2 Mo.
              </p>
              <Button
                variant="outline"
                className="w-full"
              >
                Télécharger un logo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
