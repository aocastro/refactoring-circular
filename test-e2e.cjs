const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. Navigate and Login
    await page.goto('http://localhost:8080/login');
    // Wait for the login form to appear
    await page.waitForSelector('input[placeholder="E-mail ou Usuário"]', { timeout: 10000 });
    await page.fill('input[placeholder="E-mail ou Usuário"]', 'maria_demo@uorak.com');
    await page.fill('input[placeholder="Senha"]', 'Senha@123');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL('**/dashboard');

    // 2. Open Catalog
    // Expand Venda
    await page.click('button:has-text("Venda")');

    // Wait for dropdown to open and click Produtos
    await page.waitForSelector('text=Produtos');
    // We use nth(0) in case there are multiple, but it should be inside the Venda menu
    await page.locator('button:has-text("Produtos")').click();

    await page.waitForSelector('text=Novo Produto');

    // 3. Open Express Product Modal
    await page.click('text=Novo Produto');
    await page.click('text=Cadastro Express');
    await page.waitForSelector('text=Cadastro de Produto Express');
    await page.screenshot({ path: 'step1.png' });

    // 4. Fill form step 1

    await page.fill('input[placeholder="Ex: Vestido Floral"]', 'Vestido Floral');

    // Store
    await page.click('button[role="combobox"]:has-text("Selecione uma loja")');
    await page.click('div[role="option"]:has-text("Loja 1")');

    // Category
    await page.click('button[role="combobox"]:has-text("Selecione uma categoria")');
    // Select the one in the dropdown (which is outside the modal in the DOM but has role="option")
    await page.click('div[role="option"]:has-text("Roupas")');

    // Subcategory
    await page.click('button[role="combobox"]:has-text("Selecione uma subcategoria")');
    await page.click('div[role="option"]:has-text("Feminino")');

    // Price and quantity
    await page.fill('input[placeholder="Ex: 150,00"]', '120.00');

    // Set quantity > 1 to trigger step 2
    await page.fill('input[type="number"]', '5');

    // 5. Submit step 1 and move to step 2
    await page.click('button:has-text("Continuar")');
    await page.waitForSelector('text=Como você quer organizar esse estoque?');
    await page.screenshot({ path: 'step2.png' });

    // Select identical stock
    await page.click('text=Tudo o mesmo produto');

    // 6. Submit step 2
    await page.click('button:has-text("Salvar Produto")');

    // 7. Wait for success step (step 3)
    await page.waitForSelector('text=Pronto! Produto cadastrado.');
    await page.screenshot({ path: 'step3.png' });

    // 8. Wait for dashboard view verification
    await page.click('button:has-text("Ir para Catálogo")');
    await page.waitForSelector('text=Novo Produto');
    await page.screenshot({ path: 'verification.png' });

    console.log('E2E Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
})();
