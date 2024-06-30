import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Eye } from "lucide-react";

interface WatchersCardProps {
  watchers: string[];
}

const WatchersCard: React.FC<WatchersCardProps> = ({ watchers }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="mr-2" />
          Watchers ({watchers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {watchers.length > 0 ? (
          <ul className="space-y-1">
            {watchers.map((watcher, index) => (
              <li key={index} className="text-sm">
                {watcher}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No watchers yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WatchersCard;
