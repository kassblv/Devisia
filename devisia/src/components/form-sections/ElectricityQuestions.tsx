import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface ElectricityQuestionsProps {
  pointsElectriques: number | undefined;
  tableauElectrique: boolean | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

export function ElectricityQuestions({
  pointsElectriques,
  tableauElectrique,
  onChange,
  onSwitchChange
}: ElectricityQuestionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Questions Spécifiques - Électricité</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pointsElectriques">Nombre de Points Électriques</Label>
          <Input
            id="pointsElectriques"
            name="pointsElectriques"
            type="number"
            min="0"
            value={pointsElectriques || ""}
            onChange={onChange}
            placeholder="Nombre total de prises, interrupteurs, points lumineux..."
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-8">
          <Switch
            id="tableauElectrique"
            checked={tableauElectrique || false}
            onCheckedChange={(checked) => onSwitchChange("tableauElectrique", checked)}
          />
          <Label htmlFor="tableauElectrique">Remplacement/Installation Tableau Électrique</Label>
        </div>
      </div>
    </div>
  );
}
