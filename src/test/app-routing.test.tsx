import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./../pages/Index", () => ({
  default: () => <main id="main-content"><h1>Home mock</h1></main>,
}));
vi.mock("./../pages/Login", () => ({
  default: () => <main id="main-content"><h1>Login mock</h1></main>,
}));
vi.mock("./../pages/Dashboard", () => ({
  default: () => <main id="main-content"><h1>Dashboard mock</h1></main>,
}));
vi.mock("./../pages/Planos", () => ({
  default: () => <main id="main-content"><h1>Planos mock</h1></main>,
}));
vi.mock("./../pages/ConsignanteLogin", () => ({
  default: () => <main id="main-content"><h1>Consignante mock</h1></main>,
}));
vi.mock("./../pages/ConsignantePainel", () => ({
  default: () => <main id="main-content"><h1>Painel mock</h1></main>,
}));
vi.mock("./../pages/NotFound", () => ({
  default: () => <main id="main-content"><h1>404 mock</h1></main>,
}));
vi.mock("./../pages/Loja", () => ({
  default: () => <main id="main-content"><h1>Loja mock</h1></main>,
}));
vi.mock("./../pages/ProdutoLoja", () => ({
  default: () => <main id="main-content"><h1>Produto mock</h1></main>,
}));
vi.mock("./../pages/Checkout", () => ({
  default: () => <main id="main-content"><h1>Checkout mock</h1></main>,
}));
vi.mock("./../pages/CriarLoja", () => ({
  default: () => <main id="main-content"><h1>Criar loja mock</h1></main>,
}));
vi.mock("./../pages/PDVPage", () => ({
  default: () => <main id="main-content"><h1>PDV mock</h1></main>,
}));

import App from "@/App";

describe("App routing shell", () => {
  it("renderiza a aplicação com fallback acessível de lazy loading", async () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(screen.getByText(/carregando página/i)).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: /home mock/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pular para o conteúdo principal/i })).toBeInTheDocument();
  });
});
