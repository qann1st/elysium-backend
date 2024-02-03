import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignInDto } from './dto/SignIn.dto';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { AuthService } from './auth.service';
import { JwtRefreshPayload } from './strategies/refresh-token.strategy';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body(ValidationPipe) user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body(ValidationPipe) user: SignInDto) {
    return this.authService.signIn(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  logout(@CurrentUser() payload: JwtRefreshPayload) {
    return this.authService.logout(payload._id, payload.refreshToken);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@CurrentUser() payload: JwtRefreshPayload) {
    return this.authService.refreshTokens(payload._id, payload.refreshToken);
  }
}
