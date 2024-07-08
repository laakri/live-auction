import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";

const UserPreferences: React.FC<{ user: any }> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notifications</Label>
            <Switch
              id="notifications"
              checked={user.preferences.notifications}
              onCheckedChange={() => {
                /* Update user preferences */
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="privateProfile">Private Profile</Label>
            <Switch
              id="privateProfile"
              checked={user.preferences.privateProfile}
              onCheckedChange={() => {
                /* Update user preferences */
              }}
            />
          </div>
          <div>
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              value={user.customizations.theme}
              onChange={() => {
                /* Update user theme */
              }}
              className="mt-1 block w-full p-2 border rounded"
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;
