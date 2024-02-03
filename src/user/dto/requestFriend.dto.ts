import { ApiProperty } from '@nestjs/swagger';

export class RequestFriendDto {
  @ApiProperty()
  username: string;
}
