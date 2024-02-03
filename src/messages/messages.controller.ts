import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@Controller('messages/')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}
}
