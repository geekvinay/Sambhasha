import { Types } from 'mongoose';

export type BaseDocument<T> = T & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
