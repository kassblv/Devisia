import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlumbingQuestionsProps {
  nombrePointsEau: number | undefined;
  typeChauffage: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export function PlumbingQuestions({
  nombrePointsEau,
  typeChauffage,
  onChange,
  onSelectChange
}: PlumbingQuestionsProps) {
  const chauffageTypes = [
    { value: "gaz", label: "Gaz" },
    { value: "electrique", label: "Électrique" },
    { value: "pac", label: "Pompe à Chaleur" },
    { value: "fioul", label: "Fioul" },
    { value: "bois", label: "Bois/Granulés" },
    { value: "autre", label: "Autre" }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Questions Spécifiques - Plomberie / Chauffage</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nombrePointsEau">Nombre de Points d'Eau</Label>
          <Input
            id="nombrePointsEau"
            name="nombrePointsEau"
            type="number"
            min="0"
            value={nombrePointsEau || ""}
            onChange={onChange}
            placeholder="Robinets, éviers, douches, WC..."
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="typeChauffage">Type de Chauffage</Label>
          <Select
            value={typeChauffage || ""}
            onValueChange={(value) => onSelectChange("typeChauffage", value)}
          >
            <SelectTrigger id="typeChauffage">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {chauffageTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
