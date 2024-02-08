import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  Res,
  Get,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SigninDto } from './dto/signinDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @Post('/signup')
  async signup(@Res() response, @Body() signupDto: SignupDto) {
    try {
      this.logger.log(`signup: signupDto=${JSON.stringify(signupDto)}`);
      const { accessToken, user } = await this.authService.signup(signupDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'User has been created successfully',
        accessToken,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      this.logger.error(`signup: error=${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Post('signin')
  async signin(@Res() res, @Body() signinDto: SigninDto) {
    try {
      this.logger.log(`signin: signinDto=${JSON.stringify(signinDto)}`);
      const { accessToken, user } = await this.authService.signin(signinDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        accessToken,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      this.logger.error(`signin: error=${error.message}`);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Sign In failed. Please check your credentials.',
      });
    }
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Request() req) {
  //   console.log(`[AuthController] login`);
  //   return this.authService.login(req.user);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  getProtectedResource() {
    return 'This is a protected resource';
  }
}
