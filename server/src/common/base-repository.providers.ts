import {
  FilterQuery,
  Model,
  UpdateQuery,
  ClientSession,
  QueryOptions,
} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import type { BaseRepository, BaseDocument, Params } from '../common/base-repository/interfaces';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UtilityService } from './utils/utility.service';
// import { CacheService } from '../../bootstrap/cache/cache.service';

interface Provider {
  provide: string;
  useClass: any;
}

const defaultParams = {
  isLean: true,
};

/**Repository provider for given schema name*/
function getProvider(name: string): Provider {
  class Repository<T> {
    constructor(
      @InjectModel(name)
      public model: Model<BaseDocument<T>>,
      // private readonly cacheService: CacheService,
      private readonly utils: UtilityService,
    ) {
      // this.logger.setContext(`BaseRepository-${this.model.modelName}`);
    }

    log() {
      // this.logger.info('Not in use');
      // this.logger.info(data);
    }

    /*
     *depreciated use countDocuments instead
     */
    async count(searchParams: FilterQuery<BaseDocument<T>>) {
      try {
        const count = await this.model.countDocuments(searchParams);
        return count;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }

    async countDocuments(searchParams: FilterQuery<BaseDocument<T>>) {
      try {
        const count = await this.model.countDocuments(searchParams);
        return count;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }

    async fetchOne(params: Params<T>, key?: string, ttl?: number) {
      try {
        params = { ...defaultParams, ...params };
        let doc;
        if (key) {
          // doc = await this.cacheService.get(key);
          if (!doc) {
            const entity = this.generateSearchQueryForFetchOne(params);
            doc = await entity.exec();
            if (doc) {
              // await this.cacheService.set(key, doc, ttl);
            }
          }
          return doc;
        }
        const entity = this.generateSearchQueryForFetchOne(params);
        doc = await entity.exec();
        return doc;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }

    async fetchOneForSave(params) {
      try {
        return this.model.findOne(params.searchParams || {});
      } catch (err) {
        console.error(err);
        throw err;
      }
    }

    async fetchForSave(params) {
      try {
        return this.model.find(params.searchParams || {});
      } catch (err) {
        console.error(err);
        throw err;
      }
    }

    async list(params: Params<T>, hKey?: string, key?: string) {
      try {
        const finalParams = { ...defaultParams, ...params };
        let doc;
        if (hKey && key) {
          // doc = await this.cacheService.hGet(hKey, key);
          if (!doc) {
            const entity = this.generateSearchQueryForFetch(finalParams);
            doc = await entity.exec();
            if (doc.length) {
              // await this.cacheService.hSet(hKey, key, doc);
            }
          }
          return doc;
        }
        const entity = this.generateSearchQueryForFetch(finalParams);
        doc = await entity.exec();
        return doc;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }

    async create(data: T, session?: ClientSession) {
      const entity = new this.model(data);

      const doc = this.utils.isEmptyOrNil(session)
        ? await entity.save()
        : await entity.save({ session: session });

      return doc;
    }

    async save(entity) {
      return entity.save();
    }

    async createMany(dataList: T[], session?: ClientSession) {
      const result = this.utils.isEmptyOrNil(session)
        ? await this.model.insertMany(dataList)
        : await this.model.insertMany(dataList, { session });

      return result;
    }

    async findOneAndUpdate(
      searchParams: FilterQuery<BaseDocument<T>>,
      data: UpdateQuery<BaseDocument<T>>,
      session?: ClientSession,
      options?: QueryOptions<BaseDocument<T>>,
    ) {
      try {
        const params = {
          ...data,
          updatedAt: new Date(),
        };

        const result = await this.model.findOneAndUpdate(searchParams, params, {
          new: true,
          ...(!this.utils.isEmptyOrNil(session) && session),
          ...options,
        });

        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async updateOne(
      searchParams: FilterQuery<BaseDocument<T>>,
      data: UpdateQuery<BaseDocument<T>>,
      session?: ClientSession,
    ) {
      const params = {
        ...data,
        updatedAt: new Date(),
      };

      const result = this.utils.isEmptyOrNil(session)
        ? await this.model.updateOne(searchParams, params)
        : await this.model.updateOne(searchParams, params, { session });

      return result;
    }

    async updateMany(
      searchParams: FilterQuery<BaseDocument<T>>,
      data: UpdateQuery<BaseDocument<T>>,
      session?: ClientSession,
    ) {
      const params = {
        ...data,
        updatedAt: new Date(),
      };

      const result = this.utils.isEmptyOrNil(session)
        ? await this.model.updateMany(searchParams, params)
        : await this.model.updateMany(searchParams, params, { session });

      return result;
    }

    async deleteOne(searchParams: FilterQuery<BaseDocument<T>>) {
      try {
        const result = await this.model.deleteOne(searchParams);
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async deleteMany(searchParams: FilterQuery<BaseDocument<T>>) {
      try {
        const result = await this.model.deleteMany(searchParams);
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async bulkWrite(writes, options?) {
      try {
        const result = await this.model.bulkWrite(writes, options);
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    generateSearchQueryForFetchOne(params: Params<T>) {
      if (!params.searchParams) {
        throw new HttpException(
          {
            message: 'searchParams missing from params',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      let entity = this.model.findOne(params.searchParams);

      if (params.project) {
        entity = this.model.findOne(
          params.searchParams || {},
          params.project || {},
        );
      }
      if (params.populate) {
        entity.populate(params.populate);
      }
      // if (params.deepPopulate) {
      //   entity.deepPopulate(params.deepPopulate);
      // }
      if (params.sort) {
        entity.sort(params.sort);
      }
      if (params.isLean) {
        entity.lean();
      }
      return entity;
    }

    generateSearchQueryForFetch(params: Params<T>) {
      if (!params.searchParams) {
        throw new HttpException(
          {
            message: 'searchParams missing from params',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      let entity = this.model.find(params.searchParams);

      if (params.project) {
        entity = this.model.find(
          params.searchParams || {},
          params.project || {},
        );
      }
      if (params.populate) {
        entity.populate(params.populate);
      }
      // if (params.deepPopulate) {
      //   entity.deepPopulate(params.deepPopulate);
      // }
      if (params.sort) {
        entity.sort(params.sort);
      }

      const page = params.page;
      const limit = params.limit;
      if (page && limit && page > 0) {
        params.skip = (page - 1) * limit;
      }

      if (params.skip) {
        entity.skip(params.skip);
      }
      if (params.limit) {
        entity.limit(params.limit);
      }
      if (params.isLean) {
        entity.lean();
      }
      return entity;
    }
    aggregate(query: any, collation: any) {
      const entity = this.model.aggregate(query).allowDiskUse(true);
      if (collation) {
        entity.collation(collation);
      }
      return entity.exec();
    }
  }

  return {
    provide: name,
    useClass: Repository,
  };
}

/**Provides repository for given features*/
export function getProviders(features): Provider[] {
  return features.map(({ name }) => getProvider(name));
}
