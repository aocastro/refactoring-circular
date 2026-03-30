from playwright.sync_api import sync_playwright

def run_cuj(page):
    print("Navigating to app...")
    page.goto("http://localhost:8080/login")
    page.wait_for_timeout(1000)

    # 1. Login (Credentials are maria_demo@uorak.com / Senha@123 based on actual demo code)
    print("Logging in...")
    page.get_by_placeholder("E-mail ou Usuário").fill("maria_demo@uorak.com")
    page.wait_for_timeout(500)
    page.get_by_placeholder("Senha").fill("Senha@123")
    page.wait_for_timeout(500)
    page.get_by_role("button", name="Entrar", exact=True).click()
    page.wait_for_timeout(3000) # wait for dashboard load

    # Navigate to Vendas -> Produtos (Catalogo)
    print("Navigating to Catalogo...")
    # Make sure we're seeing the page load
    page.screenshot(path="/tmp/debug_dashboard.png")

    # In some Shadcn UI configurations the SidebarMenuButton creates an outer structure.
    # Use simpler locators:
    page.get_by_text("Venda").first.click()
    page.wait_for_timeout(500)
    page.screenshot(path="/tmp/debug_dashboard_open.png")
    # Click Produtos specifically (it might be in a submenu, wait for it)
    page.wait_for_selector("text=Produtos", state="visible", timeout=5000)
    page.get_by_text("Produtos").first.click()
    page.wait_for_timeout(2000)

    # Click "Novo Produto" Dropdown
    print("Opening Cadastro Dropdown...")
    page.get_by_role("button", name="Novo Produto").click()
    page.wait_for_timeout(1000)

    # --- Test 1: Cadastro de Produto Único ---
    print("Testing Cadastro Único...")
    page.get_by_role("menuitem", name="Cadastro de Produto Único").click()
    page.wait_for_timeout(1500)

    page.get_by_label("Nome do Produto").fill("Camiseta Teste Playwright")
    page.get_by_label("Código (SKU)").fill("CTP-001")
    page.get_by_label("Preço (R$)").fill("49.90")
    page.get_by_label("Estoque").fill("5")
    page.wait_for_timeout(500)

    # Submit Form
    page.get_by_role("button", name="Salvar Produto").click()
    page.wait_for_timeout(2000) # wait for success toast and refresh

    # --- Test 2: Cadastro em Massa ---
    print("Testing Cadastro em Massa...")
    page.get_by_role("button", name="Novo Produto").click()
    page.wait_for_timeout(500)
    page.get_by_role("menuitem", name="Cadastro em Massa").click()
    page.wait_for_timeout(1000)

    # Add a row
    page.get_by_role("button", name="Adicionar Linha").click()
    page.wait_for_timeout(500)

    # Fill row inputs (using generic placeholder strategy since it's a table)
    inputs = page.locator("td input")
    inputs.nth(0).fill("Calça Teste Massa") # Nome
    inputs.nth(1).fill("CTM-002") # SKU
    inputs.nth(2).fill("99.90") # Preco
    page.wait_for_timeout(500)

    page.get_by_role("button", name="Salvar Produtos").click()
    page.wait_for_timeout(2000)

    # Take final screenshot showing the new products in the grid
    page.screenshot(path="/tmp/verification.png")
    page.wait_for_timeout(1000)
    print("Done!")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/tmp/videos")
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
