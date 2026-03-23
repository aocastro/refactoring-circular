import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const WhatsAppFloat = () => {
  return (
    <motion.a
      href="https://wa.me/5511982163883"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 glow-primary"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -5 }}
      aria-label="Falar conosco pelo WhatsApp"
      title="Falar conosco pelo WhatsApp"
    >
      <svg
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="currentColor"
        className="h-8 w-8"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 7.454c-1.879 0-3.715-.507-5.323-1.467l-.382-.227-3.957 1.038 1.056-3.86-.25-.398C2.812 15.426 2.217 13.284 2.217 11.05c0-5.41 4.401-9.81 9.811-9.81s9.81 4.4 9.81 9.81c0 5.41-4.401 9.81-9.811 9.81m0-21.86C5.922 0 0 5.922 0 13.111c0 2.301.597 4.542 1.737 6.518L0 24l4.47-1.173c1.902 1.039 4.047 1.587 6.242 1.587 7.189 0 13.111-5.922 13.111-13.111S18.3 0 11.112 0z" />
      </svg>
    </motion.a>
  );
};

export default WhatsAppFloat;
