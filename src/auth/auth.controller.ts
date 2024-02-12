import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Logger,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SigninDto } from './dto/signin.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    this.logger.log(`signup: signupDto=${JSON.stringify(signupDto)}`);
    const user = await this.authService.signup(signupDto);
    return this.authService.signin(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signin(@Body() signInDto: SigninDto, @Request() req) {
    this.logger.log(`signin: req.user=${JSON.stringify(req.user)}`);
    return this.authService.signin(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected')
  getProfile(@Request() req) {
    return req.user;
  }
}
