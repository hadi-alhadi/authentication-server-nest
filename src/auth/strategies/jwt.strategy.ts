import { Injectable, Logger } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // ToDo - move this to .env
    });
  }

  private readonly logger = new Logger(JwtStrategy.name);

  async validate(payload: any) {
    this.logger.log(`validate: payload=${JSON.stringify(payload)}`);
    return { userId: payload.sub, email: payload.email };
  }
}
