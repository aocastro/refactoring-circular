import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 720},
            record_video_dir="/home/jules/verification/videos",
            record_video_size={'width': 1280, 'height': 720}
        )
        page = await context.new_page()

        try:
            print("Navigating to login...")
            await page.goto("http://localhost:8080/login")

            print("Logging in...")
            await page.fill("#login-email", "maria_demo@uorak.com")
            await page.fill("#login-password", "Senha@123")
            await page.click("button:has-text('Entrar')")

            print("Waiting for dashboard...")
            await page.wait_for_selector("text=Dashboard", state="visible")
            await page.wait_for_timeout(1000)

            print("Navigating to Funcionários...")
            await page.evaluate("() => { const el = Array.from(document.querySelectorAll('span')).find(e => e.textContent === 'Funcionários'); if (el) el.closest('button').click(); }")

            print("Waiting for Funcionários content...")
            await page.wait_for_selector("h2:has-text('Funcionários')")

            print("Clicking edit button for first employee...")
            await page.evaluate("() => { const card = Array.from(document.querySelectorAll('.rounded-xl')).find(c => c.textContent.includes('Juliana Mendes')); if (card) { const btns = card.querySelectorAll('button'); if (btns.length > 0) btns[0].click(); } }")

            print("Waiting for dialog...")
            await page.wait_for_selector("text=Editar Funcionário")

            print("Editing details...")
            await page.fill("input[placeholder='Nome completo']", "Juliana Mendes - Editado")
            await page.click("button[role='combobox']:has-text('ativo')")
            await page.click("div[role='option']:has-text('inativo')")
            await page.click("button[id='perm-pdv']")
            await page.click("button[id='perm-clientes']")

            print("Saving changes...")
            await page.click("button:has-text('Salvar Alterações')")

            print("Waiting for dialog to close and changes to reflect...")
            await page.wait_for_selector("text=Juliana Mendes - Editado")
            # The word inativo is rendered in the badge
            await page.wait_for_selector("text=inativo")
            await page.screenshot(path="/home/jules/verification/screenshots/final.png")

            print("Verification successful!")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="/home/jules/verification/screenshots/debug_error.png")
            raise
        finally:
            await context.close()
            await browser.close()

asyncio.run(run())
