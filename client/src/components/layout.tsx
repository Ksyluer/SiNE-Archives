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

// Map string icon names to components
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
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-md">
            <Book className="w-5 h-5" />
          </div>
          <h1 className="font-serif font-bold text-xl tracking-tight">Codex</h1>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <Link href="/">
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              className="w-full justify-start font-medium"
            >
              <LayoutDashboard className="mr-2 w-4 h-4" />
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-1">
          <h2 className="px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            Collections
          </h2>
          {CATEGORIES.map((cat) => {
            const Icon = IconMap[cat.icon];
            const isActive = location === `/category/${cat.id}`;
            return (
              <Link key={cat.id} href={`/category/${cat.id}`}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
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
        <Button className="w-full" onClick={() => setLocation("/new")}>
          <PlusCircle className="mr-2 w-4 h-4" />
          New Entry
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-full shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Search Bar */}
        <header className="h-16 border-b flex items-center px-6 gap-4 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search the archives..."
              className="pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-input transition-all"
              value={search}
              onChange={handleSearch}
            />
            {search && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-popover border rounded-md shadow-lg p-2 z-50 max-h-60 overflow-y-auto">
                {searchResults.map(entry => (
                  <div 
                    key={entry.id} 
                    className="p-2 hover:bg-accent rounded cursor-pointer text-sm"
                    onClick={() => {
                      setLocation(`/entry/${entry.id}`);
                      setSearch("");
                      setSearchResults([]);
                    }}
                  >
                    <div className="font-medium">{entry.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{entry.category}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-5xl mx-auto w-full animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
