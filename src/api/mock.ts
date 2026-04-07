import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { initialSubStocks } from '../data/dashboard';
import { adminKpis, adminMrrHistory, adminChurnHistory, adminLtvByPlan, adminPlans, adminStores, adminUsers, adminFinancial, adminRevenueByPlan, adminMonthlyRevenue, adminEsg, adminEsgMonthly, blockchainStats, blockchainTransactions, adminNpsStats, adminNpsHistory, adminNpsResponses } from '../data/admin';
import { mockClientes, mockPurchaseHistory } from '../data/clientes';
import { mockConsignantes, mockContracts } from '../data/consignacao';
import { mockCupons } from '../data/cupons';
import { dashboardKpisByPeriod, revenueData, salesByCategory, recentSales, abcData, abcProductsData } from '../data/dashboard';
import { cashFlowData, paymentMethods, recentPayments, esgMonthly } from '../data/financeiro';
import { mockNotifications } from '../data/notifications';
import { mockProducts, mockPDVSales } from '../data/products';
import { mockStore, storeProducts } from '../data/store';
import { mockTickets, adminSuporteKpis, adminTicketsVolume, adminTicketsByCategory } from '../data/suporte';
import { initialLinktrees } from '../data/linktree';
import { initialMarcas, initialCategorias } from '../data/marcasCategorias';

const mock = new MockAdapter(axios, { delayResponse: 500 });

let subStocks = [...initialSubStocks];
const linktrees = [...initialLinktrees];
let marcasList = [...initialMarcas];
let categoriasList = [...initialCategorias];

// --- Marcas ---
mock.onGet('/api/marcas').reply(() => [200, marcasList.filter(m => m.status === 'Ativo')]);
mock.onGet('/api/admin/marcas').reply(() => [200, marcasList]);
mock.onPost('/api/admin/marcas').reply((config) => {
  const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  const newMarca = {
    id: marcasList.length ? Math.max(...marcasList.map(m => m.id)) + 1 : 1,
    nome: data.nome,
    status: data.status || 'Ativo',
  };
  marcasList.push(newMarca);
  return [201, newMarca];
});
mock.onPut(/\/api\/admin\/marcas\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!);
  const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  marcasList = marcasList.map(m => m.id === id ? { ...m, ...data } : m);
  return [200, marcasList.find(m => m.id === id)];
});
mock.onDelete(/\/api\/admin\/marcas\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!);
  marcasList = marcasList.filter(m => m.id !== id);
  return [200, { success: true }];
});

// --- Categorias ---
mock.onGet('/api/categorias').reply(() => [200, categoriasList.filter(c => c.status === 'Ativo')]);
mock.onGet('/api/admin/categorias').reply(() => [200, categoriasList]);
mock.onPost('/api/admin/categorias').reply((config) => {
  const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  const newCategoria = {
    id: categoriasList.length ? Math.max(...categoriasList.map(c => c.id)) + 1 : 1,
    nome: data.nome,
    status: data.status || 'Ativo',
  };
  categoriasList.push(newCategoria);
  return [201, newCategoria];
});
mock.onPut(/\/api\/admin\/categorias\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!);
  const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  categoriasList = categoriasList.map(c => c.id === id ? { ...c, ...data } : c);
  return [200, categoriasList.find(c => c.id === id)];
});
mock.onDelete(/\/api\/admin\/categorias\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!);
  categoriasList = categoriasList.filter(c => c.id !== id);
  return [200, { success: true }];
});

// Mock GET /api/subestoques
mock.onGet('/api/subestoques').reply(() => {
  return [200, subStocks];
});

// Mock POST /api/subestoques
mock.onPost('/api/subestoques').reply((config) => {
  const newStock = JSON.parse(config.data);
  const stockToAdd = {
    ...newStock,
    id: Date.now(),
    status: 'Ativo',
    products: newStock.products || []
  };
  subStocks.push(stockToAdd);
  return [201, stockToAdd];
});

// Mock PUT /api/subestoques/:id
mock.onPut(/\/api\/subestoques\/\d+/).reply((config) => {
  const url = config.url || '';
  const idStr = url.split('/').pop();
  if (idStr) {
    const id = parseInt(idStr, 10);
    const updatedStock = JSON.parse(config.data);
    const index = subStocks.findIndex(s => s.id === id);
    if (index !== -1) {
      subStocks[index] = { ...subStocks[index], ...updatedStock };
      return [200, subStocks[index]];
    }
  }
  return [400];
});

// Mock DELETE /api/subestoques/:id
mock.onDelete(/\/api\/subestoques\/\d+/).reply((config) => {
  const url = config.url || '';
  const idStr = url.split('/').pop();
  if (idStr) {
    const id = parseInt(idStr, 10);
    subStocks = subStocks.filter(s => s.id !== id);
    return [200, { success: true }];
  }
  return [400];
});

mock.onGet('/api/admin/kpis').reply(() => [200, adminKpis]);
mock.onGet('/api/admin/mrr-history').reply(() => [200, adminMrrHistory]);
mock.onGet('/api/admin/churn-history').reply(() => [200, adminChurnHistory]);
mock.onGet('/api/admin/ltv-by-plan').reply(() => [200, adminLtvByPlan]);
const mutableAdminPlans = [...adminPlans];
const mutableAdminStores = [...adminStores];
const mutableAdminUsers = [...adminUsers];

mock.onGet('/api/admin/plans').reply(() => [200, mutableAdminPlans]);
mock.onPost('/api/admin/plans').reply((config) => {
  const newPlan = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  const planToAdd = {
    ...newPlan,
    id: Date.now(),
    status: newPlan.status || 'ativo',
    subscribers: 0,
  };
  mutableAdminPlans.push(planToAdd);
  return [201, planToAdd];
});
mock.onPut(/\/api\/admin\/plans\/\d+/).reply((config) => {
  const url = config.url || '';
  const idStr = url.split('/').pop();
  if (idStr) {
    const id = parseInt(idStr, 10);
    const updatedPlan = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const index = mutableAdminPlans.findIndex(p => p.id === id);
    if (index !== -1) {
      mutableAdminPlans[index] = { ...mutableAdminPlans[index], ...updatedPlan };
      return [200, mutableAdminPlans[index]];
    }
  }
  return [404, { message: 'Plano não encontrado' }];
});

mock.onGet('/api/admin/stores').reply(() => [200, mutableAdminStores]);
mock.onPut(/\/api\/admin\/stores\/\d+\/status/).reply((config) => {
  const url = config.url || '';
  const parts = url.split('/');
  const idStr = parts[parts.length - 2];
  if (idStr) {
    const id = parseInt(idStr, 10);
    const { status } = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const index = mutableAdminStores.findIndex(s => s.id === id);
    if (index !== -1) {
      mutableAdminStores[index] = { ...mutableAdminStores[index], status };
      return [200, mutableAdminStores[index]];
    }
  }
  return [404, { message: 'Loja não encontrada' }];
});

mock.onGet('/api/admin/users').reply(() => [200, mutableAdminUsers]);
mock.onPut(/\/api\/admin\/users\/\d+\/status/).reply((config) => {
  const url = config.url || '';
  const parts = url.split('/');
  const idStr = parts[parts.length - 2];
  if (idStr) {
    const id = parseInt(idStr, 10);
    const { status } = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const index = mutableAdminUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mutableAdminUsers[index] = { ...mutableAdminUsers[index], status };
      return [200, mutableAdminUsers[index]];
    }
  }
  return [404, { message: 'Usuário não encontrado' }];
});
mock.onGet('/api/admin/financial').reply(() => [200, adminFinancial]);
mock.onGet('/api/admin/revenue-by-plan').reply(() => [200, adminRevenueByPlan]);
mock.onGet('/api/admin/monthly-revenue').reply(() => [200, adminMonthlyRevenue]);
mock.onGet('/api/admin/esg').reply(() => [200, adminEsg]);
mock.onGet('/api/admin/esg-monthly').reply(() => [200, adminEsgMonthly]);
mock.onGet('/api/admin/blockchain-stats').reply(() => [200, blockchainStats]);
mock.onGet('/api/admin/blockchain-transactions').reply(() => [200, blockchainTransactions]);
mock.onGet('/api/admin/nps-stats').reply(() => [200, adminNpsStats]);
mock.onGet('/api/admin/nps-history').reply(() => [200, adminNpsHistory]);
mock.onGet('/api/admin/nps-responses').reply(() => [200, adminNpsResponses]);
mock.onGet('/api/clientes').reply(() => [200, mockClientes]);
mock.onGet('/api/clientes/purchase-history').reply(() => [200, mockPurchaseHistory]);
mock.onGet('/api/consignacao/consignantes').reply(() => [200, mockConsignantes]);
mock.onGet('/api/consignacao/contracts').reply(() => [200, mockContracts]);
mock.onGet('/api/cupons').reply(() => [200, mockCupons]);
mock.onGet('/api/dashboard/kpis-by-period').reply(() => [200, dashboardKpisByPeriod]);
mock.onGet('/api/dashboard/revenue-data').reply(() => [200, revenueData]);
mock.onGet('/api/dashboard/sales-by-category').reply(() => [200, salesByCategory]);
mock.onGet('/api/dashboard/recent-sales').reply(() => [200, recentSales]);
mock.onGet('/api/dashboard/abc-data').reply(() => [200, abcData]);
mock.onGet('/api/dashboard/abc-products').reply(() => [200, abcProductsData]);
mock.onGet('/api/financeiro/cash-flow').reply(() => [200, cashFlowData]);
mock.onGet('/api/financeiro/payment-methods').reply(() => [200, paymentMethods]);
mock.onGet('/api/financeiro/recent-payments').reply(() => [200, recentPayments]);
mock.onGet('/api/financeiro/esg-monthly').reply(() => [200, esgMonthly]);
let mutableMockProducts = [...mockProducts];

mock.onGet('/api/notifications').reply(() => [200, mockNotifications]);
mock.onGet('/api/products').reply(() => [200, mutableMockProducts]);

mock.onPost('/api/products').reply((config) => {
  const newProduct = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  const productToAdd = {
    ...newProduct,
    id: Date.now(),
    status: newProduct.status || 'Disponível',
    image: newProduct.image || '📦',
    createdAt: newProduct.createdAt || new Date().toISOString(),
  };
  mutableMockProducts.unshift(productToAdd);
  return [201, productToAdd];
});

mock.onPost('/api/products/bulk').reply((config) => {
  const newProductsArray = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  if (!Array.isArray(newProductsArray)) return [400, { message: 'Data must be an array' }];

  const productsToAdd = newProductsArray.map((p, index) => ({
    ...p,
    id: Date.now() + index,
    status: p.status || 'Disponível',
    image: p.image || '📦',
    createdAt: p.createdAt || new Date().toISOString(),
  }));
  mutableMockProducts = [...productsToAdd, ...mutableMockProducts];
  return [201, productsToAdd];
});

mock.onGet('/api/products/pdv-sales').reply(() => [200, mockPDVSales]);
mock.onGet('/api/store').reply(() => [200, mockStore]);
mock.onGet('/api/store/products').reply(() => [200, storeProducts]);
mock.onGet('/api/suporte/tickets').reply(() => [200, mockTickets]);
mock.onGet('/api/suporte/admin-kpis').reply(() => [200, adminSuporteKpis]);
mock.onGet('/api/suporte/admin-tickets-volume').reply(() => [200, adminTicketsVolume]);
mock.onGet('/api/suporte/admin-tickets-by-category').reply(() => [200, adminTicketsByCategory]);

// Mock GET /api/linktree/:slug
mock.onGet(/\/api\/linktree\/[a-zA-Z0-9-]+/).reply((config) => {
  const url = config.url || '';
  const slug = url.split('/').pop();
  if (slug) {
    const linktree = linktrees.find(lt => lt.slug === slug);
    if (linktree) {
      return [200, linktree];
    }
    // Return empty state if not found, let frontend handle it
    return [200, {
      id: Date.now(),
      slug: slug,
      links: [],
      profileImage: "",
      backgroundImage: "",
      backgroundColor: "#f3f4f6",
      buttonColor: "#ffffff",
      buttonTextColor: "#000000"
    }];
  }
  return [404];
});

// Mock PUT /api/linktree/:slug
mock.onPut(/\/api\/linktree\/[a-zA-Z0-9-]+/).reply((config) => {
  const url = config.url || '';
  const slug = url.split('/').pop();
  if (slug) {
    const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const index = linktrees.findIndex(lt => lt.slug === slug);
    if (index !== -1) {
      linktrees[index] = { ...linktrees[index], ...data, slug: slug }; // Ensure slug remains
      return [200, linktrees[index]];
    } else {
      // If doesn't exist, create it
      const newLinktree = { ...data, slug: slug, id: Date.now() };
      linktrees.push(newLinktree);
      return [200, newLinktree];
    }
  }
  return [400];
});

export default mock;
