import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import StoreView from "@/pages/StoreView";
import ProductDetail from "@/pages/ProductDetail";
import StoreRegistration from "@/pages/StoreRegistration";
import PaymentSubscription from "@/pages/PaymentSubscription";
import Categories from "@/pages/Categories";
import About from "@/pages/About";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Offers from "@/pages/Offers";
import Cart from "@/pages/Cart";
import Account from "@/pages/Account";

// صفحات البائع
import VendorDashboard from "@/pages/vendor/Dashboard";
import VendorProducts from "@/pages/vendor/Products";
import NewProduct from "@/pages/vendor/NewProduct";
import StoreOptimizer from "@/pages/vendor/StoreOptimizer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/store/register" component={StoreRegistration} />
      <Route path="/store/:id" component={StoreView} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/payment/subscription" component={PaymentSubscription} />
      <Route path="/categories" component={Categories} />
      <Route path="/about" component={About} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route path="/offers" component={Offers} />
      <Route path="/cart" component={Cart} />
      <Route path="/account" component={Account} />
      
      {/* مسارات البائع */}
      <Route path="/vendor/dashboard" component={VendorDashboard} />
      <Route path="/vendor/products" component={VendorProducts} />
      <Route path="/vendor/products/new" component={NewProduct} />
      <Route path="/vendor/store/:id/optimize" component={StoreOptimizer} />
      
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
