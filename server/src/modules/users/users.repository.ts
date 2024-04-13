// @Inject(user.name) private userRepository: BaseRepository<user>
import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';
// import { CacheService } from 'src/bootstrap/cache/cache.service';
import {
    BaseDocument,
    BaseRepository,
    Params,
} from 'src/common/base-repository/interfaces';
import { User } from './users.schema';
import { RedisService } from 'src/common/utils/redis/redis.service';

@Injectable()
export class UserRepository {
    private USERS = "USR_";
    private ID = "ID_";
    private DETAIS = "DTLS_";

    constructor(
        @Inject(User.name) private userRepository: BaseRepository<User>,
        private cacheService: RedisService
    ) { }

    async create(data: User) {
        const user = await this.userRepository.create(data);
        return user;
    }

    async fetchOne(params: Params<User>) {
        const key = this.getKeyForUserDetails(params);
        console.log('key: ', key);
        if (false) {
            const cacheData = await this.getUserDetailsInCache(key);
            console.log('cacheData: ', Boolean(cacheData));
            if (cacheData) return cacheData;
            else {
                if (params.searchParams?._id) {
                    delete params.project;
                    const dbData = await this.userRepository.fetchOne(params);
                    console.log('dbData: ', dbData);
                    this.setUserDetailsInCache(key, dbData);
                    return dbData;
                }
            }
        }
        return await this.userRepository.fetchOne(params);
    }

    async list(params: Params<User>) {
        if (params.searchParams._id) return await this.listByIds(params);
        return await this.userRepository.list(params);
    }

    async listByIds(params: Params<User>) {
        if (params.searchParams._id) {
            let userIds = params.searchParams._id.$in || params.searchParams._id;
            userIds = Array.isArray(userIds) ? userIds : [userIds];

            const result = await Promise.all(
                userIds.map(
                    async (userId) =>
                        await this.fetchOne({ searchParams: { _id: userId } }),
                ),
            );
            return result.filter((user) => user);
        }
        return await this.list(params);
    }

    async findOneAndUpdate(
        searchParams: FilterQuery<BaseDocument<User>>,
        data: UpdateQuery<BaseDocument<User>>,
        action?: string,
    ) {
        const dbData = await this.userRepository.findOneAndUpdate(
            searchParams,
            data,
        );
        return dbData;
    }

    async updateMany(
        searchParams: FilterQuery<BaseDocument<User>>,
        data: UpdateQuery<BaseDocument<User>>,
    ) {
        const dbData = await this.userRepository.updateMany(searchParams, data);
        return dbData;
    }

    // ==============================> Redis keys <======================================== //
    getKeyForUserDetails(params: Params<User>) {
        if (params) {
            if (params.searchParams._id) {
                return this.USERS + this.DETAIS + this.ID + params.searchParams._id;
            }
        }
        return false;
    }

    // ==============================> Redis functions <=================================== //
    async setUserDetailsInCache(key: string, data: User) {
        if (key.length) {
            await this.cacheService.set(key, data); // Await the promise returned by `set`
        }
    }

    async getUserDetailsInCache(key: string): Promise<User | null> {
        if (key.length) {
            return await this.cacheService.get(key); // Await the promise returned by `get`
        }
        return null;
    }

    async deleteUserDetailsInCache(key: string) {
        if (key.length) {
            await this.cacheService.deleteByPattern(key); // Await the promise returned by `deleteByPattern`
        }
    }
}
