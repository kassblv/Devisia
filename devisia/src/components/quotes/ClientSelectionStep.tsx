"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DomainSelection } from "@/components/form-sections/DomainSelection";

interface Client {
  id: string;
  name: string;
  email?: string;
}

interface ClientSelectionStepProps {
  clients: Client[];
  isLoadingClients: boolean;
  selectedClient: string | undefined;
  searchTerm: string;
  showClientResults: boolean;
  filteredClients: Client[];
  selectedDomain: string | undefined;
  questionnaires: any[]; // Utilisez le type approprié de votre configuration
  setSearchTerm: (term: string) => void;
  setShowClientResults: (show: boolean) => void;
  handleClientSelection: (clientId: string) => void;
  handleDomainChange: (domain: string) => void;
  nextStep: () => void;
}

export default function ClientSelectionStep({
  clients,
  isLoadingClients,
  selectedClient,
  searchTerm,
  showClientResults,
  filteredClients,
  selectedDomain,
  questionnaires,
  setSearchTerm,
  setShowClientResults,
  handleClientSelection,
  handleDomainChange,
  nextStep
}: ClientSelectionStepProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuration du Devis</CardTitle>
        <CardDescription>
          Sélectionnez le client et le domaine pour ce devis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Sélection du client */}
          <div className="grid gap-2">
            <Label htmlFor="client" className="text-base font-medium">Client *</Label>
            {isLoadingClients ? (
              <div className="space-y-2">
                <div className="h-11 w-full rounded-md border border-input bg-background animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent shimmer-effect"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
                  <div className="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Input
                  type="text"
                  id="client"
                  placeholder="Rechercher un client..."
                  className="h-11"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowClientResults(true);
                    
                  }}
                  onFocus={() => setShowClientResults(true)}
                  onBlur={() => {
                    setTimeout(() => setShowClientResults(false), 200);
                  }}
                />
                
                {/* Indicateur de sélection si un client est sélectionné */}
                {selectedClient && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Badge variant="outline" className="font-normal">
                      Sélectionné
                    </Badge>
                  </div>
                )}
                
                {/* Liste des résultats */}
                {showClientResults && (
                  <div className="absolute z-10 w-full mt-1 bg-background rounded-md border shadow-md max-h-56 overflow-auto">
                    {filteredClients.length > 0 ? (
                      filteredClients.map(client => (
                        <div
                          key={client.id}
                          className={`px-3 py-2 cursor-pointer hover:bg-secondary ${client.id === selectedClient ? 'bg-secondary' : ''}`}
                          onClick={() => handleClientSelection(client.id)}
                        >
                          {client.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-muted-foreground">Aucun client trouvé</div>
                    )}
                  </div>
                )}
              </div>
            )}
            <p className="text-sm text-muted-foreground">Ou <Link href="/dashboard/clients/new" className="underline">créer un nouveau client</Link>.</p>
          </div>
          
          {/* Sélection du domaine */}
          <DomainSelection 
            domains={questionnaires} 
            selectedDomain={selectedDomain} 
            onChange={handleDomainChange} 
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          asChild
        >
          <Link href="/dashboard/quotes">
            Annuler
          </Link>
        </Button>
        <Button onClick={nextStep} disabled={!selectedClient || !selectedDomain}>Suivant</Button>
      </CardFooter>
    </Card>
  );
}
