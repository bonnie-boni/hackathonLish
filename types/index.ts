export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  badge?: 'NEW' | 'POPULAR' | 'LOW STOCK' | 'SALE';
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface Collaborator {
  user: User;
  role: 'Owner' | 'Editor' | 'Viewer';
  status: 'active' | 'pending';
}

export interface CollaborativeShop {
  id: string;
  name: string;
  createdBy: User;
  lastActive: string;
  collaborators: Collaborator[];
  products: CollabProduct[];
  cartTotal: number;
  cartGoal: number;
}

export interface CollabProduct extends Product {
  addedBy: User;
  votedBy: User[];
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  status: 'COMPLETED' | 'PROCESSING' | 'REFUNDED' | 'CANCELLED';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  thumbnail: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  icon: string;
}

export interface MpesaPaymentPayload {
  phoneNumber: string;
  amount: number;
  orderId: string;
}

export interface MpesaResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}
