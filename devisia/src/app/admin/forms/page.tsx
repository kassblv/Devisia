"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { PlusCircle, Trash, Edit, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  { value: 'text', label: 'Texte' },
  { value: 'textarea', label: 'Texte long' },
  { value: 'number', label: 'Nombre' },
  { value: 'email', label: 'Email' },
  { value: 'select', label: 'Liste déroulante' },
  { value: 'radio', label: 'Choix unique' },
  { value: 'checkbox', label: 'Case à cocher' },
  { value: 'date', label: 'Date' }
];

export default function FormsListPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/forms");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      } else {
        toast.error("Erreur lors du chargement des formulaires");
      }
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les formulaires");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteId) return;
    
    try {
      const res = await fetch(`/api/admin/forms/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Formulaire supprimé avec succès");
        fetchTemplates();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error(err);
      toast.error("Impossible de supprimer le formulaire");
    } finally {
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const createNewForm = () => {
    router.push("/admin/forms/editor");
  };

  const editForm = (id: string) => {
    router.push(`/admin/forms/editor?id=${id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-semibold">Formulaires</h1>
        <Button onClick={createNewForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nouveau formulaire
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des formulaires</CardTitle>
          <CardDescription>Gestion des templates de formulaires pour les devis, questionnaires, etc.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : templates.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Aucun formulaire créé</p>
              <Button variant="outline" onClick={createNewForm} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" /> Créer un formulaire
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Date de modification</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{template.description || "-"}</TableCell>
                    <TableCell>{formatDate(template.createdAt)}</TableCell>
                    <TableCell>{formatDate(template.updatedAt)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => editForm(template.id)}>
                        <Edit className="h-4 w-4 mr-1" /> Éditer
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => confirmDelete(template.id)}>
                        <Trash className="h-4 w-4 mr-1" /> Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce formulaire? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


      /*
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
      // Rafraîchir la liste
      const updatedList = await fetch("/api/admin/forms").then((r) => r.json());
      setTemplates(updatedList);
      // Recharger celui-ci
      const match = updatedList.find((t: FormTemplate) => t.id === saved.id);
      if (match) loadTemplate(match);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const copyJSON = () => {
    const clean = questions.map(stripIds);
    navigator.clipboard.writeText(JSON.stringify(clean, null, 2));
    toast.success("JSON copié dans le presse-papiers");
  };

  const jsonPreview = JSON.stringify(questions.map(stripIds), null, 2);

  return (
    <div className="space-y-8">
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
            <Select value={selectedTemplate?.id ?? ""} onValueChange={(val) => { const tpl = templates.find(t => t.id === val); if (tpl) loadTemplate(tpl); }}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Choisir un formulaire existant" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="secondary" onClick={newTemplate}>Nouveau</Button>
            <Button size="sm" onClick={saveTemplate}>Enregistrer</Button>
          </div>
        </div>
        <Button onClick={addRootQuestion} variant="secondary" className="flex items-center gap-2 h-fit">
          <PlusCircle className="h-4 w-4" />
          Ajouter une question
        </Button>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <QuestionEditor key={q.id} node={q} onChange={updateQuestion} onDelete={() => deleteQuestion(q.id)} />
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-lg font-semibold">Aperçu JSON</h2>
          <Button size="sm" onClick={copyJSON} className="flex items-center gap-2">
            <CopyIcon className="h-4 w-4" /> Copier
          </Button>
        </div>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-[400px]">
          {jsonPreview}
        </pre>
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
    const updatedOptions = node.options ? [...node.options, createEmptyOption()] : [createEmptyOption()];
    onChange({ ...node, options: updatedOptions });
  };

  const updateOption = (updated: OptionNode) => {
    const updatedOptions = node.options?.map((opt) => (opt.id === updated.id ? updated : opt));
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
        <Button variant="destructive" size="icon" onClick={onDelete} title="Supprimer la question">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Texte de la question</label>
          <Input value={node.question} onChange={(e) => updateField("question", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Label de la question</label>
          <Input value={node.label} onChange={(e) => updateField("label", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Identifiant (name)</label>
          <Input value={node.name} onChange={(e) => updateField("name", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Type</label>
          <Select value={node.type} onValueChange={(val) => updateField("type", val)}>
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
            <Button size="sm" variant="secondary" onClick={addOption} className="flex items-center gap-1">
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
              onChange={(updatedNext) => onChange({ ...node, next: updatedNext })}
              onDelete={() => onChange({ ...node, next: undefined })}
            />
          ) : (
            <Button size="sm" variant="secondary" onClick={addNextQuestion} className="flex items-center gap-1 mt-2">
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
        <Button size="icon" variant="destructive" onClick={onDelete} title="Supprimer l'option">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Label</label>
          <Input value={option.label} onChange={(e) => updateField("label", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Value</label>
          <Input value={option.value} onChange={(e) => updateField("value", e.target.value)} />
        </div>
      </div>

      <div className="pl-4 border-l">
        {option.next ? (
          <QuestionEditor
            node={option.next}
            onChange={(updatedNext) => onChange({ ...option, next: updatedNext })}
            onDelete={() => onChange({ ...option, next: undefined })}
          />
        ) : (
          <Button size="sm" variant="secondary" onClick={addNextQuestion} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" /> Ajouter une sous-question
          </Button>
        )}
      </div>
    </div>
  );
}

// Utility pour retirer les IDs avant export

  if (Array.isArray(node)) return node.map(stripIds);
  const { id, ...rest } = node;
  if (rest.options) rest.options = rest.options.map(stripIds);
  if (rest.next) rest.next = stripIds(rest.next);
  return rest;
}
*/


