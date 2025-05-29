import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionSection, shouldDisplayQuestion } from "@/config/questionnaireModels";
import { DynamicFormField } from "./DynamicFormField";

interface DynamicFormSectionProps {
  section: QuestionSection;
  formData: any;
  onChange: (id: string, value: any) => void;
}

export function DynamicFormSection({ section, formData, onChange }: DynamicFormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        {section.description && <CardDescription>{section.description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {section.questions.map((question) => {
          // Vérifier si la question doit être affichée en fonction des conditions
          if (shouldDisplayQuestion(question, formData)) {
            return (
              <div 
                key={question.id} 
                className={question.type === 'textarea' || question.type === 'checkbox' ? "md:col-span-2" : ""}
              >
                <DynamicFormField
                  question={question}
                  value={formData[question.id]}
                  onChange={onChange}
                />
              </div>
            );
          }
          return null;
        })}
      </CardContent>
    </Card>
  );
}
