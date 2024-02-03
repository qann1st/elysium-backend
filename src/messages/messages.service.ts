import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessagesService {
  constructor(
    private userService: UserService,
    @InjectModel(User.name) private dbUserService: Model<UserDocument>,
  ) {}
}
