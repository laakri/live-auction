import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useViewportScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Diamond, Clock, Shield, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";

const LuxuryItem = ({
  name,
  image,
  price,
}: {
  name: string;
  image: string;
  price: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="bg-white bg-opacity-5 p-6 rounded-lg"
  >
    <img
      src={image}
      alt={name}
      className="w-full h-48 object-cover mb-4 rounded"
    />
    <h3 className="text-xl font-semibold mb-2">{name}</h3>
    <p className="text-gold">{price}</p>
  </motion.div>
);

const FeatureCard = ({
  Icon,
  title,
  description,
}: {
  Icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="bg-white bg-opacity-5 p-6 rounded-lg text-center">
    <Icon className="w-12 h-12 text-gold mb-4 mx-auto" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const TestimonialCard = ({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) => (
  <div className="bg-white bg-opacity-5 p-6 rounded-lg">
    <p className="text-lg italic mb-4">"{quote}"</p>
    <p className="text-gold">- {author}</p>
  </div>
);

const FloatingElement = ({
  size,
  color,
  duration,
  delay,
}: {
  size: number;
  color: string;
  duration: number;
  delay: number;
}) => (
  <motion.div
    className="absolute rounded-full opacity-10"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      filter: "blur(40px)",
    }}
    animate={{
      x: ["0%", "100%", "0%"],
      y: ["0%", "100%", "0%"],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
  />
);

const FeaturedAuction = ({
  title,
  image,
  currentBid,
}: {
  title: string;
  image: string;
  currentBid: string;
}) => (
  <motion.div
    className="bg-white bg-opacity-10 rounded-lg overflow-hidden"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-300">Current Bid: {currentBid}</p>
      <Button className="mt-4 w-full">Place Bid</Button>
    </div>
  </motion.div>
);

// Custom Button component
const CustomButton = ({
  children,
  primary = false,
  className = "",
}: {
  children: React.ReactNode;
  primary?: boolean;
  className?: string;
}) => (
  <Button
    className={`px-8 py-4 text-lg rounded-full transform transition hover:scale-105 ${
      primary
        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
        : "border-2 border-white text-white hover:bg-white hover:text-black bg-transparent"
    } ${className}`}
  >
    {children}
  </Button>
);

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const luxuryItems = [
    {
      name: "Rare Diamond Necklace",
      image: "https://i.gyazo.com/84069c635d7addaea18cbc698564d8b8.png",
      price: "$1,200,000",
    },
    {
      name: "Vintage Patek Philippe Watch",
      image: "https://i.gyazo.com/19a6da9ca1e74e65b24110701f1183c1.png",
      price: "$820,000",
    },
    {
      name: "Exclusive Modern Art Piece",
      image: "https://i.gyazo.com/986a3128f29ec75917fcf492187c20b3.png",
      price: "$3,500,000",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % luxuryItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useViewportScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundRef.current) {
        const { left, top, width, height } =
          backgroundRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bg-rich-black text-white overflow-hidden">
      <div className="relative min-h-screen">
        <motion.div
          ref={backgroundRef}
          className="absolute inset-0 z-0"
          style={{
            y,
            scale,
            backgroundImage: `url(https://i.gyazo.com/19a44cff2bdc6c6cc46126aefdd34a47.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${
              mousePosition.y * 100
            }%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.4) 50%)`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-purple-900/40 backdrop-filter backdrop-blur-sm z-20"></div>

        <div className="fixed inset-0 overflow-hidden pointer-events-none z-30">
          <FloatingElement size={300} color="#8A2BE2" duration={20} delay={0} />
          <FloatingElement size={200} color="#9370DB" duration={25} delay={2} />
          <FloatingElement size={250} color="#9932CC" duration={30} delay={4} />
        </div>

        <div className="relative z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="min-h-screen flex flex-col justify-center items-center py-20">
              <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-8 text-center"
              >
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: "200% auto" }}
                >
                  Exquisite Auctions
                </motion.span>
                <span className="block mt-2 text-4xl sm:text-5xl md:text-6xl">
                  Discover. Bid. Win.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-xl sm:text-2xl md:text-3xl mb-12 text-center max-w-3xl text-gray-300"
              >
                Step into a new dimension of luxury auctions. Experience the
                thrill of bidding in our immersive environment.
              </motion.p>

              <div className="w-full max-w-md mb-12">
                <AnimatePresence mode="wait">
                  <LuxuryItem
                    key={currentIndex}
                    {...luxuryItems[currentIndex]}
                  />
                </AnimatePresence>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <CustomButton primary>
                  Explore Auctions <ArrowRight className="ml-2" />
                </CustomButton>
                <CustomButton>Learn More</CustomButton>
              </motion.div>
            </section>

            <section className="py-20">
              <h2 className="text-3xl sm:text-4xl font-light mb-12 text-center">
                Why Choose Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                  Icon={Diamond}
                  title="Rare Finds"
                  description="Access to some of the world's most exclusive and rare items."
                />
                <FeatureCard
                  Icon={Clock}
                  title="Timely Auctions"
                  description="Regular auctions featuring carefully curated selections."
                />
                <FeatureCard
                  Icon={Shield}
                  title="Secure Bidding"
                  description="State-of-the-art security measures to protect your transactions."
                />
              </div>
            </section>

            <section className="py-20">
              <h2 className="text-3xl sm:text-4xl font-light mb-12 text-center">
                Featured Collections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {luxuryItems.map((item, index) => (
                  <LuxuryItem key={index} {...item} />
                ))}
              </div>
              <div className="text-center mt-12">
                <CustomButton>
                  View All Collections <ArrowRight className="ml-2" />
                </CustomButton>
              </div>
            </section>

            <section className="py-20">
              <h2 className="text-3xl sm:text-4xl font-light mb-12 text-center">
                Client Testimonials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TestimonialCard
                  quote="Exquisite Auctions has consistently provided me with access to truly unique pieces. Their curation is unparalleled."
                  author="James B., Art Collector"
                />
                <TestimonialCard
                  quote="The level of service and the quality of items available through Exquisite Auctions is simply outstanding."
                  author="Sarah L., Luxury Enthusiast"
                />
              </div>
            </section>

            <section className="py-20">
              <div className="bg-white bg-opacity-5 p-8 rounded-lg">
                <h2 className="text-3xl sm:text-4xl font-light mb-6 text-center">
                  Stay Informed
                </h2>
                <p className="text-center mb-8">
                  Subscribe to our newsletter for exclusive auction previews and
                  luxury insights.
                </p>
                <form className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 bg-rich-black border border-gold rounded-full focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <CustomButton primary>Subscribe</CustomButton>
                </form>
              </div>
            </section>
          </div>

          <footer className="bg-black bg-opacity-75 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-between items-center">
                <p className="text-sm text-gray-300">
                  © 2023 Exquisite Auctions. All rights reserved.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-gold">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-300 hover:text-gold">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-300 hover:text-gold">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{ opacity }}
          className="absolute bottom-0 left-0 right-0 text-center pb-8 z-50"
        >
          <ChevronDown className="mx-auto animate-bounce" size={32} />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
