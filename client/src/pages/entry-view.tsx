import { useWorld } from "@/lib/world-context";
import { CATEGORIES, Category, Entry } from "@/lib/types";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Trash2, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export default function EntryView() {
  const [, params] = useRoute("/entry/:id");
  const [matchNew] = useRoute("/new");
  const id = params?.id;
  const isNew = !!matchNew;
  const { getEntry, addEntry, updateEntry, deleteEntry, entries } = useWorld();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Parse query params for default category
  const queryParams = new URLSearchParams(window.location.search);
  const defaultCategory = (queryParams.get("category") as Category) || "misc";

  const [formData, setFormData] = useState<Partial<Entry>>({
    title: "",
    category: defaultCategory,
    content: "",
    tags: [],
    relations: [],
    imageUrl: "",
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      const entry = getEntry(id);
      if (entry) {
        setFormData(entry);
      } else {
        setLocation("/404");
      }
    }
  }, [id, isNew, getEntry, setLocation]);

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and content.",
        variant: "destructive",
      });
      return;
    }

    if (isNew) {
      addEntry(formData as Omit<Entry, "id" | "createdAt" | "updatedAt">);
      toast({ title: "Entry Created", description: "Your new entry has been archived." });
    } else if (id) {
      updateEntry(id, formData);
      toast({ title: "Entry Updated", description: "Changes saved successfully." });
    }
    
    if (isNew) setLocation(`/category/${formData.category}`);
  };

  const handleDelete = () => {
    if (id) {
      deleteEntry(id);
      toast({ title: "Entry Deleted", description: "The archive has been updated." });
      setLocation("/");
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const addRelation = (targetId: string) => {
    if (targetId && !formData.relations?.some(r => r.targetId === targetId)) {
      setFormData(prev => ({
        ...prev,
        relations: [...(prev.relations || []), { targetId, type: "Related to" }]
      }));
    }
  };

  const removeRelation = (targetId: string) => {
    setFormData(prev => ({
      ...prev,
      relations: prev.relations?.filter(r => r.targetId !== targetId)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Actions */}
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur py-4 z-10 border-b mb-8">
        <Button variant="ghost" onClick={() => window.history.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex gap-2">
          {!isNew && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this entry from your archives.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" /> Save Entry
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Title & Category */}
        <div className="space-y-4">
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Entry Title"
            className="text-4xl font-serif font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/30 h-auto rounded-none bg-transparent"
          />
          
          <div className="flex flex-wrap gap-4 items-center">
            <Select 
              value={formData.category} 
              onValueChange={(val) => setFormData({ ...formData, category: val as Category })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ImageIcon className="w-4 h-4" /> {formData.imageUrl ? "Edit Cover" : "Add Cover"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input 
                    value={formData.imageUrl || ""} 
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <LinkIcon className="w-4 h-4" /> Link Entry
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="max-h-60 overflow-y-auto p-2">
                  {entries.filter(e => e.id !== id).map(entry => (
                    <Button 
                      key={entry.id} 
                      variant="ghost" 
                      className="w-full justify-start text-left font-normal"
                      onClick={() => addRelation(entry.id)}
                    >
                      {entry.title}
                    </Button>
                  ))}
                  {entries.length <= (id ? 1 : 0) && (
                    <p className="p-2 text-sm text-muted-foreground text-center">No other entries to link.</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Tags */}
          <div className="flex items-center gap-2 overflow-x-auto p-1">
              {formData.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="+ Add tag..."
                className="w-24 border-none shadow-none focus-visible:ring-0 px-0 min-w-[100px] bg-transparent"
              />
          </div>
        </div>

        {/* Cover Image Preview */}
        {formData.imageUrl && (
          <div className="relative rounded-lg overflow-hidden border max-h-[300px] w-full bg-secondary/20">
            <img src={formData.imageUrl} alt="Cover" className="w-full h-full object-cover" />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => setFormData({...formData, imageUrl: ""})}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Relations List */}
        {formData.relations && formData.relations.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-secondary/10">
            <span className="text-sm font-medium text-muted-foreground self-center mr-2">Linked to:</span>
            {formData.relations.map((rel, idx) => {
               const target = entries.find(e => e.id === rel.targetId);
               if (!target) return null;
               return (
                 <Badge key={idx} variant="outline" className="gap-2 bg-background pl-2 pr-1 py-1">
                   <LinkIcon className="w-3 h-3" />
                   {target.title}
                   <button onClick={() => removeRelation(rel.targetId)} className="ml-1 hover:text-destructive">
                     <X className="w-3 h-3" />
                   </button>
                 </Badge>
               );
            })}
          </div>
        )}

        {/* Main Content */}
        <div className="min-h-[500px] border rounded-lg p-6 bg-card shadow-sm">
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Start writing your lore here..."
            className="min-h-[450px] resize-none border-none shadow-none focus-visible:ring-0 text-lg leading-relaxed font-serif p-0 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
