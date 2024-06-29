import React from "react";
import { Routes, Route } from "react-router-dom";
import AuctionHomePage from "./pages/AuctionHomePage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import UserProfilePage from "./pages/UserProfilePage";
import AuctionDetailsPage from "./pages/AuctionDetailsPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AuctionHomePage />} />
      <Route path="/create-auction" element={<CreateAuctionPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/auction/:id" element={<AuctionDetailsPage />} />
    </Routes>
  );
};

export default AppRoutes;
