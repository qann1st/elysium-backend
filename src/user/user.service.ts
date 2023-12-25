import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { RequestFriendDto } from './dto/requestFriend.dto';
import { User, UserDocument } from './user.schema';
import { AcceptDeclineFriendDto } from './dto/acceptDeclineFriend.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userService: Model<UserDocument>,
  ) {}

  public async createUser({
    username,
    nickname,
    email,
    password,
  }: CreateUserDto): Promise<UserDocument> {
    const newUser = await this.userService.create({
      username,
      nickname,
      email,
      password,
    });
    return newUser;
  }

  public async updateNickname({
    id,
    nickname,
  }: {
    id: string;
    nickname: string;
  }): Promise<UserDocument> {
    const updatedUser = await this.userService.findByIdAndUpdate(id, {
      nickname,
    });
    return updatedUser;
  }

  public async updateAvatar({
    id,
    avatar,
  }: {
    id: string;
    avatar: string;
  }): Promise<UserDocument> {
    const updatedUser = await this.userService.findByIdAndUpdate(id, {
      avatar,
    });
    return updatedUser;
  }

  public async requestFriend(
    @Body(ValidationPipe) { username }: RequestFriendDto,
    user: User,
  ) {
    const userExists = await this.userService.findOne({ username });
    if (username === user.username) {
      throw new BadRequestException('User equal to your user');
    }
    if (!userExists) {
      throw new BadRequestException('User no exists');
    }
    if (userExists.friendsRequests.includes(user._id)) {
      throw new BadRequestException('User already have your request');
    }
    await this.userService.findOneAndUpdate(
      { username },
      {
        $addToSet: { friendsRequests: user._id.toString() },
      },
    );
    return 'Successful';
  }

  public async acceptRequest(
    @Body(ValidationPipe) { _id }: AcceptDeclineFriendDto,
    user: User,
  ) {
    const dbUser = await this.userService.findById(user._id);
    if (!dbUser.friendsRequests.includes(_id)) {
      throw new NotFoundException('Request not found');
    }
    const editedUser = await this.userService.findByIdAndUpdate(
      user._id,
      {
        $pull: { friendsRequests: _id },
        $addToSet: { friends: _id.toString() },
      },
      { new: true },
    );
    await this.userService.findByIdAndUpdate(_id, {
      $addToSet: { friends: user._id.toString() },
    });
    return editedUser;
  }
}
