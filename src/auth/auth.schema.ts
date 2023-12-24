import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/user.schema';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Exclude()
  __v: number;
  @Type(() => User)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true })
  user: User;
  @Prop({ type: Array<string>, default: [] })
  refreshTokens: Array<string>;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
