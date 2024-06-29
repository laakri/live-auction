import React from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "../components/ui/button";
import { Gavel, UserRound } from "lucide-react";

const NavBar: React.FC = () => {
  return (
    <nav className="px-4 flex justify-between items-center border-b h-14">
      <ul className="flex space-x-2 items-center">
        <li>
          <Button variant={"link"}>
            <Gavel />
          </Button>
        </li>
        <li>
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </li>
        <li>
          <Link to="/create-auction">
            <Button variant="ghost">Create Auction</Button>
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <Button variant="ghost">Profile</Button>
          </Link>
        </li>
      </ul>
      <ul className="flex items-center gap-2 ">
        <ModeToggle />
        <Button variant={"outline"} size={"icon"}>
          <UserRound className="h-5" />
        </Button>
      </ul>
    </nav>
  );
};

export default NavBar;
