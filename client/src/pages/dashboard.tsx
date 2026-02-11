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

  const wordCount = entries.reduce((acc, entry) => acc + (entry.content ? entry.content.split(/\s+/).length : 0), 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif font-bold text-primary tracking-tight">SiNE Archives</h1>
          <p className="text-muted-foreground italic font-serif">Welcome back, Archivist. Your secrets remain secure.</p>
        </div>
        <Button onClick={() => setLocation("/new")} className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_20px_rgba(200,160,50,0.2)] px-6">
          <Plus className="w-4 h-4 mr-2" />
          Create Archive
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/40 border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Archives Cataloged</CardTitle>
            <BookOpen className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-primary">{entries.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/40 border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chronicle Length</CardTitle>
            <Tag className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-primary">{wordCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/40 border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Revision</CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-primary">
              {entries.length > 0 
                ? formatDistanceToNow(new Date(entries[0].updatedAt), { addSuffix: true }) 
                : "Awaiting Input"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
            <h2 className="text-2xl font-serif font-semibold text-primary">Recent Manifests</h2>
            <Button variant="link" className="text-primary hover:text-primary/70" onClick={() => setLocation("/category/misc")}>Review all</Button>
          </div>
          
          <div className="space-y-6">
            {recentEntries.length === 0 ? (
              <div className="text-center py-16 border rounded-xl border-dashed border-primary/20 bg-secondary/10">
                <p className="text-muted-foreground italic font-serif">The archives are currently empty. Begin the cataloging process.</p>
              </div>
            ) : (
              recentEntries.map((entry) => (
                <div 
                  key={entry.id}
                  onClick={() => setLocation(`/entry/${entry.id}`)}
                  className="group relative flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-primary/5 bg-card/60 hover:bg-secondary/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all cursor-pointer hover:border-primary/30"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-secondary border border-primary/20 text-primary">
                        {entry.category === 'magic' ? 'Redactory' : entry.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {formatDistanceToNow(new Date(entry.updatedAt))} ago
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold group-hover:text-primary transition-colors text-foreground">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 italic font-serif opacity-80">
                      {entry.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="rounded-xl overflow-hidden border border-primary/20 bg-sidebar p-2 shadow-2xl h-full max-h-[450px]">
            <div className="relative w-full h-full bg-secondary rounded-lg overflow-hidden flex items-center justify-center group">
               <img 
                 src="/images/world-placeholder.png" 
                 alt="World Map" 
                 className="object-cover w-full h-full opacity-30 group-hover:opacity-50 transition-all duration-1000 group-hover:scale-110 transform grayscale hover:grayscale-0"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex items-end p-8">
                 <p className="text-primary font-serif italic text-sm leading-relaxed border-l-2 border-primary pl-4">
                   "To archive is to preserve the fragment against the tide of oblivion."
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
