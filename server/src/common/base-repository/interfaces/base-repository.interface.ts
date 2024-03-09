import {
  FilterQuery,
  Model,
  UpdateQuery,
  ClientSession,
  QueryOptions,
} from 'mongoose';
import { BaseDocument } from './document.interface';
import { Params } from './params.interface';

/**Interface for BaseRepository */
export interface BaseRepository<T> {
  model: Model<T>;
  // TODO:: delete this if depreciate
  /**returns document count for filterQuery */
  count(searchParams: FilterQuery<T>): Promise<number>;

  /**returns document count for filterQuery new */
  countDocuments(searchParams: FilterQuery<T>): Promise<number>;

  /**returns single document for a given query*/
  fetchOne(
    params: Params<T>,
    key?: string,
    ttl?: number,
  ): Promise<BaseDocument<T>>;

  fetchOneForSave(params: Params<T>): Promise<BaseDocument<T>>;

  fetchForSave(params: Params<T>): Promise<Array<BaseDocument<T>>>;

  save(entity);

  /**returns all documents for a given query */
  list(
    params: Params<T>,
    hKey?: string,
    key?: string,
  ): Promise<Array<BaseDocument<T>>>;

  /**creates a single document in db*/
  create(data: T, session?: ClientSession);

  /**creates document list in db */
  createMany(dataList: T[], session?: ClientSession); //todo

  /**finds one and update the document*/
  findOneAndUpdate(
    searchParams: FilterQuery<T>,
    data: UpdateQuery<BaseDocument<T>>,
    session?: ClientSession,
    options?: QueryOptions<BaseDocument<T>>,
  ): Promise<BaseDocument<T>>;

  // /**find the document by Id*/
  // findById(id: any); //To do

  /**finds and update all matching document*/
  updateMany(
    searchParams: FilterQuery<T>,
    data: UpdateQuery<BaseDocument<T>>,
    session?: ClientSession,
  ); //todo return type

  /**finds and update all matching document*/
  updateOne(
    searchParams: FilterQuery<T>,
    data: UpdateQuery<BaseDocument<T>>,
    session?: ClientSession,
  ); //todo return type

  // Sends multiple `insertOne`, `updateOne`, `updateMany`, `replaceOne`,
  // `deleteOne`, and/or `deleteMany` operations to the MongoDB server in one
  // command.
  bulkWrite(writes, options?);

  /**deletes one matching document */
  deleteOne(searchParams: FilterQuery<T>); //todo return type

  /**deletes all matching document */
  deleteMany(searchParams: FilterQuery<T>); //todo return type

  /**calls logger instance from repository*/
  log(data: any): void;

  aggregate(query: any, collation?: any);
}
