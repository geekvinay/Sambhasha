import {
    FilterQuery,
    Model,
    PipelineStage,
    UpdateQuery,
    QueryOptions
  } from 'mongoose';
  import { InjectModel } from '@nestjs/mongoose';
  import { HttpException, HttpStatus } from '@nestjs/common';
  import { BaseRepository } from './types/base-repo.interface';
  import { Document } from './types/document.interface';
  import { Params } from './types/params.interface';
  import { PpLoggerService } from 'src/common/logger/logger.service';
  import { ApmSpan } from '../decorators/apm.decorator';
  import { CacheService } from '../cache/cache.service';
  
  interface Provider {
    provide: string;
    useClass: any;
  }
  
  const defaultParams = {
    isLean: true,
  };
  
  /**Repository provider for given schema name*/
  function getProvider(name: string): Provider {
    class Repository<T> implements BaseRepository<T> {
      constructor(
        @InjectModel(name)
        public model: Model<Document<T>>,
        private logger: PpLoggerService,
        private cacheService: CacheService
      ) {
        this.logger.setContext(`BaseRepository-${this.model.modelName}`);
      }
      
      @ApmSpan()
      async count(searchParams: FilterQuery<Document<T>>) {
        try {
          const count = await this.model.count(searchParams);
          return count;
        } catch (err) {
          this.logger.error(err);
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
      @ApmSpan()
      async fetchOne(params: Params<T>, hashKey?: string, key?: string) {
        try {
          if(hashKey && key && params?.searchParams?._id){
            const detailsKey = key + params.searchParams._id;
            const cacheData = await this.cacheService.hGet(hashKey, detailsKey);
            if(cacheData) {
              return cacheData;
            } else {
              params = { ...defaultParams, ...params };
  
              const entity = this.generateSearchQueryForFetchOne(params);
              const doc = await entity.exec();
              doc && this.cacheService.hSet(hashKey, detailsKey, doc);
              return doc;
            }
          } else {
            params = { ...defaultParams, ...params };
  
            const entity = this.generateSearchQueryForFetchOne(params);
            const doc = await entity.exec();
            return doc;
          }
        } catch (err) {
          this.logger.error(err);
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
      @ApmSpan()
      async list(params: Params<T>) {
        try {
          params = { ...defaultParams, ...params };
          const entity = this.generateSearchQueryForFetch(params);
          const docs = await entity.exec();
          return docs || [];
        } catch (err) {
          this.logger.error(err);
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
      @ApmSpan()
      async distinct(key: string, params: Params<T>) {
        try {
          params = { ...defaultParams, ...params };
          const data = await this.model.distinct(key, params);
          return data || [];
        } catch (err) {
          this.logger.error(err);
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
      @ApmSpan()
      async create(data: T) {
        try {
          const entity = new this.model(data);
          const doc = await entity.save();
  
          return doc;
        } catch (error) {
          this.logger.error(error);
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
      @ApmSpan()
      async createMany(dataList: T[]) {
        try {
          const result = await this.model.insertMany(dataList);
          return result;
        } catch (error) {
          this.logger.error(error);
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
      @ApmSpan()
      async findOneAndUpdate(
        searchParams: FilterQuery<Document<T>>,
        data: UpdateQuery<Document<T>>,
        options?: QueryOptions,
        hashKey?: string, 
        key?: string
      ) {
        try {
          const doc = await this.model.findOneAndUpdate(searchParams, data, {
            new: true,
            ...options,
          }); //returns new document
  
          if(hashKey && key){
            const detailsKey = key + doc._id;
            this.cacheService.hDel(hashKey, detailsKey);
          }
          return doc;
        } catch (error) {
          this.logger.error(error);
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
      @ApmSpan()
      async updateMany(
        searchParams: FilterQuery<Document<T>>,
        data: UpdateQuery<Document<T>>,
        options: QueryOptions = {},
      ) {
        try {
          const result = await this.model.updateMany(searchParams, data, options);
          return result;
        } catch (error) {
          this.logger.error(error);
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
      @ApmSpan()
      async deleteOne(searchParams: FilterQuery<Document<T>>) {
        try {
          const result = await this.model.deleteOne(searchParams);
          return result;
        } catch (error) {
          this.logger.error(error);
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
      @ApmSpan()
      async deleteMany(searchParams: FilterQuery<Document<T>>) {
        try {
          const result = await this.model.deleteMany(searchParams);
          return result;
        } catch (error) {
          this.logger.error(error);
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
      private generateSearchQueryForFetchOne(params: Params<T>) {
        let entity = this.model.findOne(params.searchParams || {});
  
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
  
      private generateSearchQueryForFetch(params: Params<T>) {
        let entity = this.model.find(params.searchParams || {});
  
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
  
      @ApmSpan()
      async aggregate(pipeline: PipelineStage[]) {
        try {
          const result = await this.model.aggregate(pipeline);
          return result;
        } catch (error) {
          this.logger.error(error);
          throw error;
        }
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
  