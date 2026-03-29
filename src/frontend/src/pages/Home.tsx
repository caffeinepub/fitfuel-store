import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Truck, Zap } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const FEATURES = [
  { icon: <Truck className="w-4 h-4" />, text: "Free delivery on 3+ items" },
  {
    icon: <BadgeCheck className="w-4 h-4" />,
    text: "100% Authentic Pintola products",
  },
  { icon: <Zap className="w-4 h-4" />, text: "Fast & reliable delivery" },
];

const WHY_CARDS = [
  {
    icon: <BadgeCheck className="w-8 h-8 text-[#FF6B00]" />,
    title: "100% Authentic",
    desc: "We are official Pintola distributors. Every product is genuine and verified.",
  },
  {
    icon: <Truck className="w-8 h-8 text-[#FF6B00]" />,
    title: "Fast Delivery",
    desc: "Order 3+ items and get free delivery right to your door.",
  },
  {
    icon: <Zap className="w-8 h-8 text-[#FF6B00]" />,
    title: "Best Prices",
    desc: "Significant discounts on MRP — saving you money on every order.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    text: "Best peanut butter I've had! The protein content is insane and the taste is amazing. Delivery was super fast too!",
    rating: 5,
  },
  {
    name: "Priya Menon",
    text: "The High Protein Oats in Caffe Mocha flavor is my go-to pre-workout breakfast. Tastes great and keeps me full for hours.",
    rating: 5,
  },
  {
    name: "Arjun Kapoor",
    text: "Ordered 4 items and got free delivery! Great prices and the muesli is super fresh. Will definitely order again.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[560px] sm:min-h-[640px] bg-foreground text-white overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,107,0,0.3) 0, rgba(255,107,0,0.3) 1px, transparent 0, transparent 50%)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-block bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Premium Pintola Nutrition
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Fuel Your <span className="text-[#FF6B00]">Strength</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-lg">
              Premium Pintola nutrition — delivered to your door. Authentic
              products, unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-orange hover:scale-105"
                data-ocid="hero.shop_now.primary_button"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-full transition-colors duration-200"
                data-ocid="hero.view_cart.secondary_button"
              >
                View Cart
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="bg-white/10 rounded-2xl p-4 flex items-center justify-center"
              >
                <img
                  src={p.variants[0].image}
                  alt={p.name}
                  className="w-32 h-32 object-contain drop-shadow-2xl"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-[#FF6B00] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 divide-x divide-white/20">
          {FEATURES.map((f) => (
            <div
              key={f.text}
              className="flex items-center justify-center gap-2 text-sm font-semibold py-2"
            >
              {f.icon}
              {f.text}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Our Products
          </h2>
          <p className="text-muted-foreground text-lg">
            Premium nutrition for your fitness journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <ProductCard product={p} index={i + 1} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border-2 border-foreground text-foreground hover:bg-foreground hover:text-white font-bold px-8 py-3 rounded-full transition-all duration-200"
            data-ocid="home.view_all.secondary_button"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-center mb-12"
          >
            Why Choose FitFuel Store?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {WHY_CARDS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl p-8 text-center shadow-card"
              >
                <div className="flex justify-center mb-4">{c.icon}</div>
                <h3 className="font-extrabold text-lg mb-2">{c.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {c.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-border rounded-2xl p-6 shadow-card"
            >
              <div className="flex text-[#FF6B00] mb-3">
                {"★".repeat(t.rating)}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                "{t.text}"
              </p>
              <p className="font-bold text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
