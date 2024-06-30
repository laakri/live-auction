import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const AuctionHomePage = lazy(() => import("./pages/AuctionHomePage"));
const CreateAuctionPage = lazy(() => import("./pages/CreateAuctionPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const AuctionPage = lazy(() => import("./pages/AuctionPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<AuctionHomePage />} />
        <Route path="/create-auction" element={<CreateAuctionPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/auction/:id" element={<AuctionPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
