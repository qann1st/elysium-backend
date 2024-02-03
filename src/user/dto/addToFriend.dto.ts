import { ApiProperty } from '@nestjs/swagger';

export class AddToFriendDto {
  @ApiProperty()
  username: string;
}
