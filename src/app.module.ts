import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  RequestLoggerMiddleware,
  RateLimitMiddleware,
} from './config';
import { HttpExceptionFilter } from './config/middleware/http-catcher';
import { APP_FILTER } from '@nestjs/core';
import { ContextModule } from './context/context.module';
import { PassportModule } from '@nestjs/passport';
import { CognitoStrategy } from './config/middleware/cognito.strategy';

@Module({
  imports: [ContextModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    CognitoStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware, RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
