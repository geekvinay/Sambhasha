import { Injectable, Post } from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { Types } from 'mongoose';

@Injectable()
export class SessionService {
    constructor(private scheduleRepository: ScheduleRepository) { }
    getHello(): string {
        return 'Hello Worlds!';
    }

    async createSchedule(body: any) {
        console.log('body: ', body);
        const res = await this.scheduleRepository.create(body);
        console.log('res: ', res);
        return res;
    }

    async getSchedule(params: any) {
        console.log('body: ', params);
        const res = await this.scheduleRepository.fetchOne({
            searchParams: {
                _id: new Types.ObjectId(params.scheduleId)
            }
        });
        console.log('res: ', res);
        return res;
    }
}
