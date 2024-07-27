import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
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
  Settings,
  User,
  Wallet,
} from "lucide-react";
import useAuthStore from "../../stores/authStore";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, error } = useAuthStore();

  if (!user) return <div>User Not Found Login again</div>;
  if (error) return <div>Error: {error}</div>;

  const {
    username,
    email,
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

  return (
    <div className="min-h-screen text-white">
      <div className="relative overflow-hidden rounded-xl m-4">
        {/* Blurred background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://app.kits.ai/_next/image?url=https%3A%2F%2Farpeggi-prod-public.s3.us-west-2.amazonaws.com%2Fvoice-models%2Fimages%2Ffallback%2F1.jpeg&w=64&q=75')",
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />

        {/* Content overlay */}
        <div className="relative bg-zinc-900/60 p-6 ">
          <div className="flex items-center  justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="h-32 w-32 rounded-xl overflow-hidden">
                <img
                  src={
                    customizations?.avatar ||
                    "https://i.gyazo.com/b1bd4a6d8d5ef4399ac5b2e7a4fc5951.png"
                  }
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-1">{username}</h1>
                <p className="text-zinc-300 text-sm">{email}</p>
              </div>
            </div>
            <Card className="ml-auto bg-purple-900/80 p-4 rounded-xl">
              <div className="flex flex-col justify-between gap-4 items-center   ">
                <div>
                  <span className="text-xs font-semibold text-purple-300">
                    LOYALTY TIER
                  </span>
                  <h3 className="text-lg font-semibold capitalize">
                    {loyaltyTier}
                  </h3>
                </div>
                <Button variant="secondary" className=" w-full">
                  View Benefits
                  <span className="ml-2">→</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto">
        {/* Referral section */}
        <Card className="bg-purple-950/30 py-2 px-4 my-8 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-purple-400" />
              <p className="text-sm">
                Share your referral code and earn rewards when friends join!
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent text-purple-200 "
            >
              <span className="mr-2">COPY CODE : </span> {referralCode}
            </Button>
          </div>
        </Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
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
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2 text-red-500" />
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-zinc-900 p-6 rounded-xl">
                <h3 className="font-semibold mb-4">Profile Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-zinc-400">Level</p>
                    <p className="text-2xl font-bold">{level}</p>
                    <Progress
                      value={calculateLevelProgress(xp, level)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">XP</p>
                    <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Rank</p>
                    <p className="text-2xl font-bold capitalize">{rank}</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-zinc-900 p-6 rounded-xl">
                <h3 className="font-semibold mb-4">Wallet</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-zinc-400">Balance</p>
                    <p className="text-2xl font-bold">
                      ${balance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Virtual Currency</p>
                    <p className="text-2xl font-bold">
                      {virtualCurrencyBalance.toLocaleString()} VC
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
            <Card className="bg-zinc-900 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Your Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements && achievements.length > 0 ? (
                  achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="p-2">
                      {achievement}
                    </Badge>
                  ))
                ) : (
                  <p className="text-zinc-400">No achievements yet.</p>
                )}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="auctions">
            <Card className="bg-zinc-900 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Your Auctions</h3>
              <p className="text-zinc-400">You have no active auctions.</p>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card className="bg-zinc-900 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  <span>Edit Profile</span>
                  <Edit2Icon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  <span>Privacy Settings</span>
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  <span>Notification Preferences</span>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserProfile;
