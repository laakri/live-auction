import { create } from "zustand";
import { notificationService } from "../services/notificationService";

interface NotificationState {
  notifications: any[];
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: any) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  fetchNotifications: async () => {
    try {
      const notifications = await notificationService.getUnreadNotifications();
      set({ notifications });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  },
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },
}));
