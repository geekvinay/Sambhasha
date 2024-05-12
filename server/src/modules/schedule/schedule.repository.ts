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
import { RedisService } from 'src/common/utils/redis/redis.service';

@Injectable()
export class ScheduleRepository {
    SCHEDULE = "SCHED_";
    DETAILS = "DTLS_";
    ID = "ID_";

    constructor(
        @Inject(Schedule.name) private scheduleRepository: BaseRepository<Schedule>,
        private cacheService: RedisService,
    ) { }

    //DB FUNCTIONS
    async create(data: Schedule) {
        return await this.scheduleRepository.create(data);
    }

    async fetchOne(params: Params<Schedule>) {
        const key = this.getKeyForScheduleDetails(params);
        console.log('key: ', key);
        if (key) {
            const cacheData = await this.getScheduleDetailsInCache(key);
            console.log('cacheData: ', Boolean(cacheData));
            if (cacheData) return cacheData;
            else {
                if (params.searchParams?._id) {
                    delete params.project;
                    const dbData = await this.scheduleRepository.fetchOne(params);
                    console.log('dbData: ', dbData);
                    this.setScheduleDetailsInCache(key, dbData);
                    return dbData;
                }
            }
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

    // ==============================> Redis keys <======================================== //
    getKeyForScheduleDetails(params: Params<Schedule>) {
        if (params) {
            if (params.searchParams._id) {
                return this.SCHEDULE + this.DETAILS + this.ID + params.searchParams._id;
            }
        }
        return false;
    }

    // ==============================> Redis functions <=================================== //
    async setScheduleDetailsInCache(key: string, data: Schedule) {
        if (key.length) {
            await this.cacheService.set(key, data); // Await the promise returned by `set`
        }
    }

    async getScheduleDetailsInCache(key: string): Promise<Schedule | null> {
        if (key.length) {
            return await this.cacheService.get(key); // Await the promise returned by `get`
        }
        return null;
    }

    async deleteScheduleDetailsInCache(key: string) {
        if (key.length) {
            await this.cacheService.deleteByPattern(key); // Await the promise returned by `deleteByPattern`
        }
    }
}
