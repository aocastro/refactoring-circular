import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock localStorage with a valid user
beforeEach(() => {
  Storage.prototype.getItem = vi.fn((key: string) => {
    if (key === "user") return JSON.stringify({ name: "Test", email: "test@test.com" });
    return null;
  });
});

// Lazy-import Dashboard so localStorage mock is in place
const renderDashboard = async () => {
  const { default: Dashboard } = await import("@/pages/Dashboard");
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Dashboard />
    </MemoryRouter>,
  );
};

describe("Dashboard heading hierarchy", () => {
  it("renders exactly one h1 element", async () => {
    await renderDashboard();
    await waitFor(() => {
      const h1s = screen.getAllByRole("heading", { level: 1 });
      expect(h1s).toHaveLength(1);
    });
  });

  it("h1 matches the current section label", async () => {
    await renderDashboard();
    await waitFor(() => {
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Dashboard");
    });
  });

  it("sub-content headings use h2 or lower, never h1", async () => {
    await renderDashboard();
    await waitFor(() => {
      const allHeadings = screen.getAllByRole("heading");
      const h1s = allHeadings.filter((h) => h.tagName === "H1");
      expect(h1s).toHaveLength(1);
      expect(h1s[0].id).toBe("dashboard-section-heading");
    });
  });

  it("has a main landmark", async () => {
    await renderDashboard();
    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });
});
