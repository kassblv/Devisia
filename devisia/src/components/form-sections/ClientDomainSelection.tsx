import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  email?: string;
}

interface DomainOption {
  value: string;
  label: string;
}

interface ClientDomainSelectionProps {
  clients: Client[];
  domainOptions: DomainOption[];
  selectedClient: string | undefined;
  selectedDomain: string | undefined;
  isLoadingClients: boolean;
  onClientChange: (clientId: string) => void;
  onDomainChange: (domain: string) => void;
}

export function ClientDomainSelection({
  clients,
  domainOptions,
  selectedClient,
  selectedDomain,
  isLoadingClients,
  onClientChange,
  onDomainChange
}: ClientDomainSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="clientSelect">Client *</Label>
        <Select 
          value={selectedClient || ""} 
          onValueChange={onClientChange} 
          disabled={isLoadingClients}
        >
          <SelectTrigger id="clientSelect">
            <SelectValue placeholder={isLoadingClients ? "Chargement..." : "Sélectionner un client..."} />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="domainSelect">Domaine du Devis *</Label>
        <Select 
          value={selectedDomain || ""} 
          onValueChange={onDomainChange}
        >
          <SelectTrigger id="domainSelect">
            <SelectValue placeholder="Sélectionner un domaine..." />
          </SelectTrigger>
          <SelectContent>
            {domainOptions.map((domain) => (
              <SelectItem key={domain.value} value={domain.value}>
                {domain.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
