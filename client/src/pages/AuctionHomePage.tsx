// src/pages/AuctionHomePage.tsx
import React from "react";
import UserProfile from "./AuctionLive/AuctionLiveComponent/UserProfile";
import LiveAuctions from "./AuctionLive/AuctionLiveComponent/LiveAuctions";
import DailyChallenge from "./AuctionLive/AuctionLiveComponent/DailyChallenge";
import ChatWidget from "./AuctionLive/AuctionLiveComponent/ChatWidget";

const AuctionHomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Auction Central</h1>
        <UserProfile />
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <LiveAuctions />
          <DailyChallenge />
        </div>
        <aside>
          <ChatWidget />
        </aside>
      </main>

      <footer className="mt-12 text-center">
        <p>&copy; 2024 Auction Central. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuctionHomePage;
