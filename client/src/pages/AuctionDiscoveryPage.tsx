import React, { useState, useEffect } from "react";
import axios from "axios";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import CountdownTimer from "../components/CountdownTimer";
import { Bell, Heart, Share2, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "../pagesComponents/Footer";
import { useNavigate } from "react-router-dom";

const AuctionDiscoveryPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
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
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const [upcomingAuctions, setUpcomingAuctions] = useState<any[]>([]);
  const [trendingAuctions, setTrendingAuctions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auctions/discovery"
      );
      setUpcomingAuctions(response.data.upcomingAuctions);
      setTrendingAuctions(response.data.trendingAuctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  const handleSearch = () => {
    navigate(`/search?term=${searchTerm}&category=${category}&sort=${sort}`);
  };

  const categories = [
    { name: "Art", icon: "🎨" },
    { name: "Collectibles", icon: "🏺" },
    { name: "Electronics", icon: "📱" },
    { name: "Fashion", icon: "👗" },
    { name: "Home & Garden", icon: "🏡" },
    { name: "Jewelry", icon: "💍" },
    { name: "Sports", icon: "⚽" },
    { name: "Vehicles", icon: "🚗" },
  ];

  const CategoryBadge: React.FC<{
    name: string;
    icon: string;
    active: boolean;
    onClick: () => void;
  }> = ({ name, icon, active, onClick }) => (
    <Badge
      variant={active ? "default" : "outline"}
      className="cursor-pointer text-lg p-3 m-1 hover:bg-gray-200 dark:hover:bg-gray-800"
      onClick={onClick}
    >
      {icon} {name}
    </Badge>
  );

  return (
    <div className="w-full mx-auto">
      <section className="relative overflow-hidden bg-gray-900 mb-6">
        {upcomingAuctions.length > 0 && (
          <>
            <AnimatePresence>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110"
                style={{
                  backgroundImage: `url(${
                    upcomingAuctions[currentSlide]
                      ? "http://localhost:3000/uploads/" +
                        upcomingAuctions[currentSlide].images[0]
                      : ""
                  })`,
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />

            <div className="relative z-10 container mx-auto px-4 py-24">
              <div ref={sliderRef} className="keen-slider">
                {upcomingAuctions.map((auction) => (
                  <div key={auction._id} className="keen-slider__slide">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                      <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:w-3/5 w-full relative group"
                      >
                        <img
                          src={
                            "http://localhost:3000/uploads/" + auction.images[0]
                          }
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
                                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${auction.seller.username}`}
                                />
                                <AvatarFallback>
                                  {auction.seller.username.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xl text-white font-medium">
                                  by {auction.seller.username}
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
                              {auction.watchedBy?.length || 0} Watchers
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
                              <div className="dark:bg-pink-500/20 bg-white/80 rounded-2xl p-4 text-center flex flex-col items-center">
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
                              <Button variant="secondary" className="flex-1">
                                <Bell className="mr-2 h-5 w-5" />
                                Set Reminder
                              </Button>
                              <Button variant="secondary" size="icon">
                                <Heart className="h-5 w-5" />
                              </Button>
                              <Button variant="secondary" size="icon">
                                <Share2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {loaded && instanceRef.current && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center">
                {[
                  ...Array(
                    instanceRef.current.track.details.slides.length
                  ).keys(),
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
          </>
        )}
      </section>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center mb-8">
          {categories.map((cat) => (
            <CategoryBadge
              key={cat.name}
              name={cat.name}
              icon={cat.icon}
              active={category === cat.name.toLowerCase()}
              onClick={() => setCategory(cat.name.toLowerCase())}
            />
          ))}
        </div>

        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">
              Discover Auctions
            </h2>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="ending_soon">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Trending Live Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingAuctions.map((auction) => (
              <Card
                key={auction._id}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-4">
                  <img
                    src={"http://localhost:3000/uploads/" + auction.images[0]}
                    alt={auction.title}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    {auction.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Current bid: ${auction.currentPrice.toLocaleString()}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      {auction.watchedBy?.length || 0} watchers
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

        <Footer />
      </div>
    </div>
  );
};

export default AuctionDiscoveryPage;
