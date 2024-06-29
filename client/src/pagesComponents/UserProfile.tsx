import React from "react";
import { Button } from "../components/ui/button";

const UserProfile: React.FC = () => {
  return (
    <div className="flex items-center ">
      <span className="mr-2">Auction Stars: 1250</span>
      <Button variant="outline">Profile</Button>
    </div>
  );
};

export default UserProfile;
