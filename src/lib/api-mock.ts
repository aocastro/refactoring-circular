import axios from "axios";
import { mockProducts } from "@/data/products";
import type { Product } from "@/types";
import { format } from "date-fns";

// We keep a mutable local copy of products to simulate backend state
let inMemoryProducts = [...mockProducts];

// Define Bag types to simulate backend state
import type { Bag, BagStatus } from "@/types";

let inMemoryBags: Bag[] = [
  // Initial mocked data mirroring SacolinhasContent.tsx
  {
    id: 1, code: "SAC-001", customer: "Ana Silva", customerPhone: "(11) 99123-4567", customerEmail: "ana@email.com",
    items: [{ product: inMemoryProducts[0], quantity: 1 }, { product: inMemoryProducts[4], quantity: 1 }],
    total: 134.9, status: "Com o Cliente", createdAt: "10/03/2026", trialDays: 3, returnDate: "13/03/2026", notes: "Cliente quer testar para evento no sábado.",
  },
  {
    id: 2, code: "SAC-002", customer: "Juliana Costa", customerPhone: "(21) 99876-5432", customerEmail: "ju@email.com",
    items: [{ product: inMemoryProducts[2], quantity: 1 }],
    total: 210, status: "Devolvida em 13/03/2026", createdAt: "08/03/2026", trialDays: 5, returnDate: "13/03/2026", notes: "",
  },
  {
    id: 3, code: "SAC-003", customer: "Fernanda Lima", customerPhone: "(31) 99234-5678", customerEmail: "fer@email.com",
    items: [{ product: inMemoryProducts[1], quantity: 1 }, { product: inMemoryProducts[6], quantity: 1 }],
    total: 237, status: "Montando", createdAt: "12/03/2026", trialDays: 3, returnDate: "15/03/2026", notes: "Separar embalagem especial.",
  },
  {
    id: 4, code: "SAC-004", customer: "Maria Oliveira", customerPhone: "(11) 97654-3210", customerEmail: "maria@email.com",
    items: [{ product: inMemoryProducts[3], quantity: 1, sold: true }],
    total: 120, status: "Vendida Total", createdAt: "05/03/2026", trialDays: 5, returnDate: "10/03/2026", notes: "Cliente comprou após teste.",
  },
];

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(async (config) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const { method, url, data } = config;

  // GET /api/sacolinhas
  if (method === "get" && url === "/sacolinhas") {
    config.adapter = async () => ({
      data: inMemoryBags,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  }

  // GET /api/products
  if (method === "get" && url === "/products") {
    config.adapter = async () => ({
      data: inMemoryProducts,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  }

  // PUT /api/products/:id/status
  if (method === "put" && url?.match(/^\/products\/\d+\/status$/)) {
    const id = parseInt(url.split("/")[2]);
    const { status } = JSON.parse(data);

    inMemoryProducts = inMemoryProducts.map((p) =>
      p.id === id ? { ...p, status } : p
    );

    const updatedProduct = inMemoryProducts.find((p) => p.id === id);

    config.adapter = async () => ({
      data: updatedProduct,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  }

  // POST /api/sacolinhas
  if (method === "post" && url === "/sacolinhas") {
    const payload = JSON.parse(data);
    const newBag: Bag = {
      ...payload,
      id: Date.now(),
      code: `SAC-${String(inMemoryBags.length + 1).padStart(3, "0")}`,
    };
    inMemoryBags = [...inMemoryBags, newBag];

    config.adapter = async () => ({
      data: newBag,
      status: 201,
      statusText: "Created",
      headers: {},
      config,
    });
  }

  // POST /api/sacolinhas/:id/return
  if (method === "post" && url?.match(/^\/sacolinhas\/\d+\/return$/)) {
    const id = parseInt(url.split("/")[2]);
    const { items } = JSON.parse(data); // items is an array of { productId, action: 'returned' | 'sold' }

    // Process items
    for (const item of items) {
        if (item.action === "returned") {
             inMemoryProducts = inMemoryProducts.map(p =>
                 p.id === item.productId ? { ...p, status: "Disponível" } : p
             );
        } else if (item.action === "sold") {
             // In a real system, we'd log a sale and remove it or mark "Vendido".
             inMemoryProducts = inMemoryProducts.map(p =>
                 p.id === item.productId ? { ...p, status: "Vendido" } : p
             );
        }
    }

    const todayStr = format(new Date(), "dd/MM/yyyy");

    // Update bag
    inMemoryBags = inMemoryBags.map((b) => {
      if (b.id !== id) return b;

      const updatedItems = b.items.map(bi => {
         const processedItem = items.find((i: { productId: number, action: string }) => i.productId === bi.product.id);
         if (processedItem) {
             return {
                 ...bi,
                 returned: processedItem.action === "returned",
                 sold: processedItem.action === "sold",
                 product: {
                     ...bi.product,
                     status: processedItem.action === "returned" ? "Disponível" : "Vendido" as const
                 }
             };
         }
         return bi;
      });

      return {
        ...b,
        items: updatedItems,
        status: `Devolvida em ${todayStr}`
      };
    });

    const updatedBag = inMemoryBags.find(b => b.id === id);

    config.adapter = async () => ({
      data: updatedBag,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  }

  return config;
});

export default api;
