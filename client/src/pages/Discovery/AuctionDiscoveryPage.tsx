import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
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
import { Search, Flame, Clock, Zap, Eye } from "lucide-react";
import { Auction, getDiscoveryAuctions } from "../../services/auctionService";
import { Link } from "react-router-dom";
import { Skeleton } from "../../components/ui/skeleton";
import { motion } from "framer-motion";

const AuctionDiscoveryPage: React.FC = () => {
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);
  const [trendingAuctions, setTrendingAuctions] = useState<Auction[]>([]);
  const [endingSoonAuctions, setEndingSoonAuctions] = useState<Auction[]>([]);
  const [newAuctions, setNewAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDiscoveryAuctions();
        console.log("Fetched data:", data);
        setFeaturedAuctions(data.featuredAuctions || []);
        setTrendingAuctions(data.trendingAuctions || []);
        setEndingSoonAuctions(data.endingSoonAuctions || []);
        setNewAuctions(data.newAuctions || []);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setError("Failed to load auctions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleSearch = () => {
    // Implement search functionality
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-2xl mt-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Discover Auctions</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Search
          </Button>
          <Link
            to="/3dAuction"
            className="bg-blue-600 hover:bg-blue-700 inline-block px-4 py-2 rounded text-white"
          >
            3D View
          </Link>
        </div>
      </div>

      <>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Featured Auctions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredAuctions.length > 0 ? (
              featuredAuctions.map((auction) => (
                <FeaturedAuctionCard key={auction._id} auction={auction} />
              ))
            ) : (
              <div className="text-white">No featured auctions available</div>
            )}
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
          <h2 className="text-2xl font-bold mb-4 text-white">
            Browse by Category
          </h2>
          <Tabs defaultValue="all" className="w-full mb-4">
            <TabsList className="mb-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="art">Art</TabsTrigger>
              <TabsTrigger value="electronics">Electronics</TabsTrigger>
              <TabsTrigger value="fashion">Fashion</TabsTrigger>
              <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredAuctions.map((auction) => (
                  <AuctionCard key={auction._id} auction={auction} />
                ))}
              </div>
            </TabsContent>
            {/* Add content for other categories */}
          </Tabs>
        </section>
      </>
    </div>
  );
};

const AuctionCard = ({ auction }: { auction: Auction }) => {
  if (!auction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={`http://localhost:3000/uploads/${auction.image}`}
          alt={auction.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1">
          <span className="text-xs text-white font-medium">
            {auction.watchersCount}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-100 truncate mb-1">
          {auction.title}
        </h3>
        <div className="flex items-center space-x-2 mb-2">
          <Avatar className="w-4 h-4">
            <AvatarImage src={auction.seller?.avatar} />
            <AvatarFallback>{auction.seller?.username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-400">
            {auction.seller?.username}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            {auction.timeLeft && (
              <CountdownTimer
                endTime={auction.timeLeft.value || ""}
                size="sm"
                shortLabels={true}
              />
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>${auction.currentPrice?.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <Link to={`/auction/${auction._id}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-purple-600 bg-opacity-50 backdrop-blur-lg text-white text-xs font-medium py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
          >
            Bid Now
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

const FeaturedAuctionCard = ({ auction }: { auction: Auction }) => {
  if (!auction) {
    return <div className="text-white">No featured auction data</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg overflow-hidden shadow-lg p-4 relative"
    >
      <img
        src={`http://localhost:3000/uploads/${auction.image}`}
        alt={`Image of ${auction.title}`}
        className="absolute top-0 left-0 w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2 truncate">
          {auction.title}
        </h3>
        <p className="text-sm text-gray-300">
          Price: ${auction.currentPrice?.toLocaleString() || "N/A"}
        </p>
        <p className="text-sm text-gray-300">
          Seller: {auction.seller?.username || "Unknown"}
        </p>
      </div>
    </motion.div>
  );
};

interface AuctionCarouselProps {
  auctions: Auction[];
  title: string;
  icon: React.ElementType;
}

const AuctionCarousel = ({
  auctions,
  title,
  icon: Icon,
}: AuctionCarouselProps) => {
  if (!auctions || auctions.length === 0) {
    return null;
  }

  return (
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
};

const SkeletonLoader = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-48" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <section className="mb-12">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <SkeletonAuctionCard key={index} />
          ))}
        </div>
      </section>

      {[...Array(3)].map((_, index) => (
        <SkeletonCarousel key={index} />
      ))}

      <section className="mb-12">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="flex space-x-2 mb-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-10 w-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <SkeletonAuctionCard key={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

const SkeletonAuctionCard = () => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md">
      <Skeleton className="w-full h-40" />
      <div className="p-3">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="px-3 pb-3">
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    </div>
  );
};

const SkeletonCarousel = () => {
  return (
    <section className="mb-12">
      <div className="flex items-center mb-4">
        <Skeleton className="w-6 h-6 mr-2" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="flex space-x-4 overflow-x-auto">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex-shrink-0 w-64">
            <SkeletonAuctionCard />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AuctionDiscoveryPage;
