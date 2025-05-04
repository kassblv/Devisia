import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoofingQuestionsProps {
  typeToiture: string;
  showOtherToitureInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  setShowOtherToitureInput: (show: boolean) => void;
}

export function RoofingQuestions({
  typeToiture,
  showOtherToitureInput,
  onChange,
  onSelectChange,
  setShowOtherToitureInput
}: RoofingQuestionsProps) {
  const roofTypes = [
    { value: "tuiles mécaniques", label: "Tuiles Mécaniques" },
    { value: "tuiles plates", label: "Tuiles Plates" },
    { value: "ardoise", label: "Ardoise" },
    { value: "zinc", label: "Zinc" },
    { value: "bac acier", label: "Bac Acier" },
    { value: "toiture terrasse", label: "Toiture Terrasse (Bitume, EPDM...)" },
    { value: "autre", label: "Autre (Préciser)" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Questions Spécifiques - Couverture / Toiture</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="typeToiture">Type de Toiture Principal</Label>
          <Select
            value={showOtherToitureInput ? "autre" : typeToiture || ""}
            onValueChange={(value) => {
              if (value === "autre") {
                setShowOtherToitureInput(true);
                onSelectChange("typeToiture", "");
              } else {
                setShowOtherToitureInput(false);
                onSelectChange("typeToiture", value);
              }
            }}
          >
            <SelectTrigger id="typeToiture">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {roofTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {showOtherToitureInput && (
          <div className="grid gap-2">
            <Label htmlFor="typeToiture">Précisez le Type de Toiture</Label>
            <Input
              id="typeToiture"
              name="typeToiture"
              value={typeToiture || ""}
              onChange={onChange}
              placeholder="Ex: Shingle, Végétalisée, etc."
            />
          </div>
        )}
      </div>
    </div>
  );
}
