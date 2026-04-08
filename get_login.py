import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:8081/login", wait_until="networkidle")
        content = await page.content()
        with open("login_content.html", "w") as f:
            f.write(content)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
