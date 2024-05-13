import { Socket, io } from "socket.io-client";
const url = import.meta.env.VITE_SOCKET_SERVICE_URL || import.meta.env.VITE_SERVICE_URL;

class SocketService {
  public socket: Socket | null;
  private roomId: string;
  private userName: string;

  constructor(roomId: string = "class_room") {
    this.socket = null;
    this.roomId = roomId;
    this.userName = JSON.parse(localStorage.getItem("user-details") || "{}").userName || "Dummy User";
    this.connect(roomId);
  }

  connect(roomId: string = "class_room"): void {
    this.socket = io(url);
    this.roomId = roomId;
    this.socket.emit("joinRoom", { room: roomId, userName: this.userName });
    this.setupSocketListeners();
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
    this.socket.on(event, callback);
    return () => {
      this.socket?.off(event, callback);
    };
  }

  emit(event: string, data: any): void {
    if (!this.socket) return;
    this.socket.emit(event, data);
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

  sendCreatePoll(data: any, room: string = this.roomId){
    console.log('room: ', room);
    console.log('data: ', data);
    this.socket?.emit("createPoll", data);
  }

  sendAnswerPoll(data: any, room: string = this.roomId){
    console.log('room: ', room);
    console.log('data: ', data);
    this.socket?.emit("answerPoll", data);
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