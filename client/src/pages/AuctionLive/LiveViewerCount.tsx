import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { socketService } from "./socketService";

interface LiveViewerCountProps {
  auctionId: string;
}

const LiveViewerCount: React.FC<LiveViewerCountProps> = ({ auctionId }) => {
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    socketService.on("viewer count update", (count: number) => {
      setViewerCount(count);
    });

    return () => {
      socketService.off("viewer count update");
    };
  }, []);

  return (
    <div className="flex items-center space-x-1 text-sm">
      <Eye className="w-4 h-4" />
      <span>{viewerCount} watching</span>
    </div>
  );
};

export default LiveViewerCount;
