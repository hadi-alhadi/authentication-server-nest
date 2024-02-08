import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SigninDto } from './dto/signinDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Res() response, @Body() signupDto: SignupDto) {
    try {
      const { accessToken, user } = await this.authService.signup(signupDto);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'User has been created successfully',
        accessToken,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Res() res, @Body() signinDto: SigninDto) {
    try {
      console.log(
        `[AuthController] signin: signinDto=${JSON.stringify(signinDto)}`,
      );
      const { accessToken, user } = await this.authService.signin(signinDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        accessToken,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
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
