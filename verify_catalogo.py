import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 720})
        page = await context.new_page()

        print("Navigating to http://localhost:8081/login")
        await page.goto("http://localhost:8081/login", wait_until="networkidle")

        print("Filling login form...")
        await page.fill("#login-email", "maria_demo@uorak.com")
        await page.fill("#login-password", "Senha@123")

        print("Clicking Entrar button...")
        await page.click("button:has-text('Entrar')")

        print("Waiting for Dashboard to load...")
        await page.wait_for_selector("text=Dashboard", timeout=10000)

        print("Clicking Venda menu...")
        await page.click("text=Venda", strict=False)
        await page.wait_for_timeout(1000)

        print("Clicking Produtos or Catálogo...")
        try:
            await page.click("text=Catálogo", strict=False, timeout=3000)
        except:
            await page.click("text=Produtos", strict=False, timeout=3000)

        print("Waiting for datatable to load...")
        await page.wait_for_selector("table", timeout=10000)

        print("Taking datatable screenshot...")
        await page.screenshot(path="catalogo_datatable.png")

        print("Toggling columns...")
        # A dropdown trigger for columns is usually named 'Colunas'
        await page.click("button:has-text('Colunas')")
        await page.wait_for_timeout(1000)

        print("Taking columns screenshot...")
        await page.screenshot(path="catalogo_colunas.png")

        print("Done!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
