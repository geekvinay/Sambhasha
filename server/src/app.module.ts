import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBConfigService } from './bootstrap/mongo.config.service';
import { SocketGateway } from './common/socket.gateway';
import { SessionsModule } from './modules/schedule/schedule.module';
import * as cors from 'cors';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './modules/users/users.module';
import { RedisService } from './common/utils/redis/redis.service';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongoDBConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SessionsModule,
    UsersModule,
    OpenaiModule
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
