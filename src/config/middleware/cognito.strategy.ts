// src/auth/cognito.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (
        request: any,
        rawJwtToken: string,
        done: (error: any, secretOrKey?: string | Buffer) => void,
      ) => {
        try {
          const response = await axios.get(
            `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
          );
          const keys = response.data.keys;
          const decoded = jwt.decode(rawJwtToken, { complete: true }) as any;
          const key = keys.find((k: any) => k.kid === decoded.header.kid);

          if (!key) {
            return done(new Error('Invalid token key'));
          }
          const pem = jwkToPem(key);
          done(null, pem);
        } catch (error) {
          done(error);
        }
      },
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, type: payload.type }; 
  }
}
