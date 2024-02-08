import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    console.log(
      `[LocalStrategy] validate: email=${email}, password=${password}`,
    );
    const user = await this.authService.signin({ email, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
