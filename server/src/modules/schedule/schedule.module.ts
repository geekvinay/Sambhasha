import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionController } from './schedule.controller';
import { SessionService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { RepositoryModule } from 'src/common/base-repository.module';
import { Schedule, ScheduleSchema } from './schedule.schema';

@Module({
    imports: [
        RepositoryModule.forFeature([
            {
              name: Schedule.name,
              schema: ScheduleSchema,
            },
        ]),
    ],
    controllers: [SessionController],
    providers: [SessionService, ScheduleRepository],
})
export class SessionsModule {
    constructor() {
        
    }
}
