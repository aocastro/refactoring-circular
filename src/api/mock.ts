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

const mock = new MockAdapter(axios, { delayResponse: 500 });

let subStocks = [...initialSubStocks];

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
let mutableAdminPlans = [...adminPlans];
let mutableAdminStores = [...adminStores];
let mutableAdminUsers = [...adminUsers];

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

export default mock;

// --- Mocks for Dynamic Options in Product Registration ---
export const mockCategorias = [
  { id: 1, nome: 'Roupas' },
  { id: 2, nome: 'Calçados' },
  { id: 3, nome: 'Acessórios' }
];

export const mockSubcategorias = [
  { id: 1, categoriaId: 1, nome: 'Camisetas' },
  { id: 2, categoriaId: 1, nome: 'Calças' },
  { id: 3, categoriaId: 2, nome: 'Tênis' }
];

export const mockMarcas = [
  { id: 1, nome: 'Nike' },
  { id: 2, nome: 'Adidas' },
  { id: 3, nome: 'Zara' }
];

export const mockFornecedores = [
  { id: 1, nome: 'Fornecedor A' },
  { id: 2, nome: 'Fornecedor B' }
];

export const mockDepartamentos = [
  { id: 1, nome: 'Masculino' },
  { id: 2, nome: 'Feminino' },
  { id: 3, nome: 'Unissex' }
];

export const mockTiposEntrega = [
  { id: 1, nome: 'Correios (PAC)' },
  { id: 2, nome: 'Correios (Sedex)' },
  { id: 3, nome: 'Transportadora Local' },
  { id: 4, nome: 'Motoboy' }
];

mock.onGet('/api/categorias').reply(() => [200, mockCategorias]);
mock.onGet('/api/subcategorias').reply(() => [200, mockSubcategorias]);
mock.onGet('/api/marcas').reply(() => [200, mockMarcas]);
mock.onGet('/api/fornecedores').reply(() => [200, mockFornecedores]);
mock.onGet('/api/departamentos').reply(() => [200, mockDepartamentos]);
mock.onGet('/api/tipos-entrega').reply(() => [200, mockTiposEntrega]);
