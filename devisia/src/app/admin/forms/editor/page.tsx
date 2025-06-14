"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Trash2,
  Copy as CopyIcon,
} from "lucide-react";

interface FormTemplate {
  id: string;
  name: string;
  description: string | null;
  json: string;
  createdAt: string;
  updatedAt: string;
}

interface QuestionNode {
  id: string;
  question: string;
  label: string;
  name: string;
  type: string;
  options?: OptionNode[];
  next?: QuestionNode;
}

interface OptionNode {
  id: string;
  label: string;
  value: string;
  next?: QuestionNode;
}

const TYPE_OPTIONS = [
  { value: "text", label: "Texte" },
  { value: "textarea", label: "Texte long" },
  { value: "number", label: "Nombre" },
  { value: "email", label: "Email" },
  { value: "select", label: "Liste déroulante" },
  { value: "radio", label: "Choix unique" },
  { value: "checkbox", label: "Case à cocher" },
  { value: "date", label: "Date" },
];

const randomId = () => Math.random().toString(36).substring(2, 9);

const createEmptyQuestion = (): QuestionNode => ({
  id: randomId(),
  question: "",
  label: "",
  name: "",
  type: "text",
});

const createEmptyOption = (): OptionNode => ({
  id: randomId(),
  label: "",
  value: "",
});

export default function FormEditorPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionNode[]>([]);
  const [isJsonDialogOpen, setIsJsonDialogOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Auto-load template if ?id= param is present
  useEffect(() => {
    if (!params) return;
    const id = params.get("id");
    if (id && templates.length) {
      const tpl = templates.find((t) => t.id === id);
      if (tpl) loadTemplate(tpl);
    }
  }, [params, templates]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/admin/forms");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      } else {
        toast.error("Erreur lors du chargement des formulaires");
      }
    } catch (e) {
      console.error(e);
      toast.error("Impossible de charger les formulaires");
    }
  };

  const addIdsRecursively = (node: any): any => {
    const withId = { ...node, id: randomId() };
    if (withId.options) {
      withId.options = withId.options.map((o: any) => addIdsRecursively(o));
    }
    if (withId.next) withId.next = addIdsRecursively(withId.next);
    return withId;
  };

  const loadTemplate = (tpl: FormTemplate) => {
    setSelectedTemplate(tpl);
    setFormName(tpl.name);
    setDescription(tpl.description ?? "");
    try {
      const parsed = JSON.parse(tpl.json);
      const withIds: QuestionNode[] = Array.isArray(parsed)
        ? parsed.map((n: any) => addIdsRecursively(n))
        : [];
      setQuestions(withIds);
    } catch (e) {
      console.error(e);
      toast.error("JSON invalide pour ce template");
      setQuestions([]);
    }
  };

  const newTemplate = () => {
    setSelectedTemplate(null);
    setFormName("");
    setDescription("");
    setQuestions([]);
  };

  const addRootQuestion = () => setQuestions((prev) => [...prev, createEmptyQuestion()]);

  const updateQuestion = (updated: QuestionNode) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const stripIds = (node: any): any => {
    if (Array.isArray(node)) return node.map(stripIds);
    const { id, ...rest } = node;
    if (rest.options) rest.options = rest.options.map(stripIds);
    if (rest.next) rest.next = stripIds(rest.next);
    return rest;
  };

  const saveTemplate = async () => {
    if (!formName.trim()) {
      toast.error("Le nom du formulaire est requis");
      return;
    }

    const payload = {
      name: formName.trim(),
      description: description.trim() || null,
      json: JSON.stringify(questions.map(stripIds)),
    };

    try {
      let res: Response;
      if (selectedTemplate?.id) {
        res = await fetch(`/api/admin/forms/${selectedTemplate.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error();

      const saved = await res.json();
      toast.success("Formulaire enregistré");
      // refresh list
      const updated = await fetch("/api/admin/forms").then((r) => r.json());
      setTemplates(updated);
      const match = updated.find((t: FormTemplate) => t.id === saved.id);
      if (match) loadTemplate(match);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(
      JSON.stringify(questions.map(stripIds), null, 2)
    );
    toast.success("JSON copié dans le presse-papiers");
  };

  const jsonPreview = JSON.stringify(questions.map(stripIds), null, 2);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-serif font-semibold">Constructeur de formulaire dynamique</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Nom du formulaire</label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex: Brief projet" />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optionnel" />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Select
              value={selectedTemplate?.id ?? ""}
              onValueChange={(val) => {
                const tpl = templates.find((t) => t.id === val);
                if (tpl) loadTemplate(tpl);
              }}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Choisir un formulaire existant" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="secondary" onClick={newTemplate}>
              Nouveau
            </Button>
            <Button size="sm" onClick={saveTemplate}>
              Enregistrer
            </Button>
          </div>
        </div>
        <Button
          onClick={addRootQuestion}
          variant="secondary"
          className="flex items-center gap-2 h-fit"
        >
          <PlusCircle className="h-4 w-4" /> Ajouter une question
        </Button>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <QuestionEditor
            key={q.id}
            node={q}
            onChange={updateQuestion}
            onDelete={() => deleteQuestion(q.id)}
          />
        ))}
      </div>

      <div className="mt-8">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsJsonDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <CopyIcon className="h-4 w-4" /> Voir JSON
        </Button>

        <Dialog open={isJsonDialogOpen} onOpenChange={setIsJsonDialogOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Aperçu JSON</DialogTitle>
            </DialogHeader>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-[60vh] whitespace-pre-wrap">
              {jsonPreview}
            </pre>
            <DialogFooter className="mt-4 space-x-2">
              <Button size="sm" onClick={copyJSON} className="flex items-center gap-2">
                <CopyIcon className="h-4 w-4" /> Copier
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setIsJsonDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface QuestionEditorProps {
  node: QuestionNode;
  onChange: (node: QuestionNode) => void;
  onDelete: () => void;
}

function QuestionEditor({ node, onChange, onDelete }: QuestionEditorProps) {
  const updateField = (field: keyof QuestionNode, value: any) => {
    onChange({ ...node, [field]: value });
  };

  const addOption = () => {
    const updatedOptions = node.options
      ? [...node.options, createEmptyOption()]
      : [createEmptyOption()];
    onChange({ ...node, options: updatedOptions });
  };

  const updateOption = (updated: OptionNode) => {
    const updatedOptions = node.options?.map((opt) =>
      opt.id === updated.id ? updated : opt
    );
    onChange({ ...node, options: updatedOptions });
  };

  const deleteOption = (id: string) => {
    const updatedOptions = node.options?.filter((opt) => opt.id !== id);
    onChange({ ...node, options: updatedOptions });
  };

  const addNextQuestion = () => {
    onChange({ ...node, next: createEmptyQuestion() });
  };

  return (
    <div className="border rounded-md p-4 space-y-4 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-serif font-semibold">Question</h3>
        <Button
          variant="destructive"
          size="icon"
          onClick={onDelete}
          title="Supprimer la question"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Texte de la question</label>
          <Input
            value={node.question}
            onChange={(e) => updateField("question", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Label de la question</label>
          <Input
            value={node.label}
            onChange={(e) => updateField("label", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Identifiant (name)</label>
          <Input
            value={node.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Type</label>
          <Select
            value={node.type}
            onValueChange={(val) => updateField("type", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir le type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(node.type === "radio" || node.type === "select") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Options</h4>
            <Button
              size="sm"
              variant="secondary"
              onClick={addOption}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Ajouter une option
            </Button>
          </div>
          {node.options?.map((opt) => (
            <OptionEditor
              key={opt.id}
              option={opt}
              onChange={updateOption}
              onDelete={() => deleteOption(opt.id)}
            />
          ))}
        </div>
      )}

      {node.type !== "radio" && node.type !== "select" && (
        <div className="pl-4 border-l mt-4">
          {node.next ? (
            <QuestionEditor
              node={node.next}
              onChange={(updatedNext) =>
                onChange({ ...node, next: updatedNext })
              }
              onDelete={() => onChange({ ...node, next: undefined })}
            />
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={addNextQuestion}
              className="flex items-center gap-1 mt-2"
            >
              <PlusCircle className="h-4 w-4" /> Ajouter une sous-question
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

interface OptionEditorProps {
  option: OptionNode;
  onChange: (option: OptionNode) => void;
  onDelete: () => void;
}

function OptionEditor({ option, onChange, onDelete }: OptionEditorProps) {
  const updateField = (field: keyof OptionNode, value: any) => {
    onChange({ ...option, [field]: value });
  };

  const addNextQuestion = () => {
    onChange({ ...option, next: createEmptyQuestion() });
  };

  return (
    <div className="border rounded-md p-3 bg-muted/50 space-y-3">
      <div className="flex justify-between items-center">
        <h5 className="font-medium">Option</h5>
        <Button
          size="icon"
          variant="destructive"
          onClick={onDelete}
          title="Supprimer l'option"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Label</label>
          <Input
            value={option.label}
            onChange={(e) => updateField("label", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Value</label>
          <Input
            value={option.value}
            onChange={(e) => updateField("value", e.target.value)}
          />
        </div>
      </div>

      <div className="pl-4 border-l">
        {option.next ? (
          <QuestionEditor
            node={option.next}
            onChange={(updatedNext) =>
              onChange({ ...option, next: updatedNext })
            }
            onDelete={() => onChange({ ...option, next: undefined })}
          />
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={addNextQuestion}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" /> Ajouter une sous-question
          </Button>
        )}
      </div>
    </div>
  );
}
