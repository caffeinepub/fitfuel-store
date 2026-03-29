import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

export default function Navbar() {
  const { cartCount, items } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const needsDelivery = items.length > 0 && items.length < 3;
  const itemsNeeded = 3 - items.length;

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#FF6B00] text-white text-center py-2 text-sm font-semibold tracking-wide">
        {needsDelivery
          ? `🚚 Add ${itemsNeeded} more item${itemsNeeded > 1 ? "s" : ""} for FREE delivery!`
          : "🚚 Free delivery on 3+ items — Fuel Your Strength!"}
      </div>

      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-card" : "border-b border-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 mr-4" data-ocid="nav.link">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-[#FF6B00]">FIT</span>
              <span className="text-foreground">FUEL STORE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            <Link
              to="/"
              className="text-sm font-semibold text-foreground/70 hover:text-[#FF6B00] transition-colors"
              data-ocid="nav.home.link"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm font-semibold text-foreground/70 hover:text-[#FF6B00] transition-colors"
              data-ocid="nav.products.link"
            >
              Products
            </Link>
          </nav>

          {/* Search + cart */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Search bar */}
            <div className="relative hidden md:block">
              {searchOpen ? (
                <div className="flex items-center border border-border rounded-full px-3 py-1.5 gap-2 bg-secondary w-64">
                  <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent text-sm outline-none w-full"
                    data-ocid="nav.search_input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                  {/* Dropdown */}
                  {filtered.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-card-hover border border-border rounded-lg overflow-hidden z-50">
                      {filtered.map((p) => (
                        <Link
                          key={p.id}
                          to="/product/$id"
                          params={{ id: p.id }}
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-secondary text-sm"
                        >
                          <img
                            src={p.variants[0].image}
                            alt={p.name}
                            className="w-8 h-8 object-contain rounded"
                          />
                          <span className="font-medium">{p.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  data-ocid="nav.search_input"
                >
                  <Search className="w-5 h-5 text-foreground" />
                </button>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2" data-ocid="nav.cart.link">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FF6B00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              data-ocid="nav.toggle"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-4">
            <Link
              to="/"
              className="font-semibold text-sm"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.home.link"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="font-semibold text-sm"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.products.link"
            >
              Products
            </Link>
            {/* Mobile search */}
            <div className="flex items-center border border-border rounded-full px-3 py-1.5 gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm outline-none w-full"
                data-ocid="nav.search_input"
              />
            </div>
            {filtered.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden">
                {filtered.map((p) => (
                  <Link
                    key={p.id}
                    to="/product/$id"
                    params={{ id: p.id }}
                    onClick={() => {
                      setMenuOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm"
                  >
                    <img
                      src={p.variants[0].image}
                      alt={p.name}
                      className="w-8 h-8 object-contain rounded"
                    />
                    <span className="font-medium">{p.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
