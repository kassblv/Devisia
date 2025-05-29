import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionnaireModel } from "@/config/questionnaireModels";

interface DomainSelectionProps {
  domains: QuestionnaireModel[];
  selectedDomain: string | undefined;
  onChange: (domain: string) => void;
}

export function DomainSelection({ domains, selectedDomain, onChange }: DomainSelectionProps) {
  return (
    <div className="grid gap-3">
      <Label htmlFor="domain" className="text-base font-medium">Type de Devis *</Label>
      <Select 
        value={selectedDomain || ""} 
        onValueChange={onChange}
      >
        <SelectTrigger id="domain" className="h-11">
          <SelectValue placeholder="Choisir le domaine du devis..." />
        </SelectTrigger>
        <SelectContent>
          {domains.map((domain) => (
            <SelectItem key={domain.id} value={domain.id}>
              {domain.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground mt-1">
        Le questionnaire sera adapté en fonction du domaine sélectionné.
      </p>
    </div>
  );
}
