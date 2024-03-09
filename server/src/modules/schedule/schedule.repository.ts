// @Inject(Schedule.name) private scheduleRepository: BaseRepository<Schedule>
import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';
// import { CacheService } from 'src/bootstrap/cache/cache.service';
import {
    BaseDocument,
    BaseRepository,
    Params,
} from 'src/common/base-repository/interfaces';
import { Schedule } from './schedule.schema';

@Injectable()
export class ScheduleRepository {
    POLL = 'POLL_';
    VOTE = 'VOTE_';
    USER = 'USER_';
    LIST = 'LIST_';
    COUNT = 'COUNT_';
    JOINED = 'JOINED_';
    ENTITY_ID = 'ENTITY_ID_';
    ATTEMPT = 'ATTEMPT_';
    DETAILS = 'DETAILS_';

    constructor(
        @Inject(Schedule.name) private scheduleRepository: BaseRepository<Schedule>,
        // // private cacheService: CacheService,
    ) { }

    //DB FUNCTIONS
    async create(data: Schedule) {
        const schedule = await this.scheduleRepository.create(data);
        return schedule;
    }

    async fetchOne(params: Params<Schedule>) {
        if (params.searchParams?._id) {
            //delete project so anyone can't set projected data in cache for details
            delete params.project;
            const dbData = await this.scheduleRepository.fetchOne(params);
            return dbData;
        }
        return await this.scheduleRepository.fetchOne(params);
    }

    async list(params: Params<Schedule>) {
        //get schedule list by _id, ids
        if (params.searchParams._id) return await this.listByIds(params);
        return await this.scheduleRepository.list(params);
    }

    async listByIds(params: Params<Schedule>) {
        if (params.searchParams._id) {
            let scheduleIds = params.searchParams._id.$in || params.searchParams._id;
            scheduleIds = Array.isArray(scheduleIds) ? scheduleIds : [scheduleIds];

            const result = await Promise.all(
                scheduleIds.map(
                    async (scheduleId) =>
                        await this.fetchOne({ searchParams: { _id: scheduleId } }),
                ),
            );
            return result.filter((schedule) => schedule);
        }
        return await this.list(params);
    }

    async findOneAndUpdate(
        searchParams: FilterQuery<BaseDocument<Schedule>>,
        data: UpdateQuery<BaseDocument<Schedule>>,
        action?: string,
    ) {
        const dbData = await this.scheduleRepository.findOneAndUpdate(
            searchParams,
            data,
        );
        return dbData;
    }

    async updateMany(
        searchParams: FilterQuery<BaseDocument<Schedule>>,
        data: UpdateQuery<BaseDocument<Schedule>>,
    ) {
        const dbData = await this.scheduleRepository.updateMany(searchParams, data);
        return dbData;
    }
}
