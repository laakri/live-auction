import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Search,
  LogOut,
  Settings,
  HelpCircle,
  PlusCircle,
  UserRound,
  Menu,
  Award,
  Clock,
  DollarSign,
} from "lucide-react";
import useAuthStore from "../stores/authStore";
import logo from "../assets/logoWhite.png";
import { Progress } from "../components/ui/progress";
import { ScrollArea } from "../components/ui/scroll-area";
import SearchComponent from "./SearchComponent";

interface IUser {
  username: string;
  email: string;
  profilePicture?: string;
  balance: number;
  reputation: number;
  rank: string;
  isVerified: boolean;
  level: number;
  xp: number;
  customizations: any;
  achievements: string[];
}

const Sidebar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background flex items-center justify-between p-4 shadow-md border-b ">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        {isAuthenticated && user ? (
          <div className="flex flex-col  items-start  ">
            <span className="font-bold">{user.username}</span>
            <span className="text-sm text-muted-foreground">
              Level {user.level}
            </span>
          </div>
        ) : (
          <Link to="/AuthPage">
            <Button>Log In</Button>
          </Link>
        )}
      </div>

      <div
        className={`fixed border-r inset-y-0 left-0 z-50 w-60 bg-background text-foreground shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        <div className="flex-shrink-0">
          <div className="p-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 ">
              <img src={logo} alt="" className="h-7" />
              <span className="text-xl font-bold text-primary">Lexura</span>
            </Link>
            <div className="border-gray-700 text-gray-200 text-xs py-1 px-2 bg-secondary rounded-md">
              BETA
            </div>
          </div>
          <div className="border-t border-gray-600 opacity-20"></div>
          <div>
            <SearchComponent />
          </div>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-4">
            {isAuthenticated ? (
              <UserProfile user={user as IUser} logout={logout} />
            ) : (
              <AuthButtons />
            )}
          </div>
          <div className="border-t border-gray-600 opacity-20 my-4"></div>
          <nav className="px-4">
            <NavSection title="General">
              <NavLink
                to="/AuctionDiscovery"
                icon={<Search className="h-4 w-4" />}
                label="Discovery"
              />
              <NavLink
                to="/history"
                icon={<Clock className="h-4 w-4" />}
                label="History"
              />
              <NavLink
                to="/earn"
                icon={<DollarSign className="h-4 w-4" />}
                label="Earn"
              />
            </NavSection>

            {isAuthenticated && (
              <NavSection title="User">
                <NavLink
                  to="/UserProfile"
                  icon={<UserRound className="h-4 w-4" />}
                  label="Profile"
                />
                <NavLink
                  to="/create-auction"
                  icon={<PlusCircle className="h-4 w-4" />}
                  label="Create Auction"
                />
                <NavLink
                  to="/achievements"
                  icon={<Award className="h-4 w-4" />}
                  label={`Achievements (${user?.achievements?.length ?? 0})`}
                />
              </NavSection>
            )}

            <NavSection title="Support">
              <NavLink
                to="/AuctionGuides/SafeBidding"
                icon={<HelpCircle className="h-4 w-4" />}
                label="Help Center"
              />
              <NavLink
                to="/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
              />
            </NavSection>
          </nav>
        </ScrollArea>

        {isAuthenticated && (
          <>
            <div className="border-t border-gray-600 opacity-20"></div>

            <div className="p-4 mt-auto ">
              <Button
                className="w-full bg-red-500/30 text-red-300 hover:bg-red-600/30 hover:text-red-100 transition-colors duration-300"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

const NavSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
      {title}
    </h3>
    {children}
  </div>
);

const NavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
}> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center px-2 py-2 rounded-md hover:bg-secondary transition-colors"
  >
    <span className="mr-3 text-primary">{icon}</span>
    <span>{label}</span>
  </Link>
);

const UserProfile: React.FC<{ user: IUser; logout: () => void }> = ({
  user,
}) => (
  <div className="p-2 rounded-lg ">
    <div className="flex items-center space-x-4 mb-4">
      <div>
        <p className="font-bold text-sm tracking-[1px]">{user.username}</p>
        <p className="text-sm text-muted-foreground">Level {user.level}</p>
      </div>
    </div>
    <div className="flex justify-between items-center  bg-background  rounded space-x-2 ">
      <span className="text-sm font-medium text-gray-400">Balance:</span>
      <span className=" text-sm  text-purple-400">
        ${user.balance.toFixed(0)}
      </span>
    </div>
    <div className="my-2">
      <Progress value={((user.xp % 100) / 100) * 100} className="h-1 " />
    </div>
    <div className="flex justify-between text-sm mb-4">
      <span>XP: {user.xp}</span>
      <span>Next Level: {Math.ceil(user.xp / 100) * 100}</span>
    </div>
  </div>
);

const AuthButtons: React.FC = () => (
  <div>
    <div className="text-sm text-muted-foreground mb-3">
      Log in to access all features
    </div>
    <Link to="/AuthPage" className="block mb-2">
      <Button className="w-full">Log In</Button>
    </Link>
  </div>
);

export default Sidebar;
