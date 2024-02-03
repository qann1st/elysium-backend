import { ApiProperty } from '@nestjs/swagger';

export class UpdateNicknameDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  nickname: string;
}

export class UpdateAvatarDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  avatar: string;
}
