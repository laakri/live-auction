import React, { useState } from "react";
import { motion } from "framer-motion";

interface AnimatedBidButtonProps {
  onClick: () => void;
}

const AnimatedBidButton: React.FC<AnimatedBidButtonProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold  shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 "
        initial={{ x: "100%" }}
        animate={{ x: isHovered ? "0%" : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      <motion.span
        className="relative z-10"
        animate={{
          y: isHovered ? -20 : 0,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        Place Bid
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: isHovered ? 0 : 20,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        Bid Now!
      </motion.span>
    </motion.button>
  );
};

export default AnimatedBidButton;
