import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { User, UserDocument } from 'src/user/user.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CallsService {
  constructor(
    @InjectModel(User.name) private dbUserService: Model<UserDocument>,
  ) {}

  async onConnection(client: Socket) {
    const id = jwt.decode(client.handshake.query.userID.toString());
    const user = await this.dbUserService.findByIdAndUpdate(id, {
      socketId: client.id,
      isOnline: true,
    });

    user.friends.map((friend) => {
      this.dbUserService.findById(friend).then((friend) => {
        client.to(friend.socketId).emit('user', user);
      });
    });
  }

  async onDisconnect(client: Socket) {
    const id = jwt.decode(client.handshake.query.userID.toString());
    const user = await this.dbUserService.findByIdAndUpdate(id, {
      isOnline: false,
    });

    user.friends.map((friend) => {
      this.dbUserService.findById(friend).then((friend) => {
        client.to(friend.socketId).emit('friends', user);
      });
    });
  }

  async makeCall(client: Socket, data) {
    client.to(data.to).emit('make-call', {
      offer: data.offer,
      socket: client.id,
    });
  }

  async makeAnswer(client: Socket, data) {
    client.to(data.to).emit('make-answer', {
      answer: data.answer,
      socket: client.id,
    });
  }

  async rejectCall(client: Socket, data) {
    client.to(data.from).emit('reject-call', {
      socket: client.id,
    });
  }
}
