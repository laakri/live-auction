import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Users } from "lucide-react";

const Alliances: React.FC<{ user: any }> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alliances</CardTitle>
      </CardHeader>
      <CardContent>
        {user.alliance ? (
          <div>
            <h3 className="font-semibold">Current Alliance</h3>
            <p>{user.alliance.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Users className="text-blue-500 mb-2" size={48} />
            <p>You're not part of any alliance yet.</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Find an Alliance
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Alliances;
