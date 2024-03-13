import { io } from "socket.io-client";
const url = import.meta.env.VITE_SERVICE_URL as string;
console.log('url: ', url);

export default class SocketSerivce {
    public socket;
    private room_id;

    constructor(roomId: string = "class_room") {
        this.socket = io(url);
        this.room_id = roomId;
        this.socket.on("connect", () => {
            console.log(`Socket connection established!!!!! ${this.socket.id}`);
        });
        this.socket.emit("joinRoom", roomId);
        // this.socket.emit("sendMessage", {room: "room1234", message: "Hello guys!!!!"})
        // this.socket.emit("whiteboard_event", {room: "room1234", message: "Hello nboard!!!!"})
    }

    sendToRoom(message: any, room: string = this.room_id) {
        console.log('message: ', message);
        this.socket.emit("sendMessage", { room, message });
    }

    sendWhiteboardPath(pathObj: any, room: string = this.room_id) {
        this.socket.emit("sendWhiteboard", { room: room, pathObj });
    }

    sendInboxMess(mess: any, room: string = this.room_id) {
        this.socket.emit("sendInbox", { room: room, mess });
    }
}
