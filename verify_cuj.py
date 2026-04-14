from playwright.sync_api import sync_playwright
import time
import os

def run_cuj(page):
    page.goto("http://localhost:8080/login")
    page.wait_for_timeout(2000)

    # Fill email
    page.locator("#login-email").fill("maria_demo@uorak.com")
    page.locator("#login-password").fill("Senha@123")
    page.get_by_role("button", name="Entrar", exact=True).click()
    page.wait_for_timeout(3000)

    # Click Funcionários
    page.get_by_role("button", name="Funcionários", exact=True).click()
    page.wait_for_timeout(2000)

    # Click Novo Funcionário
    page.get_by_role("button", name="Novo Funcionário").click()
    page.wait_for_timeout(1000)

    # Take screenshot of the admin dialogue opening with permissions
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

    # Close dialogue
    page.keyboard.press("Escape")
    page.wait_for_timeout(1000)

    # Logout
    page.get_by_label("Sair da conta").click()
    page.wait_for_timeout(3000)

    # Re-navigate just in case
    page.goto("http://localhost:8080/login")
    page.wait_for_timeout(2000)

    # Fill employee email
    page.locator("#login-email").fill("carlos@loja.com")
    page.locator("#login-password").fill("Senha@123")
    page.get_by_role("button", name="Entrar", exact=True).click()
    page.wait_for_timeout(3000)

    # Should only see partial menu
    page.screenshot(path="/home/jules/verification/screenshots/employee.png")
    page.wait_for_timeout(2000)

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={'width': 1280, 'height': 720}
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
