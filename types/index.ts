export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface NavBarMenuItem {
  label: string;
  link: string;
}

export interface HeroCategory {
  imgSrc: string;
  label: string;
  link: string;
}

export interface ProductImage {
  id: number;
  url: string;
}

export interface Category {
  id: number;
  nameTh: string;
  nameEn: string;
}

export interface Product {
  id: number;
  nameTh: string;
  nameEn?: string;
  descriptionTh?: string | null;
  descriptionEn?: string | null;
  price: number | string;
  categoryId: number;
  category?: Category;
  images: ProductImage[];
  isAvailable?: boolean;
  isRecommended?: boolean;
  options?: ProductOption[];
}

export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  nickName?: string | null;
  profileImage?: string | null;
  role: UserRole;
  isVerified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user?: User;
    accessToken?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
  selectedOptions?: any;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface ProductOptionChoice {
  id: number;
  nameTh: string;
  nameEn?: string | null;
  price: number | string;
}

export interface ProductOption {
  id: number;
  nameTh: string;
  nameEn?: string | null;
  isRequired: boolean;
  maxSelect: number;
  choices: ProductOptionChoice[];
}
