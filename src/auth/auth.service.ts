import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { IUser } from '../users/users.interface';
import omit from 'lodash/omit';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(email: string, pass: string): Promise<any> {
    this.logger.log(`validateUser: email=${email}`);
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(pass, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return omit(user, ['password']);
  }

  async signin(user: IUser) {
    this.logger.log(`signin: user=${JSON.stringify(user)}`);
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
      email: user.email,
      name: user.name,
    };
  }

  async signup(signupDto: SignupDto) {
    this.logger.log(`signup: signupDto=${JSON.stringify(signupDto)}`);
    const { name, email, password } = signupDto;
    try {
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.usersService.create({
        name,
        email,
        password: hashedPassword,
      });
      this.logger.log('signup: user saved');
      return user;
    } catch (error) {
      this.logger.error(`Error Sign In user: ${error.message}`);
      throw error;
    }
  }
}
