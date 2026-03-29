import { Instagram, MessageCircle, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="text-2xl font-extrabold mb-3">
            <span className="text-[#FF6B00]">FIT</span>FUEL STORE
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Official distributor of authentic Pintola nutrition products.
            Premium quality, delivered to your door.
          </p>
          <p className="text-[#FF6B00] font-semibold mt-3 text-sm italic">
            "Fuel Your Strength"
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/"
                className="text-white/70 hover:text-white transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="text-white/70 hover:text-white transition-colors"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="/cart"
                className="text-white/70 hover:text-white transition-colors"
              >
                Cart
              </a>
            </li>
            <li>
              <a
                href="/profile"
                className="text-white/70 hover:text-white transition-colors"
              >
                My Profile
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
            Contact Us
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-white/70">
              <Phone className="w-4 h-4 text-[#FF6B00]" />
              <a
                href="tel:+919549956286"
                className="hover:text-white transition-colors"
              >
                +91 95499 56286
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-white/70">
              <Instagram className="w-4 h-4 text-[#FF6B00]" />
              <a
                href="https://instagram.com/shahzuuu.lifts"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                @shahzuuu.lifts
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-white/70">
              <MessageCircle className="w-4 h-4 text-[#FF6B00]" />
              <a
                href="https://wa.me/919549956286"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                WhatsApp Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-white/40 text-xs">
        © {year}. Built with ❤️ using{" "}
        <a
          href={caffeineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70"
        >
          caffeine.ai
        </a>
      </div>
    </footer>
  );
}
