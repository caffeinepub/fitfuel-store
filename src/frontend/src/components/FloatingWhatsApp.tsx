import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919549958286"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
      aria-label="Chat on WhatsApp"
      data-ocid="whatsapp.button"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
