import { useWorld } from "@/lib/world-context";
import { Category, CATEGORIES } from "@/lib/types";
import { useRoute, useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CategoryView() {
  const [, params] = useRoute("/category/:id");
  const categoryId = params?.id as Category;
  const { getEntriesByCategory } = useWorld();
  const [, setLocation] = useLocation();

  const entries = getEntriesByCategory(categoryId);
  const categoryInfo = CATEGORIES.find(c => c.id === categoryId);

  if (!categoryInfo) return <div className="p-20 text-center font-serif text-primary">Archive Category Not Found</div>;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-primary/20 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary tracking-tight">{categoryInfo.label}</h1>
          <p className="text-muted-foreground mt-2 italic font-serif">
            Currently overseeing {entries.length} {entries.length === 1 ? 'manifest' : 'manifests'} in the archives.
          </p>
        </div>
        <Button onClick={() => setLocation(`/new?category=${categoryId}`)} className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add to {categoryInfo.label}
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-28 border-2 border-dashed border-primary/10 rounded-2xl bg-secondary/5">
          <h3 className="text-xl font-serif font-medium text-primary mb-3">This collection remains silent</h3>
          <p className="text-sm text-muted-foreground mb-8 italic max-w-md mx-auto">No records found for this sector. Initialize the archive to begin preservation.</p>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all" onClick={() => setLocation(`/new?category=${categoryId}`)}>
            Initialize Archive
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entries.map((entry) => (
            <Card 
              key={entry.id} 
              className="group cursor-pointer bg-card/40 border-primary/5 hover:border-primary/40 hover:bg-secondary/20 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
              onClick={() => setLocation(`/entry/${entry.id}`)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">{entry.title}</CardTitle>
                <div className="flex gap-2 flex-wrap mt-3">
                  {entry.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest font-bold bg-secondary/80 border border-primary/10 text-primary/80 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed italic font-serif opacity-70">
                  {entry.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
