// src/pages/AuctionDiscoveryPage.tsx
import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import CountdownTimer from "../components/CountdownTimer";
import { Star, BookOpen, Clock, Tag, Bell, Heart, Share2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const AuctionDiscoveryPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
  });
  // Dummy data
  const upcomingAuctions = [
    {
      _id: "1",
      title: "Vintage Watch Collection",
      seller: "JohnDoe",
      description:
        "A stunning collection of rare vintage watches from the 1960s.",
      startingPrice: 5000,
      startTime: new Date(Date.now() + 86400000).toISOString(),
      images: ["https://i.gyazo.com/6e75db48bd9146e531514a8699e9b626.jpg"],
      watchCount: 1289,
    },
    {
      _id: "2",
      title: "Modern Art Masterpiece",
      seller: "ArtLover",
      description: "An original painting by a renowned contemporary artist.",
      startingPrice: 10000,
      startTime: new Date(Date.now() + 172800000).toISOString(),
      images: ["https://i.gyazo.com/e1af01c3d363876a5babe76a33a2ecb5.png"],
      watchCount: 1289,
    },
    {
      _id: "3",
      title: "Classic Car Auction",
      seller: "CarEnthusiast",
      description: "A beautifully restored 1957 Chevrolet Bel Air.",
      startingPrice: 50000,
      startTime: new Date(Date.now() + 259200000).toISOString(),
      images: ["https://i.gyazo.com/6e75db48bd9146e531514a8699e9b626.jpg"],
      watchCount: 1289,
    },
  ];

  const liveAuctions = [
    {
      _id: "4",
      title: "Rare Comic Book Collection",
      currentPrice: 2000,
      endTime: new Date(Date.now() + 3600000).toISOString(),
      watchedBy: new Array(156),
      images: ["https://i.gyazo.com/e1af01c3d363876a5babe76a33a2ecb5.png"],
    },
    {
      _id: "5",
      title: "Antique Furniture Set",
      currentPrice: 3500,
      endTime: new Date(Date.now() + 7200000).toISOString(),
      watchedBy: new Array(98),
      images: ["https://i.gyazo.com/e1af01c3d363876a5babe76a33a2ecb5.png"],
    },
    {
      _id: "6",
      title: "Limited Edition Sneakers",
      currentPrice: 500,
      endTime: new Date(Date.now() + 5400000).toISOString(),
      watchedBy: new Array(243),
      images: ["https://i.gyazo.com/e1af01c3d363876a5babe76a33a2ecb5.png"],
    },
    {
      _id: "7",
      title: "Signed Sports Memorabilia",
      currentPrice: 1500,
      endTime: new Date(Date.now() + 3600000).toISOString(),
      watchedBy: new Array(178),
      images: ["https://i.gyazo.com/e1af01c3d363876a5babe76a33a2ecb5.png"],
    },
    {
      _id: "8",
      title: "Luxury Handbag",
      currentPrice: 4000,
      endTime: new Date(Date.now() + 7200000).toISOString(),
      watchedBy: new Array(112),
      images: ["https://i.gyazo.com/e1af01c3d363876a5babe76a33a2ecb5.png"],
    },
    {
      _id: "9",
      title: "Rare Wine Collection",
      currentPrice: 7500,
      endTime: new Date(Date.now() + 5400000).toISOString(),
      watchedBy: new Array(89),
      images: ["https://i.gyazo.com/e1af01c3d363876a5babe76a33a2ecb5.png"],
    },
  ];

  const categories = [
    { name: "Art", icon: "🎨", count: 1250 },
    { name: "Collectibles", icon: "🏺", count: 980 },
    { name: "Electronics", icon: "📱", count: 1500 },
    { name: "Fashion", icon: "👗", count: 2200 },
    { name: "Home & Garden", icon: "🏡", count: 1100 },
    { name: "Jewelry", icon: "💍", count: 750 },
    { name: "Sports", icon: "⚽", count: 600 },
    { name: "Vehicles", icon: "🚗", count: 400 },
  ];

  const featuredSellers = [
    {
      id: "1",
      name: "VintageVault",
      rating: 4.9,
      totalSales: 1250,
      avatar: "https://example.com/seller1.jpg",
    },
    {
      id: "2",
      name: "TechTreasures",
      rating: 4.8,
      totalSales: 980,
      avatar: "https://example.com/seller2.jpg",
    },
    {
      id: "3",
      name: "LuxuryLane",
      rating: 4.7,
      totalSales: 1500,
      avatar: "https://example.com/seller3.jpg",
    },
    {
      id: "4",
      name: "CollectorsCorner",
      rating: 4.9,
      totalSales: 2200,
      avatar: "https://example.com/seller4.jpg",
    },
  ];

  const recentlyEndedAuctions = [
    {
      id: "10",
      title: "Antique Pocket Watch",
      finalPrice: 1200,
      winner: "TimelessCollector",
      endedAt: "2 hours ago",
    },
    {
      id: "11",
      title: "Signed First Edition Book",
      finalPrice: 5000,
      winner: "RareBookLover",
      endedAt: "5 hours ago",
    },
    {
      id: "12",
      title: "Vintage Movie Poster",
      finalPrice: 800,
      winner: "CinemaEnthusiast",
      endedAt: "1 day ago",
    },
    {
      id: "13",
      title: "Rare Coin Collection",
      finalPrice: 3500,
      winner: "NumismaticsNerd",
      endedAt: "1 day ago",
    },
  ];

  const auctionTips = [
    {
      id: "1",
      title: "How to Spot Authentic Items",
      excerpt: "Learn the key signs of authenticity in various collectibles...",
      readTime: 5,
    },
    {
      id: "2",
      title: "Bidding Strategies for Success",
      excerpt: "Master the art of strategic bidding with these expert tips...",
      readTime: 7,
    },
    {
      id: "3",
      title: "Understanding Auction Terms",
      excerpt: "Demystify common auction terminology and conditions...",
      readTime: 4,
    },
    {
      id: "4",
      title: "Maximizing Your Auction Profits",
      excerpt: "Discover how to get the best value when selling at auction...",
      readTime: 6,
    },
  ];

  return (
    <div className=" w-full mx-auto  ">
      <section className="relative  overflow-hidden bg-gray-900 mb-6">
        {/* Dynamic background */}
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110"
            style={{
              backgroundImage: `url(${upcomingAuctions[currentSlide]?.images[0]})`,
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 " />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-24">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold mb-16 text-white text-center tracking-tight"
          >
            Upcoming{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-300 to-purple-400">
              Auctions
            </span>
          </motion.h2>
          <div ref={sliderRef} className="keen-slider">
            {upcomingAuctions.map((auction, index) => (
              <div key={auction._id} className="keen-slider__slide">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:w-3/5 w-full relative group"
                  >
                    <img
                      src={auction.images[0]}
                      alt={auction.title}
                      className="rounded-3xl shadow-2xl w-full h-96 object-cover transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-8 left-8 right-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-4xl font-bold text-white mb-4">
                        {auction.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-4 ring-2 ring-purple-500">
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${auction.seller}`}
                            />
                            <AvatarFallback>
                              {auction.seller.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xl text-white font-medium">
                              by {auction.seller}
                            </p>
                            <p className="text-sm text-gray-300">
                              Top Rated Seller
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-purple-500/20 text-purple-300 px-3 py-1"
                        >
                          {auction.watchCount} Watchers
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="lg:w-2/5 w-full"
                  >
                    <Card className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-lg border border-white/20 overflow-hidden">
                      <CardContent className="p-8">
                        <p className="mb-8 text-white/90 text-xl leading-relaxed">
                          {auction.description}
                        </p>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                          <div className="bg-purple-500/20 rounded-2xl p-4 text-center">
                            <p className="text-purple-300 mb-1 text-sm">
                              Starting Bid
                            </p>
                            <p className="text-3xl font-bold text-white">
                              ${auction.startingPrice.toLocaleString()}
                            </p>
                          </div>
                          <div className="dark:bg-pink-500/20 bg-white/80 rounded-2xl p-4 text-center flex flex-col items-center ">
                            <p className="dark:text-pink-300 text-black mb-1 text-sm">
                              Auction Starts In
                            </p>
                            <CountdownTimer
                              endTime={auction.startTime}
                              size="lg"
                              shortLabels={true}
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center">
                            <Bell className="mr-2 h-5 w-5" />
                            Set Reminder
                          </button>
                          <button className="bg-white/10 text-white p-4 rounded-xl hover:bg-white/20 transition-all duration-300">
                            <Heart className="h-6 w-6" />
                          </button>
                          <button className="bg-white/10 text-white p-4 rounded-xl hover:bg-white/20 transition-all duration-300">
                            <Share2 className="h-6 w-6" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation dots */}
        {loaded && instanceRef.current && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center">
            {[
              ...Array(instanceRef.current.track.details.slides.length).keys(),
            ].map((idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-3 h-3 rounded-full mx-2 focus:outline-none transition-all duration-300 ${
                  currentSlide === idx
                    ? "bg-white scale-150"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <div className="container">
        {/* Second Section: Live Auctions with High Watchers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Trending Live Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveAuctions.map((auction) => (
              <Card key={auction._id}>
                <CardContent className="p-4">
                  <img
                    src={auction.images[0]}
                    alt={auction.title}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    {auction.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Current bid: ${auction.currentPrice}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      {auction.watchedBy.length} watchers
                    </Badge>
                    <CountdownTimer
                      endTime={auction.endTime}
                      size="sm"
                      shortLabels
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Third Section: Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {category.count} items
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fourth Section: Featured Sellers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Featured Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSellers.map((seller) => (
              <Card key={seller.id}>
                <CardContent className="p-4 text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={seller.avatar} />
                    <AvatarFallback>
                      {seller.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1">{seller.name}</h3>
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{seller.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {seller.totalSales} sales
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fifth Section: Recently Ended Auctions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Recently Ended</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-left p-2">Final Price</th>
                  <th className="text-left p-2">Winner</th>
                  <th className="text-left p-2">Ended</th>
                </tr>
              </thead>
              <tbody>
                {recentlyEndedAuctions.map((auction) => (
                  <tr key={auction.id} className="border-b">
                    <td className="p-2">{auction.title}</td>
                    <td className="p-2">${auction.finalPrice}</td>
                    <td className="p-2">{auction.winner}</td>
                    <td className="p-2">{auction.endedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sixth Section: Auction Tips & Guides */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Auction Tips & Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {auctionTips.map((tip) => (
              <Card key={tip.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{tip.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{tip.readTime} min read</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuctionDiscoveryPage;
