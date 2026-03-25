import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { initialSubStocks } from '../data/dashboard';

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

export default mock;
