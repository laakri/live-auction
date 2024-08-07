import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { socketService } from "../socketService";
import { Button } from "../../../components/ui/button";

interface LiveViewerCountProps {
  auctionId: string;
  initialViewers: number;
}

const LiveViewerCount: React.FC<LiveViewerCountProps> = ({
  auctionId,
  initialViewers,
}) => {
  const [viewerCount, setViewerCount] = useState(initialViewers);

  useEffect(() => {
    socketService.on("viewer count update", (count: number) => {
      setViewerCount(count);
    });

    return () => {
      socketService.off("viewer count update");
    };
  }, []);

  return (
    <Button
      size="sm"
      variant="ghost"
      className="flex gap-2 rounded-2sxl items-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30 text-white-500 dark:text-white-500 text-md  hover:bg-white/40 dark:hover:bg-gray-700/40 transition-colors duration-200 "
    >
      <Eye className="h-3 w-3" />
      <span className="font-semibold ">{viewerCount}</span>
      <span className="text-xs opacity-80">Watching</span>
    </Button>
  );
};

export default LiveViewerCount;
