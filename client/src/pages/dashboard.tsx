import { useWorld } from "@/lib/world-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Clock, Tag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { entries } = useWorld();
  const [, setLocation] = useLocation();

  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const wordCount = entries.reduce((acc, entry) => acc + entry.content.split(/\s+/).length, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Welcome back, Archivist.</h1>
          <p className="text-muted-foreground mt-1">Your world is growing.</p>
        </div>
        <Button onClick={() => setLocation("/new")} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Entry
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Words Written</CardTitle>
            <Tag className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wordCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Update</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entries.length > 0 
                ? formatDistanceToNow(new Date(entries[0].updatedAt), { addSuffix: true }) 
                : "Never"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-semibold">Recent Entries</h2>
            <Button variant="link" onClick={() => setLocation("/category/misc")}>View all</Button>
          </div>
          
          <div className="space-y-4">
            {recentEntries.length === 0 ? (
              <div className="text-center py-12 border rounded-lg border-dashed bg-secondary/20">
                <p className="text-muted-foreground">No entries yet. Start writing!</p>
              </div>
            ) : (
              recentEntries.map((entry) => (
                <div 
                  key={entry.id}
                  onClick={() => setLocation(`/entry/${entry.id}`)}
                  className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer hover:border-primary/20"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                        {entry.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.updatedAt))} ago
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold group-hover:text-primary transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {entry.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dashboard Image / Inspiration */}
        <div className="md:col-span-1">
          <div className="rounded-xl overflow-hidden border bg-sidebar p-1 shadow-sm h-full max-h-[400px]">
            <div className="relative w-full h-full bg-secondary/30 rounded-lg overflow-hidden flex items-center justify-center">
               <img 
                 src="/images/world-placeholder.png" 
                 alt="World Map" 
                 className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transform"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                 <p className="text-white font-serif italic text-sm">
                   "Every world begins with a single thought."
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
