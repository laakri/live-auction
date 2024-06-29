import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const AuctionHomePage = lazy(() => import("./pages/AuctionHomePage"));
const CreateAuctionPage = lazy(() => import("./pages/CreateAuctionPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const AuctionDetailsPage = lazy(() => import("./pages/AuctionDetailsPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<AuctionHomePage />} />
        <Route path="/create-auction" element={<CreateAuctionPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/auction/:id" element={<AuctionDetailsPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
