import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Gavel,
  UserRound,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  PlusCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import useAuthStore from "../stores/authStore";

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  return (
    <nav className="bg-background border-b px-6 py-3 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <Gavel className="h-8 w-8 text-primary" /> */}
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-purple-700 dark:from-gray-50 dark:to-purple-400">
              LEXURA
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  Explore <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/auctions/art">Art</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/auctions/electronics">Electronics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/auctions/fashion">Fashion</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/auctions/collectibles">Collectibles</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/how-it-works">
              <Button variant="ghost">How It Works</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost">About Us</Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <Input
            type="text"
            placeholder="Search auctions..."
            className="w-full"
          />
          <Button variant="ghost" size="icon" className="-ml-9 h-7 w-7">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Side Navigation */}
        <div className="flex items-center space-x-4">
          <ModeToggle />

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserRound className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[12rem]">
                <DropdownMenuLabel className="text-center">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="flex items-center">
                    <UserRound className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/create-auction" className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Create Auction</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/help" className="flex items-center">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help Center</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant={"ghost"}
                    className="flex items-center  text-destructive-foreground w-full"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/AuthPage">
              <Button>Log In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
