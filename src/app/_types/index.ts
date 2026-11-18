import type { ChangeEventHandler, FormEvent, ReactNode } from "react";
import type { getDictionary } from "@/lib/dictionary";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  _id: string;
  title: string;
  description?: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  category: Pick<Category, "_id" | "name" | "slug"> & { image?: string };
  brand?: Pick<Brand, "_id" | "name" | "slug" | "image">;
  images?: string[];
  quantity?: number;
  sold?: number;
  subcategory?: Array<Pick<Category, "_id" | "name" | "slug">>;
  reviews?: ProductReview[];
}

export interface ProductReview {
  _id?: string;
  rating?: number;
  review?: string;
  createdAt?: string;
  user?: { name?: string; photo?: string };
}

export interface AuthUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export type AuthAction =
  | "signup"
  | "signin"
  | "forgot-password"
  | "verify-reset-code"
  | "reset-password"
  | "change-password"
  | "update-profile";

export type AuthRequestBody = Record<string, string | boolean>;
export type AuthVariant = "signin" | "signup" | "forgot";
export type AuthRecoveryStep = "email" | "code" | "password" | "done";

export interface AuthApiResponse {
  message?: string;
  token?: string;
  user?: AuthUser;
  data?: {
    token?: string;
    user?: AuthUser;
    message?: string;
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
  errors?: Record<string, string>;
  statusMsg?: string;
}

export interface AuthForwardResult {
  status: number;
  data: AuthApiResponse;
}

export interface AuthClientResult {
  ok: boolean;
  status: number;
  data: AuthApiResponse;
}

export interface AuthSessionResponse {
  user: AuthUser | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthFormPageProps {
  callbackUrl: string;
}

export interface ToasterProps {
  children: ReactNode;
}

export type RouteSkeletonVariant = "home" | "auth" | "profile" | "support";

export interface RouteSkeletonProps {
  variant: RouteSkeletonVariant;
}

export interface RouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export interface AuthShellProps {
  variant: AuthVariant;
  children: ReactNode;
}

export interface AuthFieldProps {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  autoComplete: string;
  required?: boolean;
  icon?: ReactNode;
}

export interface PasswordFieldProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export interface AuthRouteContext {
  params: Promise<{ action: string }>;
}

export interface CartRouteContext {
  params: Promise<{ productId: string }>;
}

export interface WishlistRouteContext {
  params: Promise<{ productId: string }>;
}

export interface CartApiProduct {
  _id?: string;
  count?: number | string;
  price?: number | string;
  product?: Product | string;
}

export interface CartApiResponse {
  message?: string;
  cartId?: string;
  status?: string;
  numOfCartItems?: number;
  totalCartPrice?: number;
  products?: CartApiProduct[];
  data?: {
    _id?: string;
    cartId?: string;
    totalCartPrice?: number;
    numOfCartItems?: number;
    products?: CartApiProduct[];
  } | CartApiProduct[];
}

export interface CartLineItem {
  product: Product;
  count: number;
  unitPrice: number;
}

export interface CartSnapshot {
  items: CartLineItem[];
  itemCount: number;
  totalPrice: number;
  cartId?: string;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export interface CheckoutRequestBody {
  shippingAddress?: Partial<ShippingAddress>;
  paymentMethod?: "cash" | "online";
}

export interface CheckoutResponse {
  message?: string;
  session?: { url?: string };
  data?: { session?: { url?: string }; url?: string; order?: Order } | Order;
  url?: string;
  order?: Order;
}

export interface Order {
  _id: string;
  id?: string;
  createdAt?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  paymentMethodType?: string;
  totalOrderPrice?: number;
  cartItems?: CartApiProduct[];
  shippingAddress?: ShippingAddress;
}

export interface OrderApiResponse {
  message?: string;
  data?: Order[] | { orders?: Order[] };
  orders?: Order[];
}

export interface SavedAddress {
  _id: string;
  name?: string;
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export interface AddressRequestBody {
  name?: string;
  details?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
}

export interface AddressApiResponse {
  message?: string;
  data?: SavedAddress[] | { addresses?: SavedAddress[] } | SavedAddress;
  addresses?: SavedAddress[];
}

export interface CommerceDictionary {
  checkoutTitle: string;
  checkoutSubtitle: string;
  shippingAddress: string;
  shippingHint: string;
  city: string;
  cityPlaceholder: string;
  streetAddress: string;
  addressPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  postalCode: string;
  paymentMethod: string;
  cashOnDelivery: string;
  cashDescription: string;
  payOnline: string;
  onlineDescription: string;
  orderSummary: string;
  subtotal: string;
  shipping: string;
  shippingAtCheckout: string;
  total: string;
  placeOrder: string;
  placingOrder: string;
  backToCart: string;
  checkoutError: string;
  ordersTitle: string;
  noOrders: string;
  noOrdersDescription: string;
  startShopping: string;
  order: string;
  orderDate: string;
  orderStatus: string;
  paid: string;
  unpaid: string;
  delivered: string;
  processing: string;
  addressesTitle: string;
  addressesDescription: string;
  addAddress: string;
  addFirstAddress: string;
  noAddresses: string;
  noAddressesDescription: string;
  saveAddress: string;
  savingAddress: string;
  removeAddress: string;
  addressName: string;
  home: string;
  retry: string;
  loading: string;
  account: string;
  myAddresses: string;
  settings: string;
}

export interface OrderRouteContext {
  params: Promise<{ orderId: string }>;
}

export interface AddressRouteContext {
  params: Promise<{ addressId: string }>;
}

export interface AccountNavigationProps {
  active: "addresses" | "settings" | "orders";
}

export interface StoreClientResult<T> {
  ok: boolean;
  data?: T;
  message?: string;
}

export interface CartAddRequestBody {
  productId?: unknown;
  quantity?: unknown;
}

export interface CartUpdateRequestBody {
  count?: unknown;
}

export interface WishlistRequestBody {
  productId?: unknown;
}

export interface WishlistApiResponse {
  message?: string;
  data?: Product[] | { products?: Product[] };
}

export interface BrandsPageProps {
  brands: Brand[];
  failed?: boolean;
}

export interface BrandCardProps {
  brand: Brand;
}

export interface BrandProductsPageProps {
  brand: Brand;
  products: Product[];
  failed?: boolean;
}

export interface StoreDictionary {
  cartTitle: string;
  wishlistTitle: string;
  emptyCartTitle: string;
  emptyCartText: string;
  emptyWishlistTitle: string;
  emptyWishlistText: string;
  startShopping: string;
  browseProducts: string;
  signIn: string;
  itemsInCart: string;
  savedItems: string;
  orderSummary: string;
  subtotal: string;
  shipping: string;
  calculatedAtCheckout: string;
  estimatedTotal: string;
  checkout: string;
  signUp: string;
  savedCartNote: string;
  remove: string;
  clearCart: string;
  continueShopping: string;
  quantity: string;
  inStock: string;
  addToCart: string;
  viewCart: string;
  retry: string;
  brandsTitle: string;
  brandsSubtitle: string;
  shopBrand: string;
  noBrands: string;
  noBrandProducts: string;
  loading: string;
  error: string;
  price: string;
  total: string;
  item: string;
  items: string;
  signInToSync: string;
}

export interface WishlistPageProps {
  initialItems?: Product[];
}

export type AuthFormEvent = FormEvent<HTMLFormElement>;

export interface ApiListResponse<T> {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T;
}

export type Locale = "en" | "ar";
export type Theme = "light" | "dark";
export type Dictionary = ReturnType<typeof getDictionary>;
export type ApiResult<T> = { ok: true; data: T } | { ok: false };
export type IconAction = "wishlist" | "compare" | "preview";

export interface PreferencesContextValue {
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  refreshCart: () => Promise<void>;
  wishlistCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}

export interface PreferencesProviderProps {
  children: ReactNode;
}

export interface SectionHeadingProps {
  title: string;
  action?: ReactNode;
}

export interface SectionStateProps {
  state: "loading" | "error" | "empty" | "noMatches";
}

export interface IconButtonProps {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
}

export interface MainSliderProps {
  hasHeroImage: boolean;
}

export interface CategoryViewProps {
  categories: Category[];
  failed?: boolean;
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductImageProps {
  product: Product;
  discount: number;
  discounted: boolean;
  children: ReactNode;
}

export interface ProductToolsProps {
  product: Product;
}

export interface ProductRatingProps {
  rating: number;
  average: number;
  quantity: number;
}

export interface ProductPriceProps {
  currentPrice: number;
  originalPrice: number;
  discounted: boolean;
  onAdd: () => void;
  addLabel: string;
}

export interface ProductPreviewProps {
  product: Product;
  categoryName: string;
  currentPrice: number;
  onClose: () => void;
}

export interface CategoryCardProps {
  category: Category;
  name: string;
}

export interface FeatureCardProps {
  title: string;
  detail: string;
  tone: string;
  children: ReactNode;
}

export interface DealCardProps {
  variant: "organic" | "vegetable";
  badge: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  codeLabel: string;
  buttonLabel: string;
}

export interface FooterContentProps {
  copy: Dictionary;
}

export interface HeroCopyProps {
  copy: Dictionary;
  slide: number;
}

export interface HeroControlsProps {
  slide: number;
  onChange: (slide: number) => void;
}

export interface NewsletterContentProps {
  copy: Dictionary;
}

export interface NewsletterSubmitProps {
  copy: Dictionary;
  subscribed: boolean;
  onSubmit: (event: NewsletterSubmitEvent) => void;
}

export interface DesktopNavigationProps {
  copy: Dictionary;
  closeMobileMenu: () => void;
}

export interface MobileNavigationProps {
  copy: Dictionary;
  wishlistCount: number;
  cartCount: number;
  onClose: () => void;
  userName?: string;
}

export interface ProductDetailProps {
  product: Product;
}

export interface RelatedProductsProps {
  products: Product[];
}

export interface RelatedProductsSectionProps {
  categoryId: string;
  productId: string;
}

export interface ViewProductPageProps {
  params: Promise<{ productid: string }>;
}

export interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export interface AllProductsProps {
  products: Product[];
  failed?: boolean;
  categoryFilter?: string;
  initialQuery?: string;
}

export interface ShopHeaderProps {
  categoryFilter?: string;
}

export interface ShopContentProps {
  categoryFilter?: string;
  initialQuery?: string;
}

export interface ProductGalleryProps {
  title: string;
  images: string[];
}

export interface ProductPurchaseProps {
  product: Product;
  onAdd: (quantity: number) => void;
}

export interface ProductTabsProps {
  product: Product;
}

export interface ProductPurchaseActionsProps {
  addLabel: string;
  buyLabel: string;
  wishlistLabel: string;
  wishlisted: boolean;
  disabled: boolean;
  onAdd: () => void;
  onBuy: () => void;
  onWishlist: () => void;
}

export type ProductDetailTab = "details" | "reviews" | "shipping";

export interface ProductDetailTabItem {
  key: ProductDetailTab;
  label: string;
  icon: ReactNode;
}

export interface FeaturedProductsProps {
  products: Product[];
  failed?: boolean;
}

export interface SectionSkeletonProps {
  kind: "categories" | "products";
}

export type NewsletterSubmitEvent = FormEvent<HTMLFormElement>;
export type SearchSubmitEvent = FormEvent<HTMLFormElement>;
export type SupportFormEvent = FormEvent<HTMLFormElement>;
