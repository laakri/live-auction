import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pagesComponents/ProtectedRoute";
import HomePage from "./pages/HomePage";
import UserVerificationPage from "./pages/UserVerificationPage";
import SearchResults from "./pages/Discovery/SearchResults";
import UserProfile from "./pages/Profile/UserProfile";
import AuctionGuides from "./pages/AuctionGuides";
import VerifySellers from "./pages/AuctionGuides/VerifySellers";
import SafeBidding from "./pages/AuctionGuides/SafeBidding";
import AuctionTips from "./pages/AuctionGuides/AuctionTips";

const LuxuryAuthPage = lazy(() => import("./pages/Auth/LuxuryAuthPage"));
const CreateAuctionPage = lazy(() => import("./pages/CreateAuctionPage"));
const AuctionPage = lazy(() => import("./pages/AuctionLive/AuctionPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AuthPage" element={<LuxuryAuthPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:categoryName" element={<SearchResults />} />
        <Route path="/UserVerification" element={<UserVerificationPage />} />
        <Route path="/create-auction" element={<CreateAuctionPage />} />
        <Route path="/auction/:id" element={<AuctionPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/UserProfile" element={<UserProfile />} />
        </Route>
        <Route path="/AuctionGuides" element={<AuctionGuides />}>
          <Route index element={<AuctionTips />} />
          <Route path="SafeBidding" element={<SafeBidding />} />
          <Route path="VerifySellers" element={<VerifySellers />} />
          <Route path="AuctionTips" element={<AuctionTips />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
