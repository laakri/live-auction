import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pagesComponents/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AuctionDiscoveryPage from "./pages/AuctionDiscoveryPage";
import UserProfile from "./pages/Profile/UserProfile";
import UserVerificationPage from "./pages/UserVerificationPage";
import SearchResults from "./pages/SearchResults";
import VoiceConverterPage from "./pages/Profiletest";

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
        <Route path="/AuctionDiscovery" element={<AuctionDiscoveryPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:categoryName" element={<SearchResults />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/UserVerification" element={<UserVerificationPage />} />
        <Route path="/create-auction" element={<CreateAuctionPage />} />
        <Route path="/VoiceConverterPage" element={<VoiceConverterPage />} />
        <Route path="/auction/:id" element={<AuctionPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
