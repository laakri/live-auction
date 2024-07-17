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
    <div className="w-full mx-auto mt-12">
      <section className="relative overflow-hidden bg-gray-900 mb-6 h-[39rem] border border-red">
        {upcomingAuctions.length > 0 && (
          <>
            <AnimatePresence>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
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
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 container mx-auto h-full flex items-center ">
              <div ref={sliderRef} className="keen-slider h-4/5 w-full">
                {upcomingAuctions.map((auction) => (
                  <div key={auction._id} className="keen-slider__slide">
                    <div className="relative h-full w-full rounded-2xl overflow-hidden">
                      <img
                        src={
                          "http://localhost:3000/uploads/" + auction.images[0]
                        }
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="text-4xl font-bold text-white mb-4">
                          {auction.title}
                        </h3>
                        <p className="text-lg text-gray-200 mb-6 line-clamp-2">
                          {auction.description}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="flex items-center mb-4">
                              <Avatar className="h-10 w-10 mr-3 ring-2 ring-purple-400">
                                <AvatarImage
                                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${auction.seller.username}`}
                                />
                                <AvatarFallback>
                                  {auction.seller.username.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-lg text-white font-medium">
                                  {auction.seller.username}
                                </p>
                                <p className="text-sm text-gray-300">
                                  Top Rated Seller
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-4">
                              <div>
                                <p className="text-sm text-gray-400">
                                  Starting Bid
                                </p>
                                <p className="text-2xl font-bold text-white">
                                  ${auction.startingPrice.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">
                                  Watchers
                                </p>
                                <p className="text-2xl font-bold text-white">
                                  {auction.watchedBy?.length || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400 mb-2">
                              Starts In
                            </p>
                            <CountdownTimer
                              endTime={auction.startTime}
                              size="lg"
                              shortLabels={true}
                            />
                          </div>
                        </div>
                        <div className="flex mt-6 space-x-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/10 hover:bg-white/20"
                          >
                            <Bell className="mr-2 h-4 w-4" />
                            Remind Me
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/10 hover:bg-white/20"
                          >
                            <Heart className="mr-2 h-4 w-4" />
                            Watch
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/10 hover:bg-white/20"
                          >
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {loaded && instanceRef.current && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center">
                {[
                  ...Array(
                    instanceRef.current.track.details.slides.length
                  ).keys(),
                ].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => instanceRef.current?.moveToIdx(idx)}
                    className={`w-2 h-2 rounded-full mx-1 focus:outline-none transition-all duration-300 ${
                      currentSlide === idx
                        ? "bg-white scale-125"
                        : "bg-white/40 hover:bg-white/60"
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
