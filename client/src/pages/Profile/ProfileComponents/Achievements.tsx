import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Award } from "lucide-react";

const Achievements: React.FC<{ user: any }> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {user.achievements.map((achievement: string, index: number) => (
            <Badge
              key={index}
              variant="outline"
              className="flex items-center p-2"
            >
              <Award className="mr-2 text-yellow-500" />
              {achievement}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;
