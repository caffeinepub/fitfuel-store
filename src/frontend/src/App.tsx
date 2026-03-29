import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import OrderSuccess from "./pages/OrderSuccess";
import Payment from "./pages/Payment";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Toaster richColors position="top-center" />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: Products,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetail,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: Cart,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment",
  component: Payment,
});

const orderSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-success",
  component: OrderSuccess,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  paymentRoute,
  orderSuccessRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <CheckoutProvider>
          <RouterProvider router={router} />
        </CheckoutProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
