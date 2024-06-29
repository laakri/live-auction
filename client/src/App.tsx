// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AuctionHomePage from "./pages/AuctionHomePage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import UserProfilePage from "./pages/UserProfilePage";
import AuctionDetailsPage from "./pages/AuctionDetailsPage";
import { ThemeProvider } from "./components/theme-provider";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div>
          <nav className=" p-4">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-auction" className="">
                  Create Auction
                </Link>
              </li>
              <li>
                <Link to="/profile" className="">
                  Profile
                </Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<AuctionHomePage />} />
            <Route path="/create-auction" element={<CreateAuctionPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/auction/:id" element={<AuctionDetailsPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
