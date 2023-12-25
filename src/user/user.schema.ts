import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class User {
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Exclude()
  __v: number;
  @Prop({ required: true, minlength: 2, maxlength: 16 })
  username: string;
  @Prop({ required: true, minlength: 2, maxlength: 16 })
  nickname: string;
  @Prop({
    required: false,
  })
  avatar: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, select: false })
  password: string;
  @Prop({ default: Date.now() })
  createdAccount: Date;
  @Prop({ default: [] })
  friends: string[];
  @Prop({ default: [] })
  friendsRequests: string[];
  @Prop({ default: false })
  isOnline: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
