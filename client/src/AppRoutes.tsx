import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AuctionRoom from "./pages/AuctionLive/AuctionRoom";

const AuctionHomePage = lazy(() => import("./pages/AuctionHomePage"));
const CreateAuctionPage = lazy(() => import("./pages/CreateAuctionPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const AuctionPage = lazy(() => import("./pages/AuctionLive/AuctionPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<AuctionHomePage />} />
        <Route path="/create-auction" element={<CreateAuctionPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/auction/:id" element={<AuctionPage />} />
        <Route path="/AuctionRoom/:id" element={<AuctionRoom />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
