import { Switch, Route } from "wouter";
import { WorldProvider } from "@/lib/world-context";
import { Layout } from "@/components/layout";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/dashboard";
import CategoryView from "@/pages/category-view";
import EntryView from "@/pages/entry-view";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/category/:id" component={CategoryView} />
        <Route path="/entry/:id" component={EntryView} />
        <Route path="/new" component={EntryView} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <WorldProvider>
      <Router />
      <Toaster />
    </WorldProvider>
  );
}

export default App;
