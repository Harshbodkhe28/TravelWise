import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ExplorePage from "@/pages/explore-page";
import MyTripsPage from "@/pages/my-trips-page";
import MessagesPage from "@/pages/messages-page";
import AgencyDashboard from "@/pages/agency-dashboard";
import PackageComparison from "@/pages/package-comparison";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/explore" component={ExplorePage} />
          <ProtectedRoute path="/my-trips" component={MyTripsPage} />
          <ProtectedRoute path="/messages" component={MessagesPage} />
          <ProtectedRoute path="/agency-dashboard" component={AgencyDashboard} />
          <ProtectedRoute path="/compare/:preferenceId" component={PackageComparison} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
