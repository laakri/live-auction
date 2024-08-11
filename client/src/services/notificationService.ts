import axios from "axios";
import useAuthStore from "../stores/authStore";

const API_URL = "http://localhost:3000/api/notifications";

const getAuthHeader = () => {
  const { token } = useAuthStore.getState();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const notificationService = {
  async getUnreadNotifications() {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },

  async markAsRead(notificationId: string) {
    const response = await axios.put(
      `${API_URL}/${notificationId}/read`,
      {},
      getAuthHeader()
    );
    return response.data;
  },

  async createNotification(data: {
    type: string;
    message: string;
    relatedAuction?: string;
  }) {
    const response = await axios.post(API_URL, data, getAuthHeader());
    return response.data;
  },

  async deleteNotification(notificationId: string) {
    const response = await axios.delete(
      `${API_URL}/${notificationId}`,
      getAuthHeader()
    );
    return response.data;
  },
};
