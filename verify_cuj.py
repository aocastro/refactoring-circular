import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Using a fixed viewport size to ensure consistency and visibility
        page = await browser.new_page(viewport={"width": 1280, "height": 800})

        try:
            print("Navigating to http://localhost:8080/login...")
            await page.goto("http://localhost:8080/login", wait_until="networkidle")

            # Wait a bit for React to fully mount and render the form
            await page.wait_for_timeout(2000)

            # Use the demo credentials button to login quickly
            print("Clicking demo credentials button...")
            await page.click('button:has-text("Demo:")')

            # Click the submit button
            print("Clicking submit...")
            await page.click('button[type="submit"]')

            # Wait for dashboard to load
            print("Waiting for dashboard...")
            await page.wait_for_url("**/dashboard", timeout=10000)
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(2000) # Let dashboard fully render

            # Instead of PDV, click Venda dropdown
            print("Clicking 'Venda'...")
            # Use get_by_text for exact matching
            await page.get_by_text("Venda", exact=True).first.click()

            await page.wait_for_timeout(1000)

            # Now click Produtos
            print("Clicking 'Produtos'...")
            await page.get_by_text("Produtos", exact=True).first.click()

            # Wait for Produtos (CatalogoContent) to load
            print("Waiting for Produtos page...")
            await page.wait_for_selector('text="Catálogo"', timeout=10000)
            await page.wait_for_timeout(2000)

            print("Clicking 'Novo Produto' dropdown menu...")
            await page.get_by_role("button", name="Novo Produto").click()

            await page.wait_for_timeout(1000)

            print("Clicking 'Cadastro Express'...")
            await page.get_by_text("Cadastro Express").first.click()

            # Wait for Express Product Page
            print("Waiting for Express Product page...")
            await page.wait_for_selector('text="Cadastro Express"', timeout=10000)
            await page.wait_for_timeout(2000)

            screenshot_path = os.path.join(os.getcwd(), 'verification', 'screenshots', 'express_product_page.png')
            os.makedirs(os.path.dirname(screenshot_path), exist_ok=True)
            await page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"Error during execution: {e}")
            error_path = os.path.join(os.getcwd(), 'verification', 'screenshots', 'error9.png')
            await page.screenshot(path=error_path)
            print(f"Error screenshot saved to {error_path}.")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
