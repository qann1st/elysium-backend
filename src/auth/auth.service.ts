import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { User, UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { Auth, AuthDocument } from './auth.schema';
import { SignInDto } from './dto/SignIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    @InjectModel(User.name) private dbUserService: Model<UserDocument>,
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
  ) {}

  public async signUp({ email, password, nickname, username }: CreateUserDto) {
    const emailExists = await this.dbUserService.findOne({ email });
    const userExists = await this.dbUserService.findOne({ username });
    if (userExists) {
      throw new BadRequestException('User name exists');
    }
    if (emailExists) {
      throw new BadRequestException('User email exists');
    }

    const hash = await this.hashData(password);
    const createdUser = await this.userService.createUser({
      email,
      password: hash,
      nickname,
      username,
    });

    const payload = {
      _id: createdUser._id,
      email: createdUser.email,
      nickname: createdUser.nickname,
      username: createdUser.username,
    };

    return await this.updateRefreshToken(createdUser._id, payload);
  }

  async signIn(data: SignInDto) {
    const user = await this.dbUserService
      .findOne({ email: data.email })
      .select('+password');
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const payload = {
      _id: user._id,
      email: user.email,
      nickname: user.nickname,
      username: user.username,
    };
    return await this.updateRefreshToken(user._id, payload);
  }

  async logout(userId: string, refreshToken: string) {
    const update = await this.authModel.findOneAndUpdate(
      { user: userId },
      { $pull: { refreshTokens: refreshToken } },
    );
    return { success: !!update };
  }

  async removeAllRefreshTokens(userId: string) {
    const update = await this.authModel.findOneAndUpdate(
      { user: userId },
      { refreshTokens: [] },
    );
    return { success: !!update };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const auth = await this.authModel
      .findOne({ user: userId })
      .populate('user');
    if (!auth || !auth.refreshTokens.includes(refreshToken))
      throw new ForbiddenException('Access Denied');
    const payload = {
      _id: auth.user._id,
      email: auth.user.email,
      nickname: auth.user.nickname,
      username: auth.user.username,
    };
    await this.logout(auth.user._id, refreshToken);
    return await this.updateRefreshToken(auth.user._id, payload);
  }

  async hashData(data: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  async updateRefreshToken(userId: string, payload: any) {
    const tokens = await this.getTokens(payload);

    await this.authModel.updateOne(
      { user: userId },
      { $addToSet: { refreshTokens: tokens.refreshToken } },
      { upsert: true },
    );

    return tokens;
  }

  private getConfProp(key: string) {
    return this.configService.get<string>(key);
  }

  async getTokens(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.getConfProp('JWT_ACCESS_SECRET'),
        expiresIn: this.getConfProp('JWT_ACCESS_EXPIRES') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.getConfProp('JWT_REFRESH_SECRET'),
        expiresIn: this.getConfProp('JWT_REFRESH_EXPIRES') || '15d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
