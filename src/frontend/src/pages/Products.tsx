import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const categories = ["All", "Oats", "Muesli", "Peanut Butter"];

export default function Products() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchQ =
      !query.trim() ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Our Products
        </h1>
        <p className="text-muted-foreground mb-8">
          Premium Pintola nutrition for your fitness journey
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex items-center border border-border rounded-full px-4 py-2 gap-2 bg-secondary flex-1 max-w-sm">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent text-sm outline-none w-full"
              data-ocid="products.search_input"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  category === c
                    ? "bg-foreground text-white border-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
                data-ocid="products.filter.tab"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-24 text-muted-foreground"
            data-ocid="products.empty_state"
          >
            <p className="text-lg font-semibold">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={p} index={i + 1} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
