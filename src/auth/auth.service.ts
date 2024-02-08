import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signinDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;
    try {
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.usersService.signup({
        name,
        email,
        password: hashedPassword,
      });
      this.logger.log('signup: user saved');

      const payload = { email: user.email, name: user.name };
      return {
        accessToken: this.jwtService.sign(payload),
        user: user,
      };
    } catch (error) {
      console.error(`[AuthService] Error signup user: ${error.message}`);
      throw error;
    }
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    this.logger.log(
      `signin: email=${JSON.stringify(email)} , password=${JSON.stringify(password)}`,
    );

    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = { email: user.email, name: user.name };
      return {
        accessToken: this.jwtService.sign(payload),
        user: user,
      };
    } catch (error) {
      this.logger.error(`Error Sign In user: ${error.message}`);
      throw error;
    }
  }
}
