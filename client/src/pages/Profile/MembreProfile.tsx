import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Award, BarChart2, Gavel, User, Eye, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "../../components/ui/use-toast";
import FollowButton from "../../components/FollowButton";
import { motion } from "framer-motion";
import CountdownTimer from "../../components/CountdownTimer";
import { Auction } from "../../services/auctionService";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

interface User {
  username: string;
  email: string;
  bio: string;
  level: number;
  xp: number;
  balance: number;
  virtualCurrencyBalance: number;
  loyaltyTier: string;
  achievements: string[];
  rank: string;
  referralCode: string;
  customizations: {
    theme: string;
    avatar: string;
  };
}
const MembreProfile = () => {
  const { id } = useParams(); // Extracting user ID from URL params
  const [user, setUser] = useState<User | null>(null);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("auctions");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [auctionsPerPage] = useState(6);

  useEffect(() => {
    // Fetch user data based on the ID
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/userProfile/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setUser(userData.user);
        setAuctions(userData.auctions);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [id]);

  // Get current posts
  const indexOfLastAuction = currentPage * auctionsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - auctionsPerPage;
  const currentAuctions = auctions.slice(
    indexOfFirstAuction,
    indexOfLastAuction
  );

  // Change page
  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  console.log(auctions);
  if (!user) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const {
    username,
    email,
    bio,
    level,
    xp,
    balance,
    virtualCurrencyBalance,
    loyaltyTier,
    achievements,
    rank,
    referralCode,
    customizations,
  } = user;

  const calculateLevelProgress = (xp: number, level: number) => {
    const xpForNextLevel = level * 100;
    return ((xp % 100) / xpForNextLevel) * 100;
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
            src={`http://localhost:3000/uploads/${auction.images}`}
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
              <AvatarFallback>{auction.seller?.username}</AvatarFallback>
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

  const FeatureCard = ({
    icon,
    title,
    description,
    beta = false,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    beta?: boolean;
  }) => (
    <div className="bg-gray-800/40 rounded-lg p-4 flex flex-col items-start space-y-2 hover:bg-gray-700/60 transition-colors cursor-pointer">
      <div className="flex items-center space-x-2">
        {icon}
        <h3 className="text-white font-semibold">{title}</h3>
        {beta && (
          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
            BETA
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
  return (
    <div className="min-h-screen text-white">
      <div className="relative overflow-hidden rounded-xl m-2">
        {/* Blurred background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${customizations?.avatar})`,
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />

        {/* Content overlay */}
        <div className="relative bg-gray-900/80 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
              <div className="h-28 w-28 sm:h-48 sm:w-48 rounded-xl overflow-hidden">
                <img
                  src={
                    customizations?.avatar ||
                    "https://i.gyazo.com/b1bd4a6d8d5ef4399ac5b2e7a4fc5951.png"
                  }
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold mb-1">
                  {username}
                </h1>
                <p className="text-gray-300 text-sm">{email}</p>
                <p className="text-gray-300 text-sm">{bio}</p>
                <div className="flex justify-left mt-3">
                  <FollowButton
                    userId="668bcd9b094cf69a24d29977"
                    loggedInUserId="668f9dd6beb6ca13b3c07ff5"
                  />
                </div>
              </div>
            </div>
            <Card className="bg-gray-900/30 p-4 border-none rounded-xl w-full sm:w-auto mt-4 sm:mt-0">
              <div className="flex flex-row sm:flex-col justify-between gap-4 items-center">
                <div className="text-center">
                  <span className="text-xs font-semibold text-purple-300">
                    LOYALTY TIER
                  </span>
                  <h3 className="text-lg font-semibold capitalize">
                    {loyaltyTier}
                  </h3>
                </div>
                <Button className="w-full bg-black/30 hover:bg-black/90 text-white">
                  View Benefits
                  <span className="ml-2">→</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
          <div className="flex flex-wrap gap-2"></div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
            <TabsTrigger value="auctions">
              <Gavel className="w-4 h-4 mr-2 text-green-500" />
              Auctions
            </TabsTrigger>
            <TabsTrigger value="overview">
              <BarChart2 className="w-4 h-4 mr-2 text-blue-500" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Award className="w-4 h-4 mr-2 text-yellow-500" />
              Achievements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              <Card className="bg-gray-900/40 p-6 rounded-xl">
                <h3 className="font-semibold mb-4">Profile Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Level</p>
                    <p className="text-2xl font-bold">{level}</p>
                    <Progress
                      value={calculateLevelProgress(xp, level)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">XP</p>
                    <p className="text-2xl font-bold">{xp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Rank</p>
                    <p className="text-2xl font-bold capitalize">{rank}</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="achievements">
            <Card className="bg-gray-900/40 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">{username} 's Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements && achievements.length > 0 ? (
                  achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="p-2">
                      {achievement}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-400">No achievements yet.</p>
                )}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="auctions">
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              <Card className="bg-gray-900/40 p-6 rounded-xl">
                <h3 className="font-semibold mb-4">{username} 's  Auctions</h3>

                {auctions && auctions.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentAuctions.map((auction) => (
                        <AuctionCard key={auction._id} auction={auction} />
                      ))}
                    </div>

                    {/* Pagination */}
                    
                    <Pagination className="mt-5 ">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) paginateBack();
                            }}
                          />
                        </PaginationItem>
                        {[
                          ...Array(
                            Math.ceil(auctions.length / auctionsPerPage)
                          ).keys(),
                        ].map((pageNum) => (
                          <PaginationItem key={pageNum + 1}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === pageNum + 1}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNum + 1);
                              }}
                            >
                              {pageNum + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                currentPage <
                                Math.ceil(auctions.length / auctionsPerPage)
                              )
                                paginateFront();
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                ) : (
                  <p className="text-gray-400">You have no active auctions.</p>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MembreProfile;
