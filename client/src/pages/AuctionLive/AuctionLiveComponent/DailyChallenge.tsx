import React from "react";
import { Button } from "../../../components/ui/button";

const DailyChallenge: React.FC = () => {
  return (
    <section className=" p-6 rounded-lg shadow-md mt-8 border">
      <h2 className="text-2xl font-semibold mb-4">Daily Challenge</h2>
      <div className=" p-4 rounded">
        <h3 className="font-bold text-lg">Flash Auction: Rare Coin</h3>
        <p className="text-sm  mb-2">Ends in: 2h 30m</p>
        <Button>Join Now</Button>
      </div>
    </section>
  );
};

export default DailyChallenge;
