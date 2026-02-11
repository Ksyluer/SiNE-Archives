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

  if (!categoryInfo) return <div>Category not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold capitalize">{categoryInfo.label}</h1>
          <p className="text-muted-foreground mt-2">
            Cataloging {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <Button onClick={() => setLocation(`/new?category=${categoryId}`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add {categoryInfo.label}
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">This collection is empty</h3>
          <p className="text-sm text-muted-foreground mb-6">Start building your world by adding a new {categoryInfo.label.toLowerCase()}.</p>
          <Button variant="secondary" onClick={() => setLocation(`/new?category=${categoryId}`)}>
            Create First Entry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <Card 
              key={entry.id} 
              className="group cursor-pointer hover:shadow-md transition-all hover:border-primary/30"
              onClick={() => setLocation(`/entry/${entry.id}`)}
            >
              <CardHeader>
                <CardTitle className="font-serif text-xl">{entry.title}</CardTitle>
                <div className="flex gap-2 flex-wrap mt-2">
                  {entry.tags.map(tag => (
                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
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
