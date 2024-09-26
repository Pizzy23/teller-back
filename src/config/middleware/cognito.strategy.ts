// src/auth/cognito.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import * as dotenv from 'dotenv';

// Carregar variáveis do arquivo .env
dotenv.config();

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy) {
  private userPool: AmazonCognitoIdentity.CognitoUserPool;

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
            `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
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

    // Configurando o UserPool com as variáveis de ambiente
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  // Método de validação JWT
  async validate(payload: any) {
    return { userId: payload.sub, type: payload.type };
  }

  // Método para criar o token Cognito
  async createToken(username: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password,
      });

      const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: this.userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          resolve(accessToken); // Retorna o token JWT
        },
        onFailure: (err) => {
          reject(err); // Retorna o erro se houver falha
        },
      });
    });
  }
}
