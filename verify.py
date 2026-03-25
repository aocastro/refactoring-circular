from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(record_video_dir="videos/")
        page = context.new_page()

        page.goto("http://localhost:8082/login")
        page.wait_for_load_state("networkidle")

        page.wait_for_selector("text=Demo: maria_demo@uorak.com / Senha@123", timeout=10000)
        page.locator("button", has_text="Demo:").click()
        page.locator("button[type='submit']").click()
        page.wait_for_url("**/dashboard")
        page.wait_for_load_state("networkidle")

        page.locator("button:has-text('Venda')").first.click()
        page.wait_for_timeout(500)
        page.locator("button:has-text('Subestoques')").click()
        page.wait_for_timeout(1500)

        # Click on the card itself to expand it
        # Cards have the title "Arara Principal" for example
        card = page.locator("h3:has-text('Arara Principal')").first
        if card.count() > 0:
            card.click()
            page.wait_for_timeout(1500)
            page.screenshot(path="dashboard_subestoques_expanded.png", full_page=True)

            # Click Adicionar Produto
            add_product = page.locator("button:has-text('Adicionar Produto')")
            if add_product.count() > 0:
                add_product.first.click()
                page.wait_for_timeout(1000)
                page.screenshot(path="dashboard_subestoques_add_modal.png", full_page=True)
                page.keyboard.press("Escape")
                page.wait_for_timeout(500)

            # Click Edit Produto (Edit2 icon inside the expanded view table rows)
            # Find the first row in the table with an Edit2 icon or by title 'Editar'
            # Let's just screenshot the expanded view and the add modal which are the main changes

        context.close()
        browser.close()

verify()
