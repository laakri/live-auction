import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AuctionDetail from "./pages/AuctionLive/test/AuctionDetail";
import ProtectedRoute from "./pagesComponents/ProtectedRoute";
import HomePage from "./pages/HomePage";

const LuxuryAuthPage = lazy(() => import("./pages/Auth/LuxuryAuthPage"));
const AuctionHomePage = lazy(() => import("./pages/AuctionHomePage"));
const CreateAuctionPage = lazy(() => import("./pages/CreateAuctionPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const AuctionPage = lazy(() => import("./pages/AuctionLive/AuctionPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AuctionHomePage" element={<AuctionHomePage />} />
        <Route path="/AuthPage" element={<LuxuryAuthPage />} />
        <Route path="/create-auction" element={<CreateAuctionPage />} />
        <Route path="/auction/:id" element={<AuctionPage />} />
        <Route path="/AuctionRoom/:id" element={<AuctionDetail />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
