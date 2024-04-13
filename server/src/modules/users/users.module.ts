import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/common/base-repository.module';
import { User, UserSchema } from './users.schema';
import { UserService } from './users.service';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';
import { RedisService } from 'src/common/utils/redis/redis.service';
import { CoreModule } from '../core/core.module';

@Module({
    imports: [
        CoreModule,
        RepositoryModule.forFeature([
            {
              name: User.name,
              schema: UserSchema,
            },
        ]),
    ],
    controllers: [UsersController],
    providers: [UserService, UserRepository, UsersMapper, RedisService],
    exports: [UsersMapper, RedisService]
})
export class UsersModule {
}
