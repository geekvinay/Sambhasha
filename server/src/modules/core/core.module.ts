import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "../../config/env.config";
import { RedisService } from "src/common/utils/redis/redis.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [
    RedisService
  ],
  exports: [ RedisService ],
})
export class CoreModule {}
