import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  PlusCircle,
  UserRound,
  Menu,
  X,
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed  top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-sm shadow-md"
            : "bg-background"
        }`}
      >
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-purple-700 dark:from-gray-50 dark:to-purple-400">
                  Luxury
                </span>
              </Link>
              <div className="hidden lg:flex ml-10 items-center space-x-4">
                <ExploreDropdown />
                <NavLink to="/how-it-works" label="How It Works" />
                <NavLink to="/about" label="About Us" />
                <NavLink to="/AuctionDiscovery" label="Discovery" />
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <SearchBar />
              <ModeToggle />
              <NotificationBell />
              {isAuthenticated ? <UserMenu logout={logout} /> : <LoginButton />}
            </div>

            <div className="lg:hidden flex items-center">
              <ModeToggle />
              <NotificationBell />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-background transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col space-y-4 mt-4">
            <SearchBar />
            <ExploreDropdown isMobile />
            <NavLink to="/how-it-works" label="How It Works" />
            <NavLink to="/about" label="About Us" />
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="py-2">
                  Profile
                </Link>
                <Link to="/create-auction" className="py-2">
                  Create Auction
                </Link>
                <Link to="/settings" className="py-2">
                  Settings
                </Link>
                <Link to="/help" className="py-2">
                  Help Center
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start px-0 text-destructive"
                  onClick={logout}
                >
                  Log out
                </Button>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const NavLink: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <Link
    to={to}
    className="text-foreground hover:text-primary transition-colors"
  >
    {label}
  </Link>
);

const ExploreDropdown: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      className={`flex items-center ${
        isMobile ? "w-full justify-between" : ""
      }`}
    >
      Explore <ChevronDown className="h-4 ml-1" />
    </DropdownMenuTrigger>
    <DropdownMenuContent className={isMobile ? "w-full" : ""}>
      <DropdownMenuItem>
        <Link to="/auctions/art" className="w-full">
          Art
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/auctions/electronics" className="w-full">
          Electronics
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/auctions/fashion" className="w-full">
          Fashion
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/auctions/collectibles" className="w-full">
          Collectibles
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const SearchBar: React.FC = () => (
  <div className="relative w-full lg:w-64">
    <Input
      type="text"
      placeholder="Search auctions..."
      className="w-full pr-8"
    />
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-0 top-0 h-full"
      aria-label="Search"
    >
      <Search className="h-4 w-4" />
    </Button>
  </div>
);

const NotificationBell: React.FC = () => (
  <Button variant="ghost" size="icon" aria-label="Notifications">
    <Bell className="h-5 w-5" />
  </Button>
);

const UserMenu: React.FC<{ logout: () => void }> = ({ logout }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="User menu">
        <UserRound className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Link to="/profile" className="flex items-center w-full">
          <UserRound className="mr-2 h-4 w-4" />
          Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/create-auction" className="flex items-center w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Auction
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/settings" className="flex items-center w-full">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/help" className="flex items-center w-full">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help Center
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Button
          variant="ghost"
          className="flex items-center w-full text-destructive"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const LoginButton: React.FC = () => (
  <Link to="/AuthPage">
    <Button variant="outline">Log In</Button>
  </Link>
);

export default NavBar;
