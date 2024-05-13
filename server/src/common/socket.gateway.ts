// socket.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(
  {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
    },
  }
)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private room_id;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, { room, userName }: { room: string, userName: string; }) {
    client.join(room);
    console.log(`Client ${client.id} - ${userName} joined room ${room}`);
    this.server.to(this.room_id).emit('receive_user_joined', { userId: client.id, userName: userName });
    this.room_id = room;
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    console.log(`Client ${client.id} left room ${room || null}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: { room: string; message: any; }) {
    this.server.to(payload.room).emit('receive_message', payload.message);
  }

  @SubscribeMessage('sendWhiteboard')
  handleWhiteboardPath(client: Socket, payload: { room: string; pathObj: any; }) {
    console.log('payload: ', JSON.stringify(payload));
    this.server.to(payload.room).emit('receive_whiteboard_path', payload.pathObj);
  }

  @SubscribeMessage('sendWhiteboardEvent')
  handleWhiteboardEvent(client: Socket, payload: { room: string; data: any; }) {
    console.log('payload: ', JSON.stringify(payload));
    this.server.to(payload.room).emit('receive_whiteboard_event', payload.data);
  }

  @SubscribeMessage('createPoll')
  handleCreatePollEvent(client: Socket, payload) {
    console.log('payload: ', JSON.stringify(payload));
    this.server.to(this.room_id).emit('receive_create_poll_event', payload);
  }

  @SubscribeMessage('answerPoll')
  handleAnswerPollEvent(client: Socket, payload) {
    console.log('payload: ', JSON.stringify(payload));
    this.server.to(this.room_id).emit('receive_answer_poll_event', payload);
  }

  @SubscribeMessage('sendInbox')
  handleInboxMess(client: Socket, payload: { room: string; mess: any; }) {
    console.log('payload: ', payload.mess);
    client.to(payload.room || this.room_id).emit('receive_inbox_mess', payload.mess);
  }

  @SubscribeMessage('broadcastMessage')
  handleBroadcastMessage(client: Socket, payload: { message: any; }) {
    this.server.emit('receive_broadcast_message', payload.message);
  }
}

