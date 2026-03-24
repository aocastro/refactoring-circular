import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { CartProvider } from "@/hooks/use-cart";
import { AccessibilityProvider } from "@/hooks/use-accessibility";
import AccessibilityToolbar from "@/components/layout/AccessibilityToolbar";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Planos = lazy(() => import("./pages/Planos"));
const ConsignanteLogin = lazy(() => import("./pages/ConsignanteLogin"));
const ConsignantePainel = lazy(() => import("./pages/ConsignantePainel"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Loja = lazy(() => import("./pages/Loja"));
const ProdutoLoja = lazy(() => import("./pages/ProdutoLoja"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CriarLoja = lazy(() => import("./pages/CriarLoja"));
const PDVPage = lazy(() => import("./pages/PDVPage"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <main id="main-content" tabIndex={-1} className="flex min-h-screen items-center justify-center bg-background px-4">
    <p className="text-sm text-muted-foreground" aria-live="polite">
      Carregando página...
    </p>
  </main>
);

const App = () => (
  <ThemeProvider>
    <AccessibilityProvider>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AccessibilityToolbar />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/planos" element={<Planos />} />
                  <Route path="/consignante" element={<ConsignanteLogin />} />
                  <Route path="/consignante/painel" element={<ConsignantePainel />} />
                  <Route path="/loja/:slug" element={<Loja />} />
                  <Route path="/loja/:slug/p/:id" element={<ProdutoLoja />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/criar-loja" element={<CriarLoja />} />
                  <Route path="/pdv/:id" element={<PDVPage />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </CartProvider>
    </AccessibilityProvider>
  </ThemeProvider>
);

export default App;
