// socket.gateway.ts
import { ConfigService } from '@nestjs/config';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// const { Configuration, OpenAIApi } = require("openai");
// import { Configuration, OpenAIApi } from 'openai';

@WebSocketGateway(
  {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
    },
  }
)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private openai;
  private configuration;
  private room_id;
  @WebSocketServer() server: Server;
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
  async handleInboxMess(client: Socket, payload: { room: string; mess: any; }) {
    console.log('Received message: ', payload.mess);

    try {
      // const response = await this.openai.createCompletion({
      //   model: "text-davinci-003",
      //   prompt: payload.mess,
      //   temperature: 0.5,
      //   max_tokens: 100,
      // });

      // const aiResponse = response.data.choices[0].text;
      // console.log('AI Response: ', aiResponse);

      client.to(payload.room || this.room_id).emit('receive_inbox_mess', payload.mess);
      // client.to(payload.room || this.room_id).emit('receive_inbox_mess', aiResponse);
    } catch (error) {
      // console.error('Error generating AI response: ', error);
      // client.to(payload.room || this.room_id).emit('receive_inbox_mess', 'Error generating AI response');
    }
  }

  @SubscribeMessage('askForUnmute')
  handleAskForUnmute(client: Socket, payload: any) {
    this.server.emit('receive_unmute_request', payload);
  }

  @SubscribeMessage('broadcastMessage')
  handleBroadcastMessage(client: Socket, payload: { message: any; }) {
    this.server.emit('receive_broadcast_message', payload.message);
  }
}

