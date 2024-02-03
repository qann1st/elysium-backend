import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { CallsGateway } from './calls.gateway';
import { CallsService } from './calls.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [CallsGateway, CallsService],
})
export class CallsModule {}
