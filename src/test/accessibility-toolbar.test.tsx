import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AccessibilityToolbar from "@/components/layout/AccessibilityToolbar";
import { AccessibilityProvider } from "@/hooks/use-accessibility";

const renderToolbar = () =>
  render(
    <BrowserRouter>
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>
    </BrowserRouter>,
  );

describe("AccessibilityToolbar", () => {
  it("renderiza skip link e abre o menu ao clicar no botão", () => {
    renderToolbar();

    expect(screen.getByRole("link", { name: /pular para o conteúdo principal/i })).toBeInTheDocument();

    const toggle = screen.getByRole("button", { name: /abrir menu de acessibilidade/i });
    fireEvent.click(toggle);

    expect(screen.getByRole("dialog", { name: /menu de acessibilidade/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /restaurar padrão/i })).toBeInTheDocument();
  });

  it("ajusta o tamanho da fonte pelos controles", () => {
    renderToolbar();

    const toggle = screen.getByRole("button", { name: /abrir menu de acessibilidade/i });
    fireEvent.click(toggle);

    const increaseButton = screen.getByRole("button", { name: /aumentar fonte/i });
    fireEvent.click(increaseButton);

    expect(document.documentElement.style.getPropertyValue("--user-font-size")).toBe("17px");
  });
});
