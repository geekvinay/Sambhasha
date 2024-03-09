import { SearchOptions } from './search-options.interface';
import { FilterQuery } from 'mongoose';
import { Document } from './documentMock.interface';

/**params required to find documents*/
export interface Params<T> extends SearchOptions<Document<T>> {
  searchParams: FilterQuery<Document<T>>;
}
