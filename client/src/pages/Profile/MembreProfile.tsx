import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import {
  AlertCircle,
  Award,
  BarChart2,
  Edit2Icon,
  Gavel,
  Plus,
  Settings,
  User,
  Wallet,
  Shield,
  Search,
  Coins,
  Eye,
  Clock,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "../../components/ui/use-toast";
import FollowButton from "../../components/FollowButton";
import { motion } from "framer-motion";
import CountdownTimer from "../../components/CountdownTimer";

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
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("auctions");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user data based on the ID
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/userProfile/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setUser(userData.user);
        setAuctions(userData.auctions);
      } catch (error:any) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [id]);
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
                <FollowButton userId="668bcd9b094cf69a24d29977" loggedInUserId="668f9dd6beb6ca13b3c07ff5"/>
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
          <div className="flex flex-wrap gap-2">
           
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Link to="/UserVerification">
              <Button variant={"outline"} className="w-full sm:w-auto">
                Get verified
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/create-auction">
              <FeatureCard
                icon={<Gavel className="w-6 h-6 text-blue-400" />}
                title="Create Auction"
                description="List your items for auction. Set starting prices and auction duration."
              />
            </Link>
            <Link to="/AuctionGuides/SafeBidding">
              <FeatureCard
                icon={<Shield className="w-6 h-6 text-green-400" />}
                title="Safe Bidding"
                description="Learn how to bid safely and avoid common auction scams."
                beta={true}
              />
            </Link>
            <Link to="/AuctionGuides/VerifySellers">
              <FeatureCard
                icon={<Search className="w-6 h-6 text-purple-400" />}
                title="Verify Sellers"
                description="Tips on how to verify seller authenticity and item legitimacy."
              />
            </Link>
          </div>
        </div>
        {/* Referral section */}
        <Card className="bg-purple-950/30 py-2 px-4 rounded-xl my-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-purple-400" />
              <p className="text-sm">
                Share your referral code and earn rewards when friends join!
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent text-purple-200 w-full sm:w-auto"
              onClick={() => {
                navigator.clipboard.writeText(referralCode);

                toast({
                  title: "Referral Code Copied!",
                  description:
                    "The referral code has been copied to your clipboard.",
                  duration: 3000,
                });
              }}
            >
              <span className="mr-2">COPY CODE : </span> {referralCode}
            </Button>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
            <TabsTrigger value="overview">
              <BarChart2 className="w-4 h-4 mr-2 text-blue-500" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Award className="w-4 h-4 mr-2 text-yellow-500" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="auctions">
              <Gavel className="w-4 h-4 mr-2 text-green-500" />
              Auctions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Card className="bg-gray-900/40 p-6 rounded-xl flex flex-col justify-between">
                <h3 className="font-semibold mb-4">Wallet</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-2xl font-bold">
                      ${balance}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Virtual Currency</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      {virtualCurrencyBalance}{" "}
                      <Coins className="text-yellow-500 h-5 w-5" />
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Wallet className="w-4 h-4 mr-2 text-green-500" />
                    Add Funds
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="achievements">
            <Card className="bg-gray-900/40 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Your Achievements</h3>
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
            <Card className="bg-gray-900/40 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Your Auctions</h3>
              
              
    {auctions && auctions.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((auction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <img
                 src={`http://localhost:3000/uploads/${(auction as any).image}`}
                 alt={(auction as any).title}
                 className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1">
                <span className="text-xs text-white font-medium">
                  {(auction as any).watchersCount}
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-100 truncate mb-1">
                {(auction as any).title}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
               
                <span className="text-xs text-gray-400">
                  {(auction as any).seller?.username}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  {(auction as any).timeLeft && (
                    <CountdownTimer
                      endTime={(auction as any).timeLeft.value || ""}
                      size="sm"
                      shortLabels={true}
                    />
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>${(auction as any).currentPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="px-3 pb-3">
              <Link to={`/auction/${(auction as any)._id}`}>
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
        ))}
      </div>
    ) : (
      <p className="text-gray-400">You have no active auctions.</p>
    )}
  </Card>
</TabsContent>
         
        </Tabs>
      </main>
    </div>
  );
};

export default MembreProfile;
