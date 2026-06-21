"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  ShoppingCart,
  Search,
  CreditCard,
  Banknote,
  Smartphone,
  Trash2,
  Plus,
  Minus,
  X,
  ScanBarcode,
  Receipt,
} from "lucide-react";

const products = [
  { id: "P001", name: "Wireless Mouse", price: 29.99, category: "Electronics", stock: 45, sku: "WM-001" },
  { id: "P002", name: "USB-C Hub", price: 49.99, category: "Electronics", stock: 23, sku: "UCH-002" },
  { id: "P003", name: "Notebook A5", price: 12.50, category: "Stationery", stock: 120, sku: "NB-003" },
  { id: "P004", name: "Mechanical Keyboard", price: 89.99, category: "Electronics", stock: 15, sku: "MK-004" },
  { id: "P005", name: "Desk Lamp LED", price: 34.99, category: "Furniture", stock: 8, sku: "DL-005" },
  { id: "P006", name: "Monitor Stand", price: 59.99, category: "Furniture", stock: 12, sku: "MS-006" },
  { id: "P007", name: "Webcam HD 1080p", price: 69.99, category: "Electronics", stock: 30, sku: "WC-007" },
  { id: "P008", name: "Whiteboard Markers", price: 8.99, category: "Stationery", stock: 200, sku: "WBM-008" },
  { id: "P009", name: "Ergonomic Chair Mat", price: 44.99, category: "Furniture", stock: 5, sku: "ECM-009" },
  { id: "P010", name: "Ethernet Cable 3m", price: 9.99, category: "Accessories", stock: 75, sku: "EC-010" },
  { id: "P011", name: "Laptop Sleeve 15\"", price: 24.99, category: "Accessories", stock: 40, sku: "LS-011" },
  { id: "P012", name: "Sticky Notes Pack", price: 5.99, category: "Stationery", stock: 300, sku: "SN-012" },
];

type CartItem = {
  product: typeof products[0];
  quantity: number;
};

export default function POSTerminalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="POS Terminal"
        description="Process sales and manage transactions."
        breadcrumbs={[
          { label: "POS", href: "/pos" },
          { label: "Terminal" },
        ]}
        icon={<ShoppingCart className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Product Grid */}
        <div className="xl:col-span-2 space-y-4">
          {/* Search & Categories */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group active:scale-95"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <ScanBarcode className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {product.sku}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col h-fit xl:sticky xl:top-6">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Cart
              </h3>
              <span className="text-sm text-muted-foreground">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 max-h-[400px] overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, -1)
                      }
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, 1)
                      }
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-sm font-semibold w-20 text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 hover:bg-danger/10 text-muted-foreground hover:text-danger rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          <div className="p-4 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-4 border-t border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Payment Method
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center gap-1.5 p-3 bg-success/10 border border-success/20 rounded-xl hover:bg-success/20 transition-colors text-success">
                <Banknote className="h-5 w-5" />
                <span className="text-xs font-medium">Cash</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-3 bg-info/10 border border-info/20 rounded-xl hover:bg-info/20 transition-colors text-info">
                <CreditCard className="h-5 w-5" />
                <span className="text-xs font-medium">Card</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-3 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-colors text-primary">
                <Smartphone className="h-5 w-5" />
                <span className="text-xs font-medium">Digital</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <button
              disabled={cart.length === 0}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Receipt className="h-4 w-4" />
              Complete Sale
            </button>
            <button
              onClick={() => setCart([])}
              disabled={cart.length === 0}
              className="w-full border border-border bg-muted text-foreground py-3 rounded-xl font-medium text-sm transition-all hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
