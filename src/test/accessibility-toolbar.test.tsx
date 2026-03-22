import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AccessibilityToolbar from "@/components/layout/AccessibilityToolbar";
import Navbar from "@/components/layout/Navbar";
import { AccessibilityProvider } from "@/hooks/use-accessibility";
import { ThemeProvider } from "@/hooks/use-theme";

const renderWithProviders = () =>
  render(
    <BrowserRouter>
      <ThemeProvider>
        <AccessibilityProvider>
          <AccessibilityToolbar />
          <Navbar />
        </AccessibilityProvider>
      </ThemeProvider>
    </BrowserRouter>,
  );

describe("AccessibilityToolbar", () => {
  it("renderiza skip link e abre o menu ao clicar no botão de acessibilidade no header", () => {
    renderWithProviders();

    expect(screen.getByRole("link", { name: /pular para o conteúdo principal/i })).toBeInTheDocument();

    const toggles = screen.getAllByRole("button", { name: /abrir menu de acessibilidade/i });
    fireEvent.click(toggles[0]);

    expect(screen.getByRole("dialog", { name: /menu de acessibilidade/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /restaurar padrão/i })).toBeInTheDocument();
  });

  it("ajusta o tamanho da fonte pelos controles de zoom no header", () => {
    renderWithProviders();

    const increaseButtons = screen.getAllByRole("button", { name: /aumentar fonte/i });
    fireEvent.click(increaseButtons[0]);

    expect(document.documentElement.style.getPropertyValue("--user-font-size")).toBe("17px");
  });
});
