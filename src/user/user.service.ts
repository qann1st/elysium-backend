import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { User, UserDocument } from './user.schema';

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
}
