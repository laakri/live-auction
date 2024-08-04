import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import CountdownTimer from "../../components/CountdownTimer";
import { Search, Filter, Box, Flame, Clock, Zap, Trophy } from "lucide-react";
import ThreeDAuctionView from "./ThreeDAuctionViewProps";

// Fake auction data generator
const generateFakeAuctions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    _id: `auction-${i}`,
    title: `Auction Item ${i + 1}`,
    description: `This is a description for Auction Item ${i + 1}`,
    startingPrice: Math.floor(Math.random() * 1000) + 100,
    currentPrice: Math.floor(Math.random() * 2000) + 500,
    startTime: new Date(
      Date.now() + Math.random() * 86400000 * 7
    ).toISOString(),
    endTime: new Date(Date.now() + Math.random() * 86400000 * 14).toISOString(),
    images: [`fake-image-${i + 1}.jpg`],
    seller: {
      username: `user${i + 1}`,
    },
    watchedBy: Array.from(
      { length: Math.floor(Math.random() * 100) },
      () => ({})
    ),
  }));
};

const AuctionDiscoveryPage: React.FC = () => {
  const [allAuctions, setAllAuctions] = useState<any[]>([]);
  const [featuredAuctions, setFeaturedAuctions] = useState<any[]>([]);
  const [trendingAuctions, setTrendingAuctions] = useState<any[]>([]);
  const [endingSoonAuctions, setEndingSoonAuctions] = useState<any[]>([]);
  const [newAuctions, setNewAuctions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showThreeDView, setShowThreeDView] = useState(false);

  useEffect(() => {
    const auctions = generateFakeAuctions(100);
    setAllAuctions(auctions);
    setFeaturedAuctions(auctions.slice(0, 4));
    setTrendingAuctions(auctions.slice(5, 15));
    setEndingSoonAuctions(
      auctions
        .slice(15, 25)
        .sort(
          (a, b) =>
            new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
        )
    );
    setNewAuctions(
      auctions
        .slice(25, 35)
        .sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        )
    );
  }, []);

  const handleSearch = () => {
    // Implement search functionality
  };

  const AuctionCard = ({
    auction,
    featured = false,
  }: {
    auction: any;
    featured?: boolean;
  }) => (
    <Card
      className={`overflow-hidden ${
        featured
          ? "bg-gradient-to-br from-purple-900 to-indigo-900"
          : "bg-gray-900"
      } hover:shadow-lg transition-all duration-300 border-none`}
    >
      <CardContent className="p-0">
        <div className={`relative ${featured ? "h-64" : "h-48"}`}>
          <img
            src={`https://picsum.photos/seed/${auction._id}/400/300`}
            alt={auction.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3
              className={`${
                featured ? "text-2xl" : "text-lg"
              } font-bold text-white mb-2 truncate`}
            >
              {auction.title}
            </h3>
            <div className="flex items-center mb-2">
              <Avatar className="h-8 w-8 mr-2 ring-2 ring-purple-400">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${auction.seller.username}`}
                />
                <AvatarFallback>
                  {auction.seller.username.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-white font-medium">
                {auction.seller.username}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-300">Current Bid</p>
                <p className="text-lg font-bold text-white">
                  ${auction.currentPrice.toLocaleString()}
                </p>
              </div>
              <CountdownTimer
                endTime={auction.endTime}
                size="sm"
                shortLabels={true}
              />
            </div>
          </div>
        </div>
        {featured && (
          <div className="p-4 flex justify-between items-center">
            <Badge
              variant="secondary"
              className="bg-purple-500/20 text-purple-200"
            >
              {auction.watchedBy.length} watchers
            </Badge>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              Bid Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const AuctionCarousel = ({
    auctions,
    title,
    icon: Icon,
  }: {
    auctions: any[];
    title: string;
    icon: React.ElementType;
  }) => (
    <section className="mb-12">
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 mr-2 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {auctions.map((auction) => (
            <CarouselItem
              key={auction._id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <AuctionCard auction={auction} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );

  const FeaturedAuctionCard = ({ auction }: { auction: any }) => (
    <div className="group relative overflow-hidden rounded-md bg-gray-800 transition-all duration-300 hover:shadow-lg">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={`https://picsum.photos/seed/${auction._id}/400/225`}
          alt={auction.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">
          {auction.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${auction.seller.username}`}
              />
              <AvatarFallback>
                {auction.seller.username.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-300">
              {auction.seller.username}
            </span>
          </div>
          <Badge
            variant="secondary"
            className="bg-purple-500/10 text-purple-300"
          >
            {auction.watchedBy.length} watchers
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-xs text-gray-400">Current Bid</p>
            <p className="text-sm font-bold text-white">
              ${auction.currentPrice.toLocaleString()}
            </p>
          </div>
          <CountdownTimer
            endTime={auction.endTime}
            size="sm"
            shortLabels={true}
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Button
        size="sm"
        className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        Bid Now
      </Button>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-950 text-gray-100">
      {showThreeDView ? (
        <ThreeDAuctionView
          auctions={allAuctions}
          onClose={() => setShowThreeDView(false)}
        />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <h1 className="text-4xl font-light mb-4 text-center text-gray-200 ">
              Discover <span className="font-semibold">Exceptional</span>{" "}
              Auctions
            </h1>
            <div className="max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow">
                  <Input
                    placeholder="Search auctions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800/50 border-gray-700 focus:border-gold-500 text-base py-5 pl-10 pr-4"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <Button onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4 " />
                  Search
                </Button>
                <Button
                  onClick={() => setShowThreeDView(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Box className="mr-2 h-5 w-5" />
                  <span className="relative">
                    <span className="absolute inset-0 bg-white opacity-25 blur-sm rounded-full"></span>
                    <span className="relative">3D Auction View</span>
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Featured Auctions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredAuctions.map((auction) => (
                <FeaturedAuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          </section>

          <AuctionCarousel
            auctions={trendingAuctions}
            title="Trending Auctions"
            icon={Flame}
          />
          <AuctionCarousel
            auctions={endingSoonAuctions}
            title="Ending Soon"
            icon={Clock}
          />
          <AuctionCarousel
            auctions={newAuctions}
            title="New Auctions"
            icon={Zap}
          />

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Explore Categories
            </h2>
            <Tabs defaultValue="art" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-900">
                <TabsTrigger value="art">Art</TabsTrigger>
                <TabsTrigger value="electronics">Electronics</TabsTrigger>
                <TabsTrigger value="fashion">Fashion</TabsTrigger>
                <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
              </TabsList>
              <TabsContent value="art">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                  {allAuctions.slice(0, 8).map((auction) => (
                    <AuctionCard key={auction._id} auction={auction} />
                  ))}
                </div>
              </TabsContent>
              {/* Add similar TabsContent for other categories */}
            </Tabs>
          </section>

          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Trophy className="w-6 h-6 mr-2 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Top Sellers</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allAuctions.slice(0, 6).map((auction) => (
                <div key={auction._id} className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-2 ring-4 ring-purple-600">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${auction.seller.username}`}
                    />
                    <AvatarFallback>
                      {auction.seller.username.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-white">
                    {auction.seller.username}
                  </p>
                  <p className="text-sm text-gray-400">$1.2M in sales</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AuctionDiscoveryPage;
