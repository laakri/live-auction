import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
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
import { User, Award, Gift, Zap, Coins, Users, Settings } from "lucide-react";
import ProfileInfo from "./ProfileComponents/ProfileInfo";
import Achievements from "./ProfileComponents/Achievements";
import VirtualCurrency from "./ProfileComponents/VirtualCurrency";
import Alliances from "./ProfileComponents/Alliances";
import UserPreferences from "./ProfileComponents/UserPreferences";
import useAuthStore from "../../stores/authStore";

const UserProfile: React.FC = () => {
  const { user, error } = useAuthStore();

  //   if (loading) return <div>Loading...</div>;
  if (!user) return <div>User Not Found Login again </div>;
  if (error) return <div>Error: {error}</div>;

  const calculateLevelProgress = (xp: number, level: number) => {
    const xpForNextLevel = level * 100;
    return ((xp % 100) / xpForNextLevel) * 100;
  };

  return (
    <div className="container mx-auto p-4 mt-14">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.profilePicture} alt={user.username} />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <Badge variant="outline">{user.rank}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Zap className="text-yellow-500" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Level {user.level}</span>
                <span className="text-sm font-medium">{user.xp} XP</span>
              </div>
              <Progress
                value={calculateLevelProgress(user.xp, user.level)}
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">${user.balance.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Balance</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.reputation}</p>
              <p className="text-sm text-muted-foreground">Reputation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5 ">
          <TabsTrigger value="profile">
            <User className="mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="mr-2" /> Achievements
          </TabsTrigger>
          <TabsTrigger value="currency">
            <Coins className="mr-2" /> Currency
          </TabsTrigger>
          <TabsTrigger value="alliances">
            <Users className="mr-2" /> Alliances
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings className="mr-2" /> Preferences
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileInfo user={user} />
        </TabsContent>
        <TabsContent value="achievements">
          <Achievements user={user} />
        </TabsContent>
        <TabsContent value="currency">
          <VirtualCurrency user={user} />
        </TabsContent>
        <TabsContent value="alliances">
          <Alliances user={user} />
        </TabsContent>
        <TabsContent value="preferences">
          <UserPreferences user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
