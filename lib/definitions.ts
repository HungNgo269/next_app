import { UserRole } from "@/app/interface/user";

// Core Entities
export type User = {
  id: string;
  name?: string | null;
  email: string;
  image_url?: string | null;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  category_id: string;
  stock_quantity: number;
  sku: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// User Management

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image_url?: string;
  address?: string;
  created_at: string;
  updated_at: string;
};

// Product Management
export type Category = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Shopping Cart
export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

// Order Management
export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  discount_amount: number; // số tiền giảm giá
  final_amount: number; // tổng tiền sau giảm giá
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_address: string;
  payment_method: "cash" | "card" | "bank_transfer" | "e_wallet";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  subscription_discount_applied: boolean; // có áp dụng giảm giá subscription không
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
};

// Invoice Management (for subscription billing)
export type Invoice = {
  id: string;
  user_id: string;
  subscription_id?: string; // null nếu là hóa đơn bán hàng
  order_id?: string; // null nếu là hóa đơn subscription
  amount: number;
  date: string;
  due_date?: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  payment_method?: string;
  created_at: string;
  updated_at: string;
};

// Analytics
export type Revenue = {
  id: string;
  month: string; // YYYY-MM
  product_revenue: number; // doanh thu từ bán hàng
  subscription_revenue: number; // doanh thu từ subscription
  total_revenue: number;
  created_at: string;
};

// Display Types for UI
export type LatestOrder = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_image_url: string;
  total_amount: string;
  status: string;
  created_at: string;
};

export type ProductWithCategory = Product & {
  category_name: string;
  category_image_url?: string;
};

export type OrderWithDetails = Order & {
  customer_name: string;
  customer_email: string;
  items: (OrderItem & {
    product_name: string;
    product_image_url: string;
  })[];
};

export type UserWithSubscription = User & {
  subscription_name?: string;
  subscription_status?: string;
  subscription_end_date?: string;
  discount_percentage?: number;
};

// Form Types
export type ProductForm = {
  id?: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  stock_quantity: number;
  sku: string;
  is_active: boolean;
};

export type OrderForm = {
  user_id: string;
  items: {
    product_id: string;
    quantity: number;
  }[];
  shipping_address: string;
  payment_method: string;
};

export type SubscriptionForm = {
  id?: string;
  name: string;
  description: string;
  price: number;
  discount_percentage: number;
  duration_months: number;
  features: string[];
  is_active: boolean;
};

// Dashboard Stats
export type DashboardStats = {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  active_subscribers: number;
  monthly_growth: number;
};

// Search and Filter Types
export type ProductFilter = {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search_term?: string;
};

export type OrderFilter = {
  status?: Order["status"];
  payment_status?: Order["payment_status"];
  date_from?: string;
  date_to?: string;
  customer_id?: string;
};
export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type UserTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedUsersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type UserField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
};
