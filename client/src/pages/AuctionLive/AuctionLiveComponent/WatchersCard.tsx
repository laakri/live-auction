import React from "react";

import { Eye } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface WatchersCardProps {
  watchers: number;
}

const WatchersCard: React.FC<WatchersCardProps> = ({ watchers }) => {
  return (
    <Button
      size={"sm"}
      className="flex items-center backdrop-blur-md bg-white/30 dark:bg-gray-700/30 text-white-500 dark:text-white-500 text-md  hover:bg-white/40 dark:hover:bg-gray-700/40 transition-colors duration-200"
    >
      <Eye className="mr-2 h-4" />
      {watchers ? <span>{watchers}</span> : <span>120,6050</span>}
    </Button>
  );
};

export default WatchersCard;
