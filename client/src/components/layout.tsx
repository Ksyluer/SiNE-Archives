import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/types";
import { 
  Book, 
  Settings, 
  Search, 
  PlusCircle, 
  LayoutDashboard,
  Users,
  Map,
  Globe,
  Sparkles,
  Cpu,
  Clock,
  FileBox,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWorld } from "@/lib/world-context";

const IconMap: Record<string, any> = {
  Users, Map, Globe, Sparkles, Cpu, Clock, FileBox
};

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const { searchEntries } = useWorld();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    if (query.trim()) {
      setSearchResults(searchEntries(query));
    } else {
      setSearchResults([]);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-md shadow-[0_0_15px_rgba(200,160,50,0.3)]">
            <Book className="w-5 h-5" />
          </div>
          <h1 className="font-serif font-bold text-xl tracking-tight text-primary">SiNE Archives</h1>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <Link href="/">
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start font-medium transition-all duration-300",
                location === "/" ? "bg-secondary text-primary border-primary/20" : "hover:text-primary"
              )}
            >
              <LayoutDashboard className="mr-2 w-4 h-4" />
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-1">
          <h2 className="px-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3 opacity-50">
            Collections
          </h2>
          {CATEGORIES.map((cat) => {
            const Icon = IconMap[cat.icon];
            const isActive = location === `/category/${cat.id}`;
            return (
              <Link key={cat.id} href={`/category/${cat.id}`}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-300",
                    isActive ? "bg-secondary text-primary border-l-2 border-primary rounded-l-none" : "hover:text-primary"
                  )}
                >
                  <Icon className="mr-2 w-4 h-4" />
                  {cat.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button 
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_20px_rgba(200,160,50,0.1)]" 
          onClick={() => setLocation("/new")}
        >
          <PlusCircle className="mr-2 w-4 h-4" />
          New Archive
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground dark">
      <aside className="hidden md:block w-64 h-full shrink-0">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="border-primary/30 text-primary">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r border-sidebar-border bg-sidebar">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--color-muted)_0%,_transparent_40%)]">
        <header className="h-16 border-b border-border/50 flex items-center px-6 gap-4 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary/50" />
            <Input
              placeholder="Search the archives..."
              className="pl-9 bg-secondary/30 border-primary/10 focus:bg-secondary/50 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
              value={search}
              onChange={handleSearch}
            />
            {search && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-popover border border-primary/20 rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-2 z-50 max-h-60 overflow-y-auto">
                {searchResults.map(entry => (
                  <div 
                    key={entry.id} 
                    className="p-2 hover:bg-secondary hover:text-primary rounded cursor-pointer text-sm transition-colors"
                    onClick={() => {
                      setLocation(`/entry/${entry.id}`);
                      setSearch("");
                      setSearchResults([]);
                    }}
                  >
                    <div className="font-medium">{entry.title}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{entry.category === 'magic' ? 'Redactory' : entry.category}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
