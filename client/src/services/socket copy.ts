import { Socket, io } from "socket.io-client";
const url = import.meta.env.VITE_SOCKET_SERVICE_URL || import.meta.env.VITE_SERVICE_URL;

class SocketService {
  public socket: Socket | null;
  private roomId: string;
  private userName: string;
  private encryptionKey: string;

  constructor(roomId: string = "class_room", encryptionKey: string) {
    this.socket = null;
    this.roomId = roomId;
    this.userName = JSON.parse(localStorage.getItem("user-details") || "{}").userName || "Dummy User";
    this.encryptionKey = encryptionKey;
    this.connect(roomId);
  }

  connect(roomId: string = "class_room"): void {
    this.socket = io(url);
    this.roomId = roomId;
    this.socket.emit("joinRoom", { room: roomId, userName: this.userName });
    this.setupSocketListeners();
  }

  emit(event: string, data: any): void {
    if (!this.socket) return;
    const encryptedData = this.encryptData(data);
    this.socket.emit(event, encryptedData);
  }

  private async encryptData(data: any): Promise<any> {
    const encoder = new TextEncoder();
    const key = await this.getEncryptionKey(this.encryptionKey);
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    if (key && key instanceof CryptoKey) {
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: "AES-CBC",
          iv: iv,
        },
        key,
        encoder.encode(JSON.stringify(data))
      );

      return { data: btoa(String.fromCharCode(...new Uint8Array(encrypted))), iv: btoa(String.fromCharCode(...iv)) };
    } else {
      throw new Error("Invalid encryption key format");
    }
  }

  private async decryptData(encryptedData: { data: string; iv: string; }): Promise<any> {
    const decoder = new TextDecoder();
    const key = await this.getEncryptionKey(this.encryptionKey);
    return window.crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: Uint8Array.from(atob(encryptedData.iv), (c) => c.charCodeAt(0)),
      },
      key,
      Uint8Array.from(atob(encryptedData.data), (c) => c.charCodeAt(0))
    ).then((decrypted) => {
      return JSON.parse(decoder.decode(decrypted));
    });
  }

  private async getEncryptionKey(key: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);

    if (keyData.length === 16 || keyData.length === 32) {
      return await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "AES-CBC" },
        false,
        ["encrypt", "decrypt"]
      );
    } else {
      throw new Error("AES key data must be 128 or 256 bits");
    }
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log(`Socket connection established!!!!! ${this.socket?.id}`);
    });

    this.socket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });
  }

  on(event: string, callback: (...args: any[]) => void): () => void {
    if (!this.socket) return () => { };
    this.socket.on(event, (encryptedData: any) => {
      this.decryptData(encryptedData).then((decryptedData) => {
        callback(decryptedData);
      });
    });
    return () => {
      this.socket?.off(event, callback);
    };
  }

  disconnect(): void {
    if (!this.socket) return;
    this.socket.off(); // Remove all event listeners
    this.socket.disconnect();
  }

  sendMessageToRoom(message: any, room: string = this.roomId): void {
    console.log("message: ", message);
    this.emit("sendMessage", { room, message });
  }

  sendCreatePoll(data: any, room: string = this.roomId) {
    console.log('room: ', room);
    console.log('data: ', data);
    this.emit("createPoll", data);
  }

  sendAnswerPoll(data: any, room: string = this.roomId) {
    console.log('room: ', room);
    console.log('data: ', data);
    this.emit("answerPoll", data);
  }

  sendWhiteboardPathToRoom(pathObj: any, room: string = this.roomId): void {
    console.log('pathObj: ', pathObj);
    this.emit("sendWhiteboard", { room, pathObj });
  }

  sendWhiteboardEventToRoom(data: any, room: string = this.roomId): void {
    console.log('sendWhiteboardEventToRoom-data: ', data);
    this.emit("sendWhiteboardEvent", { room, data });
  }

  sendInboxMessageToRoom(message: any, room: string = this.roomId): void {
    console.log('{ room, mess: message }: ', { room, mess: message });
    this.emit("sendInbox", { room, mess: message });
  }
}

export default SocketService;
