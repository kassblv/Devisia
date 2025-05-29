import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Question } from "@/config/questionnaireModels";

interface DynamicFormFieldProps {
  question: Question;
  value: any;
  onChange: (id: string, value: any) => void;
}

export function DynamicFormField({ question, value, onChange }: DynamicFormFieldProps) {
  // État pour suivre si on affiche un champ "Autre" pour les sélections
  const [showOtherInput, setShowOtherInput] = useState(false);
  
  const handleChange = (newValue: any) => {
    onChange(question.id, newValue);
  };

  switch (question.type) {
    case 'text':
      return (
        <div className="grid gap-2">
          <Label htmlFor={question.id}>{question.label}{question.required && " *"}</Label>
          <Input
            id={question.id}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
          />
        </div>
      );
      
    case 'number':
      return (
        <div className="grid gap-2">
          <Label htmlFor={question.id}>{question.label}{question.required && " *"}</Label>
          <Input
            id={question.id}
            type="number"
            value={value ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
              handleChange(val);
            }}
            placeholder={question.placeholder}
            required={question.required}
            min={question.min}
            max={question.max}
            step={question.step || 1}
          />
        </div>
      );
      
    case 'select':
      return (
        <div className="grid gap-2">
          <Label htmlFor={question.id}>{question.label}{question.required && " *"}</Label>
          <Select
            value={showOtherInput ? "autre" : (value || "")}
            onValueChange={(val) => {
              if (val === "autre") {
                setShowOtherInput(true);
                handleChange("");
              } else {
                setShowOtherInput(false);
                handleChange(val);
              }
            }}
          >
            <SelectTrigger id={question.id}>
              <SelectValue placeholder={question.placeholder || "Sélectionner..."} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              {/* Option "Autre" si nécessaire */}
              {question.options?.some(opt => opt.value === "autre") && (
                <SelectItem value="autre">Autre...</SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {showOtherInput && (
            <div className="grid gap-2 mt-2">
              <Label htmlFor={`${question.id}_autre`}>Précisez</Label>
              <Input
                id={`${question.id}_autre`}
                value={value || ""}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Veuillez préciser..."
                required={question.required}
              />
            </div>
          )}
        </div>
      );
      
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2 py-2">
          <Checkbox
            id={question.id}
            checked={!!value}
            onCheckedChange={(checked) => handleChange(!!checked)}
          />
          <Label htmlFor={question.id} className="cursor-pointer">{question.label}</Label>
        </div>
      );
      
    case 'textarea':
      return (
        <div className="grid gap-2">
          <Label htmlFor={question.id}>{question.label}{question.required && " *"}</Label>
          <Textarea
            id={question.id}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
            rows={question.rows || 3}
          />
        </div>
      );
      
    default:
      return null;
  }
}
