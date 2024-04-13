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

@Injectable()
export class UserRepository {
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
        @Inject(User.name) private userRepository: BaseRepository<User>,
        // // private cacheService: CacheService,
    ) { }

    //DB FUNCTIONS
    async create(data: User) {
        const user = await this.userRepository.create(data);
        return user;
    }

    async fetchOne(params: Params<User>) {
        if (params.searchParams?._id) {
            //delete project so anyone can't set projected data in cache for details
            delete params.project;
            const dbData = await this.userRepository.fetchOne(params);
            return dbData;
        }
        return await this.userRepository.fetchOne(params);
    }

    async list(params: Params<User>) {
        //get user list by _id, ids
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
}
