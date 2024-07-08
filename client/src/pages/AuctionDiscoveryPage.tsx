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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import CountdownTimer from "../components/CountdownTimer";
import {
  Star,
  BookOpen,
  Clock,
  Tag,
  Bell,
  Heart,
  Share2,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "../pagesComponents/Footer";

const AuctionDiscoveryPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slideChanged(slider) {
        if (slider.track.details) {
          setCurrentSlide(slider.track.details.rel);
        }
      },
      created(slider) {
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
          }, 2000);
        }
        slider.on("created", () => {
          if (slider.container) {
            slider.container.addEventListener("mouseover", () => {
              mouseOver = true;
              clearNextTimeout();
            });
            slider.container.addEventListener("mouseout", () => {
              mouseOver = false;
              nextTimeout();
            });
          }
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const [auctions, setAuctions] = useState<any[]>([]);
  const [trendingAuctions, setTrendingAuctions] = useState<any[]>([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchAuctions();
  }, [currentPage, searchTerm, category]);

  const fetchAuctions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auctions/discovery",
        {
          params: {
            page: currentPage,
            search: searchTerm,
            category: category,
          },
        }
      );
      setAuctions(response.data.auctions);
      setTrendingAuctions(response.data.trendingAuctions);
      setUpcomingAuctions(response.data.upcomingAuctions);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const generatePaginationItems = () => {
    let items = [];
    const totalPaginationItems = 1; // Adjust this number to show more or fewer page numbers

    if (totalPages <= totalPaginationItems) {
      // If total pages are less than or equal to totalPaginationItems, show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is far from the first page
      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis-1" />);
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is far from the last page
      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-2" />);
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
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
    <div className="w-full mx-auto">
      <section className="relative overflow-hidden bg-gray-900 mb-6">
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
                      src={"http://localhost:3000/uploads/" + auction.images[0]}
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

        {loaded && instanceRef.current && instanceRef.current.track.details && (
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

      <div className="container mx-auto px-4">
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Discover Auctions</h2>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name.toLowerCase()}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <Card key={auction._id}>
                <CardContent className="p-4">
                  <img
                    src={"http://localhost:3000/uploads/" + auction.images[0]}
                    alt={auction.title}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    {auction.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300  mb-2">
                    Current bid: ${auction.currentPrice}
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
          <div className="mt-8 flex justify-center">
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {generatePaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Upcoming Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAuctions.map((auction) => (
              <Card key={auction._id}>
                <CardContent className="p-4">
                  <img
                    src={"http://localhost:3000/uploads/" + auction.images[0]}
                    alt={auction.title}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    {auction.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300  mb-2">
                    Current bid: ${auction.currentPrice}
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
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Trending Live Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingAuctions.map((auction) => (
              <Card key={auction._id}>
                <CardContent className="p-4">
                  <img
                    src={"http://localhost:3000/uploads/" + auction.images[0]}
                    alt={auction.title}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    {auction.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300  mb-2">
                    Current bid: ${auction.currentPrice}
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
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setCategory(category.name.toLowerCase())}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
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
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {tip.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ">
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
        <Footer />
      </div>
    </div>
  );
};

export default AuctionDiscoveryPage;
