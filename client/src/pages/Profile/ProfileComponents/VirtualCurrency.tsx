import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Coins } from "lucide-react";

const VirtualCurrency: React.FC<{ user: any }> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Currency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <Coins className="text-yellow-500 mr-2" size={48} />
          <span className="text-4xl font-bold">
            {user.virtualCurrencyBalance}
          </span>
        </div>
        <p className="text-center mt-4">
          Use your virtual currency to unlock special items and features!
        </p>
      </CardContent>
    </Card>
  );
};

export default VirtualCurrency;
