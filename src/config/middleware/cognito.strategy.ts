// src/auth/cognito.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy) {
  private token: string | null = null; // Variável para armazenar o token
  group: string[];

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (
        request: any,
        rawJwtToken: string,
        done: (error: any, secretOrKey?: string | Buffer) => void,
      ) => {
        try {
          if (!rawJwtToken) {
            return done(new Error('Token not provided or invalid'));
          }

          const response = await axios.get(
            `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
          );

          const keys = response.data.keys;
          const decoded = jwt.decode(rawJwtToken, { complete: true }) as any;

          if (!decoded || !decoded.header) {
            return done(new Error('Invalid token structure'));
          }
          this.group = decoded.payload['cognito:groups'];
          const key = keys.find((k: any) => k.kid === decoded.header.kid);

          if (!key) {
            return done(new Error('Invalid token key'));
          }

          const pem = jwkToPem(key);
          this.token = rawJwtToken;
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

  getToken(): string | null {
    return this.token;
  }

  getProfessions(): string[] | null {
    if (!this.group) return null;
    return this.group.filter(group => /^prof-[^-]+-[^-]+$/.test(group));
  }

  getSides(): string[] | null {
    if (!this.group) return null;
    return this.group.filter(group => /^side-[^-]+-[^-]+$/.test(group));
  }

  getHospitals(): string[] | null {
    if (!this.group) return null;
    return this.group.filter(group => /^hosp-[^-]+$/.test(group));
  }
}
