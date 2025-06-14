"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface Service {
  id?: string;
  nom: string;
  description?: string;
  prix: number;
}

interface MainOeuvre {
  heures_estimees: number;
  taux_horaire: number;
}

interface ServicesTabProps {
  postes: Service[];
  setPostes: (services: Service[]) => void;
  mainOeuvre: MainOeuvre;
  setMainOeuvre: (mainOeuvre: MainOeuvre) => void;
}

export default function ServicesTab({ postes, setPostes, mainOeuvre, setMainOeuvre }: ServicesTabProps) {
  const [newService, setNewService] = useState<Service>({
    nom: "",
    description: "",
    prix: 0
  });

  const [editMode, setEditMode] = useState<number | null>(null);

  const handleAddService = () => {
    if (!newService.nom) return;
    
    const updatedServices = [...postes, { ...newService, id: Date.now().toString() }];
    setPostes(updatedServices);
    setNewService({
      nom: "",
      description: "",
      prix: 0
    });
  };

  const handleUpdateService = (index: number) => {
    const updatedServices = [...postes];
    updatedServices[index] = { ...postes[index], ...newService };
    setPostes(updatedServices);
    setEditMode(null);
    setNewService({
      nom: "",
      description: "",
      prix: 0
    });
  };

  const startEditService = (index: number) => {
    setNewService({ ...postes[index] });
    setEditMode(index);
  };

  const handleDeleteService = (index: number) => {
    const updatedServices = [...postes];
    updatedServices.splice(index, 1);
    setPostes(updatedServices);
    
    if (editMode === index) {
      setEditMode(null);
      setNewService({
        nom: "",
        description: "",
        prix: 0
      });
    }
  };

  const mainDoeuvreTotal = mainOeuvre.heures_estimees * mainOeuvre.taux_horaire;

  return (
    <div className="space-y-4 p-4 bg-card border rounded-md">
      <h3 className="text-lg font-serif font-semibold mb-2">Main d'œuvre</h3>
      
      <div className="border rounded p-3 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <label className="text-sm">Heures estimées</label>
            <Input 
              type="number"
              min="0"
              step="0.5"
              value={mainOeuvre.heures_estimees}
              onChange={(e) => setMainOeuvre({...mainOeuvre, heures_estimees: parseFloat(e.target.value) || 0})}
              className="flex-1"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm">Taux horaire (€/h)</label>
            <Input 
              type="number"
              min="0"
              step="any"
              value={mainOeuvre.taux_horaire}
              onChange={(e) => setMainOeuvre({...mainOeuvre, taux_horaire: parseFloat(e.target.value) || 0})}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex justify-between items-center p-2 bg-muted rounded">
          <span className="font-medium">Total main d'œuvre</span>
          <span className="font-mono font-medium">{formatCurrency(mainDoeuvreTotal)}</span>
        </div>
      </div>

      <Separator className="my-6" />
      <h3 className="text-lg font-serif font-semibold mb-2">Services additionnels</h3>
      
      <div className="border rounded p-3 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <label className="text-sm">Nom du service</label>
            <Input 
              value={newService.nom}
              onChange={(e) => setNewService({...newService, nom: e.target.value})}
              placeholder="Ex: Évacuation des déchets"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm">Prix (€)</label>
            <div className="flex space-x-1 items-center">
              <Input 
                type="number"
                min="0"
                step="any"
                value={newService.prix}
                onChange={(e) => setNewService({...newService, prix: parseFloat(e.target.value) || 0})}
                className="flex-1"
              />
              <Button 
                onClick={() => editMode !== null ? handleUpdateService(editMode) : handleAddService()}
                className="whitespace-nowrap"
              >
                {editMode !== null ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </div>
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Description (optionnelle)</label>
          <Input 
            value={newService.description || ""}
            onChange={(e) => setNewService({...newService, description: e.target.value})}
            placeholder="Description du service..."
          />
        </div>
      </div>

      {postes.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="w-[150px] text-right">Prix</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postes.map((service, index) => (
              <TableRow key={service.id || index}>
                <TableCell>
                  <div>
                    <div className="font-medium">{service.nom}</div>
                    {service.description && <div className="text-sm text-muted-foreground">{service.description}</div>}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(service.prix)}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => startEditService(index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteService(index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          Aucun service additionnel ajouté pour l'instant
        </div>
      )}
    </div>
  );
}
