import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Edit2, Bell, Shield, User } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import { Label } from "../../components/ui/label";
import { toast } from "../../components/ui/use-toast";

const UserSettings = () => {
  const { user, updateUser } = useAuthStore();
  const { token } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    notifications: user?.preferences.notifications || true,
    privacyMode: user?.preferences.privateProfile || false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleChange = async (name: string) => {
    const updatedValue = !formData[name as keyof typeof formData];
    setFormData({
      ...formData,
      [name]: updatedValue,
    });

    if (name === "privacyMode") {
      try {
        if (user) {
          user.preferences.privateProfile = formData.privacyMode;
          console.log("Privacy mode updated successfully");
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error("Error updating privacy mode:", error);
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUser(
        {
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          preferences: {
            privateProfile: formData.privacyMode,
            notifications: formData.notifications,
          },
        },
        toast
      );

      setEditMode(false);
      toast({ title: "Success", description: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({ title: "Error", description: "Failed to update profile." });
    }
  };

  const tabs = [
    {
      id: "profile",
      label: "Edit Profile",
      icon: <User className="w-4 h-4 mr-2" />,
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: <Shield className="w-4 h-4 mr-2" />,
    },
    {
      id: "notifications",
      label: "Notification Preferences",
      icon: <Bell className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-2 bg-gray-800/60 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Account Settings</h2>
          <Button variant={"secondary"} onClick={() => setEditMode(!editMode)}>
            <Edit2 className="w-4 h-4 mr-2" />
            {editMode ? "Cancel" : "Edit"}
          </Button>
        </div>
        <div className="flex space-x-4 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center pb-2 px-1 ${
                activeTab === tab.id
                  ? "border-b-2 border-white text-white"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-t from-transparent to-gray-600/30 p-6 rounded-xl min-h-[calc(100vh-10rem)]">
        <Card className="border-none p-6 rounded-xl">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {activeTab === "profile" && (
                <>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>
                </>
              )}
              {activeTab === "privacy" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <Label htmlFor="privacyMode">Privacy Mode</Label>
                  </div>
                  <Switch
                    id="privacyMode"
                    checked={formData.privacyMode}
                    onCheckedChange={() => handleToggleChange("privacyMode")}
                    disabled={!editMode}
                  />
                </div>
              )}
              {activeTab === "notifications" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <Label htmlFor="notifications">Notifications</Label>
                  </div>
                  <Switch
                    id="notifications"
                    checked={formData.notifications}
                    onCheckedChange={() => handleToggleChange("notifications")}
                    disabled={!editMode}
                  />
                </div>
              )}
            </div>
            {editMode && (
              <Button
                variant={"secondary"}
                type="submit"
                className="mt-6 w-full bg-purple-600/40"
              >
                Save Changes
              </Button>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;
