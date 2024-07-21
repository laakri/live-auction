import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(serverUrl: string) {
    this.socket = io(serverUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  }

  joinAuction(auctionId: string) {
    if (!this.socket) return;
    this.socket.emit("join auction", auctionId);
  }

  leaveAuction(auctionId: string) {
    if (!this.socket) return;
    this.socket.emit("leave auction", auctionId);
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const socketService = new SocketService();
