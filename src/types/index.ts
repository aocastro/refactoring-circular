import type { LucideIcon } from "lucide-react";

// ─── KPI ─────────────────────────────────────────
export interface KpiItem {
  label: string;
  value: string | number;
  change?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // Allow string names from mock API
  positive?: boolean;
  period?: string;
  target?: string;
}

// ─── Products ────────────────────────────────────
export type ProductStatus = "Disponível" | "Reservado" | "Vendido" | "sacolinha";
export type ProductCondition = "Novo" | "Excelente" | "Bom" | "Regular";

export interface Product {
  id?: number;
  codProduto?: number;
  nome: string;
  codigoInterno?: string;
  codigoDeBarras?: string;
  codControleInterno?: string;
  sku?: string;
  hasVariacoes: number;
  isVariacao: number;
  produtoBaseId?: number;
  modoCadastroDimensoes?: string;
  pesoLiquido?: number;
  larguraLiquido?: number;
  alturaLiquido?: number;
  comprimentoLiquido?: number;
  pesoEmbalado?: number;
  larguraEmbalado?: number;
  alturaEmbalado?: number;
  comprimentoEmbalado?: number;
  descricao?: string;
  linkVideo?: string;
  genero?: string;
  diferenciarGenero?: number;
  faixaEtaria?: string;
  estado?: string;
  tamanho?: string;
  estilo?: string;
  cor?: string;
  venderOnline?: number;
  venderPdv?: number;
  precoCusto?: number;
  precoPromocional?: number;
  margemDesejada?: number;
  precoVenda?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  estoqueAtual: number;
  fornecedorId?: number;
  ncm?: string;
  entrega?: number;
  retirada?: number;
  locaisRetirada?: string;
  tipoEntrega?: number;
  distanciaMaxima?: number;
  valorAte5km?: number;
  valor5a10km?: number;
  valorMais10km?: number;
  categoriaId?: number;
  subcategoriaId?: number;
  marcaId?: number;
  mesmaLocalizacaoLoja?: number;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  status?: number;
  lojaId?: number;
  isConsignado?: number;
  usuConsignadoId?: number;
  comissaoLojaConsignadoDinheiro?: number;
  comissaoLojaConsignadoCreditos?: number;
  pendenteConsignado?: number;
  prazoPagamentoConsignado?: string;
  sharehubId?: number;
  departamentoId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  pais?: string;
  moeda?: string;

  // Legacy fields mapped for compatibility
  name?: string;
  category?: string;
  size?: string;
  condition?: ProductCondition | string;
  price?: number;
  image?: string;
  stock?: number;
  supplier?: string;
  brand?: string;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Subcategoria {
  id: number;
  categoriaId: number;
  nome: string;
}

export interface Marca {
  id: number;
  nome: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
}

export interface Departamento {
  id: number;
  nome: string;
}

export interface TipoEntrega {
  id: number;
  nome: string;
}

// ─── PDV Sales ───────────────────────────────────
export interface PDVSale {
  id: number;
  time: string;
  items: number;
  total: string;
  payment: string;
  customer: string;
}

// ─── Sacolinhas ──────────────────────────────────
export type BagStatus = "Montando" | "Pronta p/ Retirada" | "Com o Cliente" | "Devolvida" | "Vendida Parcial" | "Vendida Total" | "Cancelada" | string;

export interface BagItem {
  product: Product;
  quantity: number;
  returned?: boolean;
  sold?: boolean;
}

export interface Bag {
  id: number;
  code: string;
  customer: string;
  customerPhone: string;
  customerEmail: string;
  items: BagItem[];
  total: number;
  status: BagStatus;
  createdAt: string;
  trialDays: number;
  returnDate: string;
  notes: string;
  logistics?: 'Retirada' | 'Entrega';
}

// ─── Dashboard Sales ─────────────────────────────
export interface RecentSale {
  id: number;
  item: string;
  price: string;
  date: string;
  status: "Pago" | "Pendente";
}

// ─── Revenue / Charts ────────────────────────────
export interface MonthlyValue {
  month: string;
  value: number;
}

export interface CategoryValue {
  category: string;
  value: number;
}

export interface ABCValue {
  subcategory: string;
  value: number;
  category: "A" | "B" | "C";
}

export interface ABCProductValue {
  product: string;
  value: number;
  revenue: number;
  category: "A" | "B" | "C";
}

// ─── Consignação ─────────────────────────────────
export type ConsignanteStatus = "Ativo" | "Pago";

export interface Consignante {
  id: number;
  name: string;
  items: number;
  sold: number;
  pending: string;
  pendingValue: number;
  status: ConsignanteStatus;
  since: string;
}

export type ContractStatus = "Vigente" | "Encerrado";

export interface Contract {
  id: number;
  consignante: string;
  items: number;
  date: string;
  split: string;
  status: ContractStatus;
}

// ─── Financeiro ──────────────────────────────────
export interface CashFlowEntry {
  month: string;
  entrada: number;
  saida: number;
}

export interface PaymentMethod {
  name: string;
  value: number;
  color: string;
}

export type PaymentType = "entrada" | "saida";

export interface RecentPayment {
  id: number;
  desc: string;
  value: string;
  type: PaymentType;
  method: string;
  date: string;
}

export interface ESGMonthly {
  month: string;
  co2: number;
  agua: number;
  pecas: number;
}

// ─── Notifications ───────────────────────────────
export type NotificationType = "sale" | "payment" | "goal";

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

// ─── Filters ─────────────────────────────────────
export interface RangeFilter {
  label: string;
  min: number;
  max: number;
}

// ─── Table Column ────────────────────────────────
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  hideOn?: "sm" | "md" | "lg";
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
}
