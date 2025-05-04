import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UserInstructionsProps {
  userInstructions: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function UserInstructions({
  userInstructions,
  onChange
}: UserInstructionsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="userInstructions">Instructions Complémentaires</Label>
        <Textarea
          id="userInstructions"
          name="userInstructions"
          value={userInstructions}
          onChange={onChange}
          placeholder="Informations complémentaires ou besoins spécifiques pour votre devis..."
          rows={4}
        />
      </div>
    </div>
  );
}
