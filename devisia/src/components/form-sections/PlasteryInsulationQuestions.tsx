import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlasteryInsulationQuestionsProps {
  mlCloisons: number | undefined;
  typeIsolant: string;
  showOtherIsolantInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  setShowOtherIsolantInput: (show: boolean) => void;
}

export function PlasteryInsulationQuestions({
  mlCloisons,
  typeIsolant,
  showOtherIsolantInput,
  onChange,
  onSelectChange,
  setShowOtherIsolantInput
}: PlasteryInsulationQuestionsProps) {
  const insulationTypes = [
    { value: "laine de verre", label: "Laine de Verre" },
    { value: "laine de roche", label: "Laine de Roche" },
    { value: "polyuréthane (pu)", label: "Polyuréthane (PU)" },
    { value: "polystyrène expansé (eps)", label: "Polystyrène Expansé (EPS)" },
    { value: "polystyrène extrudé (xps)", label: "Polystyrène Extrudé (XPS)" },
    { value: "ouate de cellulose", label: "Ouate de Cellulose" },
    { value: "fibre de bois", label: "Fibre de Bois" },
    { value: "liège", label: "Liège expansé" },
    { value: "autre", label: "Autre (Préciser)" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Questions Spécifiques - Plâtrerie / Isolation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="mlCloisons">Mètres Linéaires de Cloisons</Label>
          <Input
            id="mlCloisons"
            name="mlCloisons"
            type="number"
            min="0"
            value={mlCloisons || ""}
            onChange={onChange}
            placeholder="Longueur totale en mètres"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="typeIsolant">Type d'Isolant Principal</Label>
          <Select
            value={showOtherIsolantInput ? "autre" : typeIsolant || ""}
            onValueChange={(value) => {
              if (value === "autre") {
                setShowOtherIsolantInput(true);
                onSelectChange("typeIsolant", "");
              } else {
                setShowOtherIsolantInput(false);
                onSelectChange("typeIsolant", value);
              }
            }}
          >
            <SelectTrigger id="typeIsolant">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {insulationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {showOtherIsolantInput && (
          <div className="grid gap-2">
            <Label htmlFor="typeIsolant">Précisez le Type d'Isolant</Label>
            <Input
              id="typeIsolant"
              name="typeIsolant"
              value={typeIsolant || ""}
              onChange={onChange}
              placeholder="Ex: Chènevotte, Perlite, etc."
            />
          </div>
        )}
      </div>
    </div>
  );
}
