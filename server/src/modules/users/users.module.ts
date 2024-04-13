import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/common/base-repository.module';
import { User, UserSchema } from './users.schema';
import { UserService } from './users.service';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';

@Module({
    imports: [
        RepositoryModule.forFeature([
            {
              name: User.name,
              schema: UserSchema,
            },
        ]),
    ],
    controllers: [UsersController],
    providers: [UserService, UserRepository],
})
export class UsersModule {
}
