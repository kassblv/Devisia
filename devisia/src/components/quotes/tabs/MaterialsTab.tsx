"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface Material {
  id?: string;
  nom: string;
  description?: string;
  quantité: number;
  unité: string;
  prix_unitaire: number;
}

interface MaterialsTabProps {
  materiaux: Material[];
  setMateriaux: (materiaux: Material[]) => void;
}

export default function MaterialsTab({ materiaux, setMateriaux }: MaterialsTabProps) {
  const [newMaterial, setNewMaterial] = useState<Material>({
    nom: "",
    description: "",
    quantité: 1,
    unité: "unité",
    prix_unitaire: 0
  });

  const [editMode, setEditMode] = useState<number | null>(null);

  const handleAddMaterial = () => {
    if (!newMaterial.nom) return;
    
    const updatedMaterials = [...materiaux, { ...newMaterial, id: Date.now().toString() }];
    setMateriaux(updatedMaterials);
    setNewMaterial({
      nom: "",
      description: "",
      quantité: 1,
      unité: "unité",
      prix_unitaire: 0
    });
  };

  const handleUpdateMaterial = (index: number) => {
    const updatedMaterials = [...materiaux];
    updatedMaterials[index] = { ...materiaux[index], ...newMaterial };
    setMateriaux(updatedMaterials);
    setEditMode(null);
    setNewMaterial({
      nom: "",
      description: "",
      quantité: 1,
      unité: "unité",
      prix_unitaire: 0
    });
  };

  const startEditMaterial = (index: number) => {
    setNewMaterial({ ...materiaux[index] });
    setEditMode(index);
  };

  const handleDeleteMaterial = (index: number) => {
    const updatedMaterials = [...materiaux];
    updatedMaterials.splice(index, 1);
    setMateriaux(updatedMaterials);
    
    if (editMode === index) {
      setEditMode(null);
      setNewMaterial({
        nom: "",
        description: "",
        quantité: 1,
        unité: "unité",
        prix_unitaire: 0
      });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card border rounded-md">
      <h3 className="text-lg font-serif font-semibold mb-2">Matériaux</h3>
      
      <div className="border rounded p-3 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="grid gap-1">
            <label className="text-sm">Nom</label>
            <Input 
              value={newMaterial.nom}
              onChange={(e) => setNewMaterial({...newMaterial, nom: e.target.value})}
              placeholder="Ex: Panneau électrique"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm">Quantité</label>
            <div className="flex space-x-1">
              <Input 
                type="number"
                min="0.01"
                step="any"
                value={newMaterial.quantité}
                onChange={(e) => setNewMaterial({...newMaterial, quantité: parseFloat(e.target.value) || 0})}
                className="flex-1"
              />
              <Input 
                value={newMaterial.unité}
                onChange={(e) => setNewMaterial({...newMaterial, unité: e.target.value})}
                placeholder="unité"
                className="w-20"
              />
            </div>
          </div>
          <div className="grid gap-1">
            <label className="text-sm">Prix unitaire (€)</label>
            <div className="flex space-x-1 items-center">
              <Input 
                type="number"
                min="0"
                step="any"
                value={newMaterial.prix_unitaire}
                onChange={(e) => setNewMaterial({...newMaterial, prix_unitaire: parseFloat(e.target.value) || 0})}
                className="flex-1"
              />
              <Button 
                onClick={() => editMode !== null ? handleUpdateMaterial(editMode) : handleAddMaterial()}
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
            value={newMaterial.description || ""}
            onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
            placeholder="Description du matériel..."
          />
        </div>
      </div>

      {materiaux.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matériel</TableHead>
              <TableHead className="w-[150px]">Quantité</TableHead>
              <TableHead className="w-[150px]">Prix unitaire</TableHead>
              <TableHead className="w-[150px] text-right">Total</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materiaux.map((item, index) => (
              <TableRow key={item.id || index}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.nom}</div>
                    {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
                  </div>
                </TableCell>
                <TableCell className="font-mono">
                  {item.quantité} {item.unité}
                </TableCell>
                <TableCell className="font-mono">{formatCurrency(item.prix_unitaire)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(item.quantité * item.prix_unitaire)}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => startEditMaterial(index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMaterial(index)}>
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
          Aucun matériel ajouté pour l'instant
        </div>
      )}
    </div>
  );
}
