import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { Document } from 'mongoose';
import { MFile } from 'src/file/interfaces/mfile.class';

export type MessagesDocument = Messages & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Messages {
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Exclude()
  __v: number;
  @Prop({ minlength: 1, maxlength: 1000, required: true })
  messageText: string;
  @Prop({ default: Date.now() })
  createdMessage: Date;
  @Prop()
  files: MFile[];
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
