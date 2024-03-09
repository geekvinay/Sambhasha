import { Types } from 'mongoose';

/** It extends document fields to schema defnition*/
export type Document<T> = T & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type DocumentMock<T> = T;
