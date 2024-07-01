// src/services/socketService.ts
import { io, Socket } from "socket.io-client";

interface Bid {
  id: string;
  amount: number;
  username: string;
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  content: string;
  username: string;
  timestamp: Date;
}

class SocketService {
  private socket: Socket | null = null;
  private auctionId: string | null = null;

  connect(serverUrl: string) {
    this.socket = io(serverUrl, {
      transports: ["websocket", "polling"],
    });
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    this.socket.on("new bid", (bidData: Bid) => {
      console.log("New bid received:", bidData);
      // Handle the new bid (e.g., update state, trigger a notification)
    });

    this.socket.on("new message", (messageData: ChatMessage) => {
      console.log("New chat message received:", messageData);
      // Handle the new chat message (e.g., update state, display in chat)
    });
  }

  joinAuction(auctionId: string) {
    if (!this.socket) return;
    this.auctionId = auctionId;
    this.socket.emit("join auction", auctionId);
  }

  leaveAuction() {
    if (!this.socket || !this.auctionId) return;
    this.socket.emit("leave auction", this.auctionId);
    this.auctionId = null;
  }

  placeBid(amount: number) {
    if (!this.socket || !this.auctionId) return;
    this.socket.emit("place bid", { auctionId: this.auctionId, amount });
  }

  sendChatMessage(content: string) {
    if (!this.socket || !this.auctionId) return;
    this.socket.emit("send message", { auctionId: this.auctionId, content });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const socketService = new SocketService();
