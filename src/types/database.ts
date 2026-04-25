export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: "buyer" | "seller" | "admin";
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  created_at: string;
}

export interface Shop {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  location: string | null;
  city: string | null;
  phone: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
  total: number;
  shipping_address: string | null;
  shipping_city: string | null;
  phone: string | null;
  payment_method: string | null;
  payment_status: "pending" | "paid" | "released" | "refunded";
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  shop_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}
