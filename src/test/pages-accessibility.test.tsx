import { AccessibilityProvider } from "@/hooks/use-accessibility";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Planos from "@/pages/Planos";
import Dashboard from "@/pages/Dashboard";

vi.mock("@/components/landing/HeroSection", () => ({ default: () => <section aria-labelledby="hero-heading"><h1 id="hero-heading">Hero</h1></section> }));
vi.mock("@/components/landing/FeaturesSection", () => ({ default: () => <section><h2>Features</h2></section> }));
vi.mock("@/components/landing/PainPointsSection", () => ({ default: () => <section><h2>Pain points</h2></section> }));
vi.mock("@/components/landing/ModulesSection", () => ({ default: () => <section><h2>Modules</h2></section> }));
vi.mock("@/components/landing/SolutionsSection", () => ({ default: () => <section><h2>Solutions</h2></section> }));
vi.mock("@/components/landing/StoreShowcaseSection", () => ({ default: () => <section><h2>Store</h2></section> }));
vi.mock("@/components/landing/GrowthSection", () => ({ default: () => <section><h2>Growth</h2></section> }));
vi.mock("@/components/landing/ESGSection", () => ({ default: () => <section><h2>ESG</h2></section> }));
vi.mock("@/components/landing/TestimonialsSection", () => ({ default: () => <section><h2>Testimonials</h2></section> }));
vi.mock("@/components/landing/FAQSection", () => ({ default: () => <section><h2>FAQ</h2></section> }));
vi.mock("@/components/landing/CTASection", () => ({ default: () => <section><h2>CTA</h2></section> }));
vi.mock("@/components/dashboard/DashboardSidebar", () => ({ DashboardSidebar: () => <nav aria-label="Navegação principal do dashboard">Sidebar</nav> }));
vi.mock("@/components/dashboard/NotificationsDropdown", () => ({ default: () => <button type="button">Notificações</button> }));
vi.mock("@/components/ui/sidebar", async () => {
  const actual = await vi.importActual<typeof import("@/components/ui/sidebar")>("@/components/ui/sidebar");
  return {
    ...actual,
    SidebarProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarTrigger: () => <button type="button">Abrir sidebar</button>,
  };
});
vi.mock("@/components/dashboard/DashboardContent", () => ({ default: () => <section><h2>Dashboard content</h2></section> }));

const renderRoute = (ui: React.ReactNode, path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AccessibilityProvider>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
      </AccessibilityProvider>
      </MemoryRouter>,
  );

describe("Acessibilidade das páginas principais", () => {
  it("Home renderiza landmark principal", () => {
    renderRoute(<Index />);
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("Login renderiza heading principal e formulário", () => {
    renderRoute(<Login />, "/login");
    expect(screen.getByRole("heading", { level: 1, name: /Bem vindo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^entrar$/i })).toBeInTheDocument();
  });

  it("Planos renderiza heading principal e tabela comparativa", () => {
    renderRoute(<Planos />, "/planos");
    expect(screen.getByRole("heading", { level: 1, name: /planos de assinatura/i })).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("Dashboard renderiza main e heading focável da seção", async () => {
    localStorage.setItem("user", JSON.stringify({ name: "Maria", email: "maria@email.com" }));
    renderRoute(<Dashboard />, "/dashboard");
    expect(await screen.findByRole("heading", { level: 1, name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });
});
