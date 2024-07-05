import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

const OpenSeaClone: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b  text-white">
      <main className="container mx-auto px-4 py-8 mt-20">
        <HeroSection />
        <TrendingSection />
        <NotableCollections />
        <CollectionGrid title="🔥 Hot Collections 🔥" />
        <CollectionGrid title="🎨 Art Masterpieces" />
        <CollectionGrid title="🎮 Gaming Legends" />
        <NFT101Section />
        <ExploreCategories />
      </main>
      <Footer />
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[600px] mb-16 rounded-2xl overflow-hidden">
      <img
        src="https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg"
        alt="Hero"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-70" />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-7xl md:text-9xl font-black text-white mb-8"
        >
          DISCOVER
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-2xl md:text-4xl font-bold mb-8"
        >
          Unearth Digital Treasures
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Button className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 transition-colors">
            Start Exploring
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

const TrendingSection: React.FC = () => {
  const trendingItems = [
    {
      name: "CryptoPunks",
      volume: "12,827 ETH",
      change: "+28.5%",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Bored Ape Yacht Club",
      volume: "9,616 ETH",
      change: "+15.2%",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Azuki",
      volume: "5,301 ETH",
      change: "+42.7%",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Doodles",
      volume: "3,785 ETH",
      change: "+19.3%",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "CloneX",
      volume: "2,954 ETH",
      change: "+31.6%",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Moonbirds",
      volume: "2,210 ETH",
      change: "+23.9%",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">🚀 Trending Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trendingItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gray-800 hover:bg-gray-750 transition-colors overflow-hidden">
              <CardContent className="flex items-center p-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg mr-6"
                />
                <div>
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className="text-gray-400">Volume: {item.volume}</p>
                  <p className="text-green-500 font-semibold">{item.change}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const NotableCollections: React.FC = () => {
  const collections = [
    {
      name: "Cyber Samurai",
      artist: "NeonKnight",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Ethereal Dreams",
      artist: "StardustArtist",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Quantum Beasts",
      artist: "FutureFauna",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Neon Cityscapes",
      artist: "UrbanPixel",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Galactic Odyssey",
      artist: "CosmicVoyager",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Digital Deities",
      artist: "CryptoMythology",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">🌟 Notable Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-60 object-cover"
                />
                <div className="p-6">
                  <p className="font-bold text-xl mb-2">{collection.name}</p>
                  <p className="text-blue-400">by {collection.artist}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const CollectionGrid: React.FC<{ title: string }> = ({ title }) => {
  const collections = [
    {
      name: "Collection 1",
      volume: "1,234 ETH",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Collection 2",
      volume: "987 ETH",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Collection 3",
      volume: "765 ETH",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Collection 4",
      volume: "543 ETH",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Collection 5",
      volume: "321 ETH",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Collection 6",
      volume: "123 ETH",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {collections.map((collection, index) => (
          <Card
            key={index}
            className="bg-gray-800 hover:bg-gray-750 transition-colors"
          >
            <CardContent className="p-4">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <p className="font-semibold truncate">{collection.name}</p>
              <p className="text-sm text-gray-400">
                Volume: {collection.volume}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center mt-8">
        <Button
          variant="outline"
          className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white transition-colors"
        >
          View All
        </Button>
      </div>
    </section>
  );
};

const NFT101Section: React.FC = () => {
  const articles = [
    {
      title: "What is an NFT?",
      description: "Learn the basics of non-fungible tokens",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      title: "How to buy an NFT",
      description: "Step-by-step guide to purchasing your first NFT",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      title: "Creating and selling NFTs",
      description: "Turn your art into blockchain assets",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">NFT 101</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <Card key={index} className="bg-gray-800 overflow-hidden">
            <CardContent className="p-0">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{article.title}</h3>
                <p className="text-gray-400">{article.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

const ExploreCategories: React.FC = () => {
  const categories = [
    {
      name: "Art",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Gaming",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Photography",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Music",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
    {
      name: "Sports",
      image:
        "https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb800.jpg",
    },
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">Explore Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="bg-gray-800 hover:bg-gray-750 transition-colors overflow-hidden"
          >
            <CardContent className="p-0 relative">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <p className="font-bold text-xl">{category.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
// ... (previous code remains the same)

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 py-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-6">Stay Connected</h3>
          <Input placeholder="Enter your email" className="mb-4" />
          <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
            Subscribe
          </Button>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-6">Join the Community</h3>
          <div className="flex space-x-4">
            {/* Add social media icons here */}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Twitter
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Discord
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Instagram
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-6">Explore</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                All NFTs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Art
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Collectibles
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Virtual Worlds
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-6">Resources</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Platform Status
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Partners
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Newsletters
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; 2024 OpenSea Clone. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default OpenSeaClone;
