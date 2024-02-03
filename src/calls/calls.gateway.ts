import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CallsService } from './calls.service';

@WebSocketGateway({ namespace: 'calls', cors: true })
export class CallsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly callsService: CallsService) {}

  async handleConnection(client: Socket) {
    await this.callsService.onConnection(client);
  }

  async handleDisconnect(client: Socket) {
    await this.callsService.onDisconnect(client);
  }

  @SubscribeMessage('make-call')
  async makeCall(client: Socket, @MessageBody() data) {
    await this.callsService.makeCall(client, data);
  }

  @SubscribeMessage('make-answer')
  async makeAnswer(client: Socket, @MessageBody() data) {
    await this.callsService.makeAnswer(client, data);
  }

  @SubscribeMessage('reject-call')
  async rejectCall(client: Socket, @MessageBody() data) {
    await this.callsService.rejectCall(client, data);
  }
}
