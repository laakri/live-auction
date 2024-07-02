import { motion } from "framer-motion";
import { Diamond, Watch, Car, Home } from "lucide-react";

const icons = [Diamond, Watch, Car, Home];
interface AuctionItemPlaceholderProps {
  index: number;
}
const AuctionItemPlaceholder: React.FC<AuctionItemPlaceholderProps> = ({
  index,
}) => {
  const Icon = icons[index % icons.length];

  return (
    <motion.div
      className="w-full h-48 bg-gradient-to-br from-purple-400 via-pink-900 to-red-500 relative overflow-hidden"
      initial={{ backgroundPosition: "0% 0%" }}
      animate={{ backgroundPosition: "100% 100%" }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: "linear",
        repeatType: "reverse",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
        >
          <Icon size={64} className="text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuctionItemPlaceholder;
