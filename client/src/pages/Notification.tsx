import React, { useEffect, useState } from "react";
import { notificationService } from "../services/notificationService";
import { format } from "date-fns";
import { Bell, Check, Trash2, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import FollowButton from "../components/FollowButton";

interface Notification {
  _id: string;
  user: string;
  type: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  relatedAuction?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getUnreadNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  /*const handleFollowRequest = async (id: string, action: string) => {
    try {
      await notificationService.handleFollowRequest(id, action);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error(`Error ${action} follow request:`, error);
    }
  };*/

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="mb-2 bg-gray-800/60 p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Notifications</h2>
        </div>
      </div>
      <div className="bg-gradient-to-t from-transparent to-gray-600/30 p-4 rounded-xl min-h-[calc(100vh-10rem)]">
        {notifications.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Notifications</CardTitle>
              <CardDescription>You're all caught up!</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification._id} className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    {notification.type === "follow" ? (
                      <>
                        <User className="h-5 w-5 mr-2 text-purple-400" />
                        Follow Request
                      </>
                    ) : (
                      <>
                        <Bell className="h-5 w-5 mr-2 text-blue-400" />
                        Notification
                      </>
                    )}
                  </span>
                  <span className="text-sm text-gray-400">
                    {format(new Date(notification.createdAt), "PPpp")}
                  </span>
                </CardTitle>
                <CardDescription>
                  {notification.isRead ? "Read" : "Unread"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notification.type === "follow" ? (
                  <div className="flex items-center gap-2 mb-4">
                    <p className="">{notification.message}</p>
                  </div>
                ) : (
                  <>
                    <p className="mb-4">{notification.message}</p>
                  </>
                )}
                <div className="flex justify-between items-center">
                  {notification.type !== "follow" &&
                    notification.relatedAuction && (
                      <Link
                        to={`/auction/${notification.relatedAuction}`}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View related auction
                      </Link>
                    )}
                  <div className="space-x-2">
                    {!notification.isRead && notification.type !== "follow" && (
                      <Button
                        onClick={() => handleMarkAsRead(notification._id)}
                        variant="outline"
                        size="sm"
                        className="text-green-400 hover:text-green-300"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}
                    {notification.type === "follow" ? (
                      <>
                        <Button
                          // onClick={() => handleFollowRequest(notification._id, "accept")}
                          variant="outline"
                          size="sm"
                          className="text-green-400 hover:text-green-300"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          //onClick={() => handleFollowRequest(notification._id, "reject")}
                          variant="outline"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleDelete(notification._id)}
                        variant="outline"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
