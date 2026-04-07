const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  page.on('response', response => console.log('RESPONSE:', response.url(), response.status()));

  try {
    await page.goto('http://localhost:8080/login');
    await page.waitForSelector('input[placeholder="E-mail ou Usuário"]', { timeout: 10000 });
    await page.fill('input[placeholder="E-mail ou Usuário"]', 'maria_demo@uorak.com');
    await page.fill('input[placeholder="Senha"]', 'Senha@123');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL('**/dashboard');

    await page.click('button:has-text("Venda")');
    await page.waitForSelector('text=Produtos');
    await page.locator('button:has-text("Produtos")').click();

    await page.waitForSelector('text=Novo Produto');
    await page.click('text=Novo Produto');
    await page.click('text=Cadastro Express');
    await page.waitForSelector('text=Cadastro de Produto Express');

    await page.fill('input[placeholder="Ex: Vestido Floral"]', 'Vestido Floral');

    await page.click('button[role="combobox"]:has-text("Selecione uma loja")');
    await page.click('div[role="option"]:has-text("Loja 1")');

    await page.click('button[role="combobox"]:has-text("Selecione uma categoria")');
    await page.click('div[role="option"]:has-text("Roupas")');

    await page.click('button[role="combobox"]:has-text("Selecione uma subcategoria")');
    await page.click('div[role="option"]:has-text("Feminino")');

    await page.fill('input[placeholder="Ex: 150,00"]', '120.00');
    await page.fill('input[type="number"]', '5');

    await page.click('button:has-text("Continuar")');
    await page.waitForSelector('text=Como você quer organizar esse estoque?');

    await page.click('text=Tudo o mesmo produto');

    console.log("Submitting step 2...");
    await page.click('button:has-text("Salvar Produto")');

    // wait a bit and see logs
    await page.waitForTimeout(5000);

    console.log("Checking if success text exists");
    await page.waitForSelector('text=Pronto! Produto cadastrado.', {timeout: 5000});

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();
