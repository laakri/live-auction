import { motion } from "framer-motion";
import {
  Search,
  Gavel,
  Clock,
  Star,
  ArrowRight,
  ChevronDown,
  Diamond,
  Watch,
  Car,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import AuctionItemPlaceholder from "../pagesComponents/AuctionItemPlaceholder";
import Footer from "../pagesComponents/Footer";

const Homepage = () => {
  return (
    <>
      <div className="min-h-screen  text-white relative overflow-hidden">
        {/* Blurred Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-30"></div>

        <main>
          <section className="relative text-white py-32">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="lg:w-1/2 mb-10 lg:mb-0"
                >
                  <h1 className="text-6xl font-extrabold mb-6">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="block"
                    >
                      Discover
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="block"
                    >
                      The Future
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="block mt-2 text-transparent bg-clip-text animate-gradient-x bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400"
                    >
                      Of Auctions
                    </motion.span>
                  </h1>

                  <p className="text-xl mb-8 text-gray-300">
                    Step into a new era of luxury auctions. Bid, win, and
                    elevate your collection with futuristic ease.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-6 text-lg">
                      Start Bidding <ArrowRight className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      className="px-8 py-6 text-lg border-purple-600 text-white hover:bg-purple-600 hover:text-white bg-transparent"
                    >
                      How It Works
                    </Button>
                  </div>
                </motion.div>
                <div className="lg:w-1/2 relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Diamond, label: "Rare Gems" },
                        { icon: Watch, label: "Luxury Watches" },
                        { icon: Car, label: "Classic Cars" },
                        { icon: Diamond, label: "Fine Jewelry" },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="bg-white/10 backdrop-blur-lg p-6 rounded-lg text-center"
                        >
                          <item.icon size={48} className="mx-auto mb-4" />
                          <p className="font-semibold">{item.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-0 left-0 right-0 text-center pb-8"
            >
              <ChevronDown className="mx-auto animate-bounce" size={32} />
            </motion.div>
          </section>

          <section className="py-20 ">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold mb-12 text-center">
                Featured Auctions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item, index) => (
                  <Card key={item} className="overflow-hidden bg-gray-800/30">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AuctionItemPlaceholder index={index} />
                      <CardContent className="p-6">
                        <Badge className="mb-2 bg-purple-600 text-white">
                          Ending Soon
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">
                          {index === 0 && "Vintage Rolex Submariner"}
                          {index === 1 && "Rare Blue Diamond"}
                          {index === 2 && "Classic Ferrari 250 GTO"}
                        </h3>
                        <p className="text-gray-400 mb-4">
                          {index === 0 &&
                            "1960s collector's timepiece in excellent condition"}
                          {index === 1 &&
                            "Flawless 3.5 carat blue diamond, certified"}
                          {index === 2 &&
                            "One of only 36 ever made, fully restored"}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-400 font-bold text-lg">
                            {index === 0 && "$45,000"}
                            {index === 1 && "$3,500,000"}
                            {index === 2 && "$48,000,000"}
                          </span>
                          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            Bid Now
                          </Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 ">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold mb-12 text-center">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: <Search size={32} />,
                    title: "Discover",
                    description:
                      "Explore our curated collection of exclusive items",
                  },
                  {
                    icon: <Gavel size={32} />,
                    title: "Bid",
                    description:
                      "Place competitive bids on your desired treasures",
                  },
                  {
                    icon: <Clock size={32} />,
                    title: "Monitor",
                    description:
                      "Track auctions in real-time with live updates",
                  },
                  {
                    icon: <Star size={32} />,
                    title: "Win",
                    description:
                      "Secure your prized possessions and grow your collection",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="text-center p-6 border rounded-lg shadow-lg bg-gray-800/30"
                  >
                    <div className="bg-purple-500 text-white rounded-full p-4 inline-block mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 ">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-6">
                Join Our Exclusive Network
              </h2>
              <p className="text-xl mb-10">
                Get early access to upcoming auctions and receive personalized
                recommendations
              </p>
              <form className="max-w-md mx-auto">
                <div className="flex">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="rounded-l-full flex-grow bg-gray-700 text-white"
                  />
                  <Button
                    type="submit"
                    className="bg-purple-600 text-white rounded-r-full hover:bg-purple-700"
                  >
                    Subscribe
                  </Button>
                </div>
              </form>
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </>
  );
};

export default Homepage;
