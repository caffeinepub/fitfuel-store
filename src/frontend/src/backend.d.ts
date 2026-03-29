import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductOrder {
    name: string;
    size: string;
    quantity: bigint;
    price: bigint;
}
export type Rating = bigint;
export type PaymentMethod = {
    __kind__: "cod";
    cod: null;
} | {
    __kind__: "upi";
    upi: string;
};
export interface DeliveryAddress {
    floor: string;
    area: string;
    flat: string;
    name: string;
    addressType: string;
    landmark: string;
    phone: bigint;
}
export interface Order {
    status: OrderStatus;
    deliveryCharge: bigint;
    paymentMethod: PaymentMethod;
    orderId: bigint;
    totalAmount: bigint;
    address: DeliveryAddress;
    timestamp: bigint;
    products: Array<ProductOrder>;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    rating: Rating;
    price: Price;
}
export type Price = bigint;
export enum OrderStatus {
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export interface backendInterface {
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getOrderById(orderId: bigint): Promise<Order | null>;
    getProductById(id: bigint): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    submitOrder(order: Order): Promise<bigint>;
}
