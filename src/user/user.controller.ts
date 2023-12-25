import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { UpdateAvatarDto, UpdateNicknameDto } from './dto/updateUser.dto';
import { User } from './user.schema';
import { UserService } from './user.service';
import { AddToFriendDto } from './dto/addToFriend.dto';
import { AcceptDeclineFriendDto } from './dto/acceptDeclineFriend.dto';

@UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Patch('/me/nickname')
  updateNickname(
    @Body(ValidationPipe) updateNicknameDto: UpdateNicknameDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.updateNickname({
      id: user._id,
      nickname: updateNicknameDto.nickname,
    });
  }

  @Patch('/me/avatar')
  updateAvatar(
    @Body(ValidationPipe) updateAvatarDto: UpdateAvatarDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.updateAvatar({
      id: user._id,
      avatar: updateAvatarDto.avatar,
    });
  }

  @Put('/addToFriend')
  requestFriend(
    @Body(ValidationPipe) addToFriend: AddToFriendDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.requestFriend(addToFriend, user);
  }

  @Put('/acceptFriend')
  acceptFriend(
    @Body(ValidationPipe) acceptFriend: AcceptDeclineFriendDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.acceptRequest(acceptFriend, user);
  }
}
