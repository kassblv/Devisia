import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface GeneralProjectInfoProps {
  typeProjet: string;
  typeBatiment: string;
  surfaceTotale: number | undefined;
  contraintesSpecifiques: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export function GeneralProjectInfo({
  typeProjet,
  typeBatiment,
  surfaceTotale,
  contraintesSpecifiques,
  onChange,
  onSelectChange
}: GeneralProjectInfoProps) {
  const projetTypes = [
    { value: "neuf", label: "Construction Neuve" },
    { value: "renovation", label: "Rénovation" },
    { value: "extension", label: "Extension" },
    { value: "amenagement", label: "Aménagement" },
    { value: "reparation", label: "Réparation/Maintenance" }
  ];

  const batimentTypes = [
    { value: "maison", label: "Maison Individuelle" },
    { value: "appartement", label: "Appartement" },
    { value: "immeuble", label: "Immeuble Collectif" },
    { value: "local_commercial", label: "Local Commercial" },
    { value: "bureau", label: "Bureau" },
    { value: "entrepot", label: "Entrepôt/Local Industriel" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="typeProjet">Type de Projet *</Label>
        <Select
          value={typeProjet || ""}
          onValueChange={(value) => onSelectChange("typeProjet", value)}
        >
          <SelectTrigger id="typeProjet">
            <SelectValue placeholder="Sélectionner..." />
          </SelectTrigger>
          <SelectContent>
            {projetTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="typeBatiment">Type de Bâtiment *</Label>
        <Select
          value={typeBatiment || ""}
          onValueChange={(value) => onSelectChange("typeBatiment", value)}
        >
          <SelectTrigger id="typeBatiment">
            <SelectValue placeholder="Sélectionner..." />
          </SelectTrigger>
          <SelectContent>
            {batimentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="surfaceTotale">Surface Totale (m²) *</Label>
        <Input
          id="surfaceTotale"
          name="surfaceTotale"
          type="number"
          min="1"
          value={surfaceTotale || ""}
          onChange={onChange}
          placeholder="Surface en m²"
          required
        />
      </div>
      
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="contraintesSpecifiques">Contraintes Spécifiques</Label>
        <Textarea
          id="contraintesSpecifiques"
          name="contraintesSpecifiques"
          value={contraintesSpecifiques || ""}
          onChange={onChange}
          placeholder="Précisez les contraintes particulières (accès, horaires, etc.)"
          rows={3}
        />
      </div>
    </div>
  );
}
