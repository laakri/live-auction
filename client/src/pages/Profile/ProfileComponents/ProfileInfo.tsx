import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Gift, Star } from "lucide-react";

const ProfileInfo: React.FC<{ user: any }> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Bio</h3>
            <p>{user.bio || "No bio provided"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{user.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Loyalty Tier</h3>
            <Badge variant="outline" className="capitalize">
              {user.loyaltyTier}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold">Free Auctions Remaining</h3>
            <div className="flex items-center">
              <Gift className="mr-2 text-green-500" />
              <span>{user.freeAuctionsRemaining}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Referral Code</h3>
            <p>{user.referralCode}</p>
          </div>
          <div>
            <h3 className="font-semibold">Verification Status</h3>
            {user.isVerified ? (
              <Badge>
                Verified <Star className="ml-1" size={14} />
              </Badge>
            ) : (
              <Badge variant="destructive">Not Verified</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
