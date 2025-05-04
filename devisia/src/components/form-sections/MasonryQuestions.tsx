import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MasonryQuestionsProps {
  mlMurs: number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MasonryQuestions({
  mlMurs,
  onChange
}: MasonryQuestionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Questions Spécifiques - Maçonnerie</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="mlMurs">Mètres Linéaires de Murs</Label>
          <Input
            id="mlMurs"
            name="mlMurs"
            type="number"
            min="0"
            value={mlMurs || ""}
            onChange={onChange}
            placeholder="Longueur totale de murs à construire/démolir en mètres"
          />
        </div>
      </div>
    </div>
  );
}
