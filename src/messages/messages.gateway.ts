import { ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NewMessageDto } from './dto/newMessage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Messages, MessagesDocument } from './messages.schema';
import { Model } from 'mongoose';

@WebSocketGateway({ namespace: 'messages', cors: true })
export class MessagesGateway {
  constructor(
    @InjectModel(Messages.name)
    private messagesService: Model<MessagesDocument>,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  async onMessage(
    @MessageBody(ValidationPipe)
    { messageText, files }: NewMessageDto,
  ) {
    this.messagesService.create({ messageText, files });
  }
}
