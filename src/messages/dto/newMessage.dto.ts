import { ApiProperty } from '@nestjs/swagger';

export class NewMessageDto {
  @ApiProperty()
  messageText: string;

  @ApiProperty()
  files?: string;
}
